import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { db, hashPassword } from './server/db.ts';
import { User, PersonalNote, BookmarkItem, QuizAttemptRecord, QuestionServer } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Helper auth token validation (simple JWT-like token: base64(userId:timestamp:signature))
  const SECRET = 'rajnish_study_jwt_secret_key_2026';
  function createToken(userId: string): string {
    const payload = `${userId}:${Date.now()}`;
    const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    return Buffer.from(`${payload}:${sig}`).toString('base64');
  }

  function verifyToken(token?: string): string | null {
    if (!token) return null;
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const parts = decoded.split(':');
      if (parts.length !== 3) return null;
      const [userId, timestamp, sig] = parts;
      const expectedSig = crypto.createHmac('sha256', SECRET).update(`${userId}:${timestamp}`).digest('hex');
      if (sig === expectedSig) return userId;
    } catch {
      return null;
    }
    return null;
  }

  // Auth Middleware
  function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const userId = verifyToken(token);
    if (userId) {
      (req as any).userId = userId;
      (req as any).user = db.findUserById(userId);
    }
    next();
  }

  function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!(req as any).userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  }

  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user as User | undefined;
    if (!user || (user.role !== 'super_admin' && user.role !== 'content_admin')) {
      return res.status(403).json({ error: 'Access denied: Admin credentials required' });
    }
    next();
  }

  app.use(authMiddleware);

  // -------------------------------------------------------------
  // AUTH REST APIS
  // -------------------------------------------------------------
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, medium, targetExam } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'student',
      passwordHash: hashPassword(password),
      medium: medium === 'hi' ? 'hi' : 'en',
      targetExam: targetExam || 'General',
      streakDays: 1,
      totalStudyMinutes: 0,
      isPaidMember: false,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);
    const token = createToken(newUser.id);
    const { passwordHash, ...userClean } = newUser;
    return res.json({ token, user: userClean });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createToken(user.id);
    const { passwordHash, ...userClean } = user;
    return res.json({ token, user: userClean });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = (req as any).user as User | undefined;
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { passwordHash, ...userClean } = user as any;
    return res.json({ user: userClean });
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.passwordHash = hashPassword(newPassword || 'Reset@123');
    db.save();
    return res.json({ success: true, message: 'Password has been reset successfully' });
  });

  app.post('/api/auth/profile', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { name, medium, targetExam, phone } = req.body;
    const updated = db.updateUser(userId, { name, medium, targetExam, phone });
    return res.json({ user: updated });
  });

  // -------------------------------------------------------------
  // COURSE & HIERARCHY APIS
  // -------------------------------------------------------------
  app.get('/api/courses', (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    const courses = db.getCourses(category);
    return res.json({ courses });
  });

  app.get('/api/courses/:courseId/subjects', (req: Request, res: Response) => {
    const subjects = db.getSubjectsByCourse(req.params.courseId);
    return res.json({ subjects });
  });

  app.get('/api/subjects/:subjectId/chapters', (req: Request, res: Response) => {
    const chapters = db.getChaptersBySubject(req.params.subjectId);
    return res.json({ chapters });
  });

  app.get('/api/chapters/:chapterId', (req: Request, res: Response) => {
    const details = db.getChapterById(req.params.chapterId);
    if (!details) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    return res.json(details);
  });

  // -------------------------------------------------------------
  // QUIZ & MCQ ENGINE APIS
  // -------------------------------------------------------------
  // Get questions without correct answers exposed
  app.get('/api/quiz/questions/:chapterId', (req: Request, res: Response) => {
    const questions = db.getQuestionsForClient(req.params.chapterId);
    return res.json({ questions });
  });

  // Server-side instant verification for practice mode
  app.post('/api/quiz/verify', (req: Request, res: Response) => {
    const { questionId, selectedOption } = req.body;
    if (questionId === undefined || selectedOption === undefined) {
      return res.status(400).json({ error: 'questionId and selectedOption are required' });
    }
    const result = db.verifyAnswer(questionId, Number(selectedOption));
    if (!result) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.json(result);
  });

  // Full quiz submission
  app.post('/api/quiz/submit', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { chapterId, testType, answers, timeTakenSeconds, title } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers must be an array' });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const verifiedAnswers = answers.map((ans: { questionId: string; selectedOption: number }) => {
      if (ans.selectedOption === -1 || ans.selectedOption === undefined) {
        unattemptedCount++;
        return {
          questionId: ans.questionId,
          selectedOption: -1,
          isCorrect: false,
        };
      }
      const verified = db.verifyAnswer(ans.questionId, ans.selectedOption);
      if (verified && verified.isCorrect) {
        correctCount++;
        return {
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          isCorrect: true,
        };
      } else {
        incorrectCount++;
        return {
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          isCorrect: false,
        };
      }
    });

    const totalQuestions = answers.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const attemptRecord: QuizAttemptRecord = {
      id: `qa_${Date.now()}`,
      userId,
      chapterId: chapterId || undefined,
      title: title || 'Chapter Practice Test',
      testType: testType || 'chapter_practice',
      score: correctCount,
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unattempted: unattemptedCount,
      accuracy,
      timeTakenSeconds: timeTakenSeconds || 0,
      answers: verifiedAnswers,
      createdAt: new Date().toISOString(),
    };

    db.recordQuizAttempt(attemptRecord);
    return res.json({ result: attemptRecord });
  });

  // Full-Length Mock Test Generator
  app.get('/api/quiz/mock-test', (req: Request, res: Response) => {
    const allQuestions = db.getData().questions;
    // Sample up to 20 randomized questions across subjects
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 15).map((q) => {
      const { correctOptionIndex, explanationEn, explanationHi, ...clientFields } = q;
      return clientFields;
    });

    return res.json({
      titleEn: 'All India Full-Length Bilingual Mock Test 2026',
      titleHi: 'अखिल भारतीय संपूर्ण द्विभाषी मॉक टेस्ट 2026',
      durationMinutes: 20,
      totalMarks: selected.length * 2,
      questions: selected,
    });
  });

  // Quiz history
  app.get('/api/quiz/history', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const history = db.getQuizAttempts(userId);
    return res.json({ history });
  });

  // -------------------------------------------------------------
  // OFFICIAL NOTES APIS
  // -------------------------------------------------------------
  app.get('/api/notes/official/:chapterId', (req: Request, res: Response) => {
    const note = db.getOfficialNote(req.params.chapterId);
    if (!note) {
      // Fallback boilerplate note for any chapter
      const chapterDetails = db.getChapterById(req.params.chapterId);
      const titleEn = chapterDetails ? chapterDetails.chapter.nameEn : 'Chapter Notes';
      const titleHi = chapterDetails ? chapterDetails.chapter.nameHi : 'अध्याय नोट्स';

      return res.json({
        note: {
          id: `fallback_${req.params.chapterId}`,
          chapterId: req.params.chapterId,
          titleEn: `Study Notes: ${titleEn}`,
          titleHi: `अध्ययन नोट्स: ${titleHi}`,
          contentEn: {
            overview: `Comprehensive chapter study guide covering core syllabus concepts, analytical models, and exam strategies for ${titleEn}.`,
            keyDefinitions: [
              { term: 'Key Concept 1', definition: 'Fundamental principles and foundational definitions.' },
              { term: 'Standard Theorem', definition: 'Proven properties and essential exam corollaries.' },
            ],
            importantPoints: [
              'Review definitions thoroughly before attempting numerical problems.',
              'Pay attention to special boundary conditions and exceptions.',
              'Practice writing answers in neat bullet points for board & subjective exams.',
            ],
            formulas: [
              { name: 'Core Formula', formula: 'F = m · a', explanation: 'Basic relation governing physical dynamics.' },
            ],
            examples: [
              { problem: 'Standard sample question', solution: 'Step-by-step mathematical and conceptual proof.' },
            ],
            summary: 'Ensure regular revision to maximize retention and competitive scoring.',
            revisionTips: ['Solve at least 20 practice MCQs after reading this theory.'],
          },
          contentHi: {
            overview: `${titleHi} के मुख्य पाठ्यक्रम, सिद्धांतों और परीक्षा में पूछे जाने वाले महत्वपूर्ण बिंदुओं का संकलन।`,
            keyDefinitions: [
              { term: 'मुख्य अवधारणा 1', definition: 'मूल सिद्धांत और परीक्षा हेतु आवश्यक परिभाषाएं।' },
              { term: 'प्रमाणित नियम', definition: 'महत्वपूर्ण सूत्र एवं परीक्षा में आने वाले गुणधर्म।' },
            ],
            importantPoints: [
              'संख्यात्मक प्रश्न हल करने से पूर्व सभी मूल सिद्धांतों को समझें।',
              'अपवादों एवं विशेष स्थितियों को अलग से नोट करें।',
              'बोर्ड परीक्षा हेतु बिंदुवार उत्तर लिखने का अभ्यास करें।',
            ],
            formulas: [
              { name: 'मुख्य सूत्र', formula: 'F = m · a', explanation: 'गति के द्वितीय नियम का गणितीय रूप।' },
            ],
            examples: [
              { problem: 'मॉडल अभ्यास प्रश्न', solution: 'चरणबद्ध व्याख्या एवं हल।' },
            ],
            summary: 'नियमित अभ्यास और दोहराव ही सफलता की कुंजी है।',
            revisionTips: ['इस थ्योरी को पढ़ने के बाद तुरंत 20 वस्तुनिष्ठ प्रश्न हल करें।'],
          },
          updatedAt: new Date().toISOString(),
        },
      });
    }
    return res.json({ note });
  });

  // -------------------------------------------------------------
  // PERSONAL NOTES MAKER APIS
  // -------------------------------------------------------------
  app.get('/api/notes/personal', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const notes = db.getPersonalNotes(userId);
    return res.json({ notes });
  });

  app.post('/api/notes/personal', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id, title, content, chapterId, chapterTitle, tags, isBookmarked } = req.body;

    const note: PersonalNote = {
      id: id || `pnot_${Date.now()}`,
      userId,
      chapterId,
      chapterTitle,
      title: title || 'Untitled Note',
      content: content || '',
      tags: Array.isArray(tags) ? tags : [],
      isBookmarked: Boolean(isBookmarked),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    db.savePersonalNote(note);
    return res.json({ note });
  });

  app.delete('/api/notes/personal/:id', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const success = db.deletePersonalNote(req.params.id, userId);
    return res.json({ success });
  });

  // -------------------------------------------------------------
  // BOOKMARKS APIS
  // -------------------------------------------------------------
  app.get('/api/bookmarks', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const bookmarks = db.getBookmarks(userId);
    return res.json({ bookmarks });
  });

  app.post('/api/bookmarks', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { itemType, itemId, title, subtitle, targetId } = req.body;

    const bookmark: BookmarkItem = {
      id: `bm_${Date.now()}`,
      userId,
      itemType,
      itemId,
      title: title || 'Saved Item',
      subtitle,
      targetId: targetId || itemId,
      createdAt: new Date().toISOString(),
    };

    const saved = db.addBookmark(bookmark);
    return res.json({ bookmark: saved });
  });

  app.delete('/api/bookmarks/:id', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const success = db.removeBookmark(req.params.id, userId);
    return res.json({ success });
  });

  // -------------------------------------------------------------
  // ANALYTICS & DASHBOARD APIS
  // -------------------------------------------------------------
  app.get('/api/analytics/dashboard', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const analytics = db.getUserAnalytics(userId);
    return res.json({ analytics });
  });

  // -------------------------------------------------------------
  // ANNOUNCEMENTS & SEARCH APIS
  // -------------------------------------------------------------
  app.get('/api/announcements', (_req: Request, res: Response) => {
    const announcements = db.getAnnouncements();
    return res.json({ announcements });
  });

  app.get('/api/search', (req: Request, res: Response) => {
    const q = (req.query.q as string) || '';
    const results = db.globalSearch(q);
    return res.json({ results });
  });

  // -------------------------------------------------------------
  // ADMIN CONTROL CENTER APIS
  // -------------------------------------------------------------
  app.get('/api/admin/overview', requireAdmin, (_req: Request, res: Response) => {
    const data = db.getData();
    return res.json({
      totalCourses: data.courses.length,
      totalSubjects: data.subjects.length,
      totalChapters: data.chapters.length,
      totalQuestions: data.questions.length,
      totalStudents: data.users.filter((u) => u.role === 'student').length,
      totalQuizAttempts: data.quizAttempts.length,
      announcements: data.announcements,
      courses: data.courses,
      subjects: data.subjects,
      chapters: data.chapters,
      recentAuditLogs: data.auditLogs.slice(-10),
    });
  });

  app.post('/api/admin/courses', requireAdmin, (req: Request, res: Response) => {
    const course = req.body;
    course.id = course.id || `crs_${Date.now()}`;
    db.createCourse(course);
    return res.json({ course });
  });

  app.post('/api/admin/subjects', requireAdmin, (req: Request, res: Response) => {
    const subject = req.body;
    subject.id = subject.id || `sbj_${Date.now()}`;
    db.createSubject(subject);
    return res.json({ subject });
  });

  app.post('/api/admin/chapters', requireAdmin, (req: Request, res: Response) => {
    const chapter = req.body;
    chapter.id = chapter.id || `ch_${Date.now()}`;
    db.createChapter(chapter);
    return res.json({ chapter });
  });

  app.post('/api/admin/questions', requireAdmin, (req: Request, res: Response) => {
    const question = req.body as QuestionServer;
    question.id = question.id || `q_${Date.now()}`;
    db.addQuestion(question);
    return res.json({ question });
  });

  app.post('/api/admin/questions/bulk', requireAdmin, (req: Request, res: Response) => {
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'questions must be an array' });
    }
    const processed = questions.map((q, idx) => ({
      ...q,
      id: q.id || `q_bulk_${Date.now()}_${idx}`,
    }));
    const count = db.bulkImportQuestions(processed);
    return res.json({ count });
  });

  app.post('/api/admin/notes/official', requireAdmin, (req: Request, res: Response) => {
    const note = req.body;
    note.id = note.id || `not_${Date.now()}`;
    note.updatedAt = new Date().toISOString();
    db.saveOfficialNote(note);
    return res.json({ note });
  });

  app.get('/api/admin/students', requireAdmin, (_req: Request, res: Response) => {
    const students = db
      .getData()
      .users.filter((u) => u.role === 'student')
      .map(({ passwordHash, ...clean }) => clean);
    return res.json({ students });
  });

  // -------------------------------------------------------------
  // SUBSCRIPTION & PAID BATCH REST APIS
  // -------------------------------------------------------------
  // Public plan info: price, original price, UPI details, features
  app.get('/api/subscription/plan', (_req: Request, res: Response) => {
    const plan = db.getSubscriptionPlan();
    return res.json({ plan });
  });

  // Process student upgrade payment
  app.post('/api/subscription/pay', requireAuth, (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { amount, paymentMethod, utrNumber } = req.body;

    const result = db.unlockUserSubscription(userId, {
      amount: Number(amount) || db.getSubscriptionPlan().price,
      paymentMethod: paymentMethod || 'UPI (PhonePe / GPay / Paytm)',
      utrNumber,
    });

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...cleanUser } = result.user as any;
    return res.json({
      success: true,
      message: 'Paid Batch unlocked successfully! All content is now active.',
      user: cleanUser,
      transaction: result.transaction,
    });
  });

  // Admin: Get subscription details, active pricing, and transaction history
  app.get('/api/admin/subscription', requireAdmin, (_req: Request, res: Response) => {
    const plan = db.getSubscriptionPlan();
    const transactions = db.getPaymentTransactions();
    const totalRevenue = transactions
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const paidStudentsCount = db.getData().users.filter((u) => u.isPaidMember).length;

    return res.json({
      plan,
      transactions,
      totalRevenue,
      paidStudentsCount,
    });
  });

  // Admin: Update pricing, strike price, upiId, features
  app.put('/api/admin/subscription', requireAdmin, (req: Request, res: Response) => {
    const { price, originalPrice, titleHi, titleEn, subtitleHi, subtitleEn, upiId, upiReceiverName } = req.body;
    const updated = db.updateSubscriptionPlan({
      price: price !== undefined ? Number(price) : undefined,
      originalPrice: originalPrice !== undefined ? Number(originalPrice) : undefined,
      titleHi,
      titleEn,
      subtitleHi,
      subtitleEn,
      upiId,
      upiReceiverName,
    });
    return res.json({ success: true, plan: updated });
  });

  // Admin: Grant or revoke a student's paid access manually
  app.post('/api/admin/subscription/toggle-user', requireAdmin, (req: Request, res: Response) => {
    const { userId, isPaid } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const updatedUser = db.toggleUserPaidStatus(userId, Boolean(isPaid));
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...cleanUser } = updatedUser as any;
    return res.json({ success: true, user: cleanUser });
  });

  // Admin: Toggle demo vs paid lock status for any chapter
  app.post('/api/admin/subscription/toggle-chapter-demo', requireAdmin, (req: Request, res: Response) => {
    const { chapterId, isFreeDemo } = req.body;
    if (!chapterId) {
      return res.status(400).json({ error: 'chapterId is required' });
    }
    const updatedChapter = db.toggleChapterDemoStatus(chapterId, Boolean(isFreeDemo));
    if (!updatedChapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    return res.json({ success: true, chapter: updatedChapter });
  });

  // -------------------------------------------------------------
  // VITE / STATIC CLIENT ATTACHMENT
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Rajnish Study] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server launch error:', err);
  process.exit(1);
});
