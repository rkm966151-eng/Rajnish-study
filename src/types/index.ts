export type Language = 'en' | 'hi';
export type UserRole = 'student' | 'content_admin' | 'super_admin';
export type CourseCategory = 'school_college' | 'competitive_exam';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  medium: Language;
  targetExam?: string;
  phone?: string;
  streakDays: number;
  totalStudyMinutes: number;
  isPaidMember: boolean;
  paidExpiryDate?: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  price: number;
  originalPrice: number;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  upiId: string;
  upiReceiverName: string;
  featuresHi: string[];
  featuresEn: string[];
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  paymentMethod: string;
  utrNumber?: string;
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

export interface Course {
  id: string;
  category: CourseCategory;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  slug: string;
  iconName: string;
  order: number;
  isPublished: boolean;
  totalSubjects?: number;
  totalChapters?: number;
}

export interface Subject {
  id: string;
  courseId: string;
  nameEn: string;
  nameHi: string;
  code?: string;
  iconName: string;
  order: number;
  chapterCount?: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNumber: number;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  estimatedMinutes: number;
  isPublished: boolean;
  isFreeDemo?: boolean;
  questionCount?: number;
}

export interface QuestionClient {
  id: string;
  chapterId: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  difficulty: Difficulty;
  imageUrl?: string;
  marks: number;
  topic?: string;
}

export interface QuestionServer extends QuestionClient {
  correctOptionIndex: number; // 0 to 3, kept secret on server
  explanationEn: string;
  explanationHi: string;
}

export interface QuestionAnswerVerification {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  correctOptionIndex: number;
  explanationEn: string;
  explanationHi: string;
}

export interface QuizAttemptRecord {
  id: string;
  userId: string;
  chapterId?: string;
  title: string;
  testType: 'chapter_practice' | 'mock_test';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  accuracy: number;
  timeTakenSeconds: number;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  createdAt: string;
}

export interface OfficialNote {
  id: string;
  chapterId: string;
  titleEn: string;
  titleHi: string;
  contentEn: {
    overview: string;
    keyDefinitions: { term: string; definition: string }[];
    importantPoints: string[];
    formulas: { name: string; formula: string; explanation: string }[];
    examples: { problem: string; solution: string }[];
    summary: string;
    revisionTips: string[];
  };
  contentHi: {
    overview: string;
    keyDefinitions: { term: string; definition: string }[];
    importantPoints: string[];
    formulas: { name: string; formula: string; explanation: string }[];
    examples: { problem: string; solution: string }[];
    summary: string;
    revisionTips: string[];
  };
  updatedAt: string;
}

export interface PersonalNote {
  id: string;
  userId: string;
  chapterId?: string;
  chapterTitle?: string;
  title: string;
  content: string;
  tags: string[];
  isBookmarked: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  itemType: 'question' | 'official_note' | 'chapter' | 'personal_note';
  itemId: string;
  title: string;
  subtitle?: string;
  targetId: string; // chapterId or questionId
  createdAt: string;
}

export interface Announcement {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  category: 'exam_alert' | 'new_notes' | 'system' | 'reminder';
  date: string;
  isActive: boolean;
}

export interface UserAnalytics {
  totalQuizAttempts: number;
  totalQuestionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  overallAccuracy: number;
  totalStudyMinutes: number;
  completedChaptersCount: number;
  personalNotesCount: number;
  bookmarksCount: number;
  streakDays: number;
  subjectPerformance: {
    subjectName: string;
    totalAttempted: number;
    accuracy: number;
  }[];
  recentActivity: {
    id: string;
    title: string;
    type: 'quiz' | 'note' | 'chapter';
    timestamp: string;
    score?: string;
  }[];
  weeklyActivityDays: {
    day: string;
    minutes: number;
    quizzes: number;
  }[];
}
