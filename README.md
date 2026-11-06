# Rajnish Study (रजनीश स्टडी)

> **Learn Smart. Practice More. Achieve More.**
> *सीखें बेहतर। अभ्यास अधिक। सफलता निश्चित।*

A complete, production-ready, bilingual educational web platform and Progressive Web App (PWA) built for Indian school students, college students, and competitive exam aspirants (SSC, Banking, Railway, UPSC, State PCS, Police, and Defence).

---

## 🌟 Key Features

1. **Bilingual By Design (Hindi & English)**
   - First-time onboarding with medium selection (Hindi Medium / English Medium).
   - Instant language toggling anytime with persistent preference storage.
   - Complete UI, navigation, theory, MCQs, and explanations rendered in native Devanagari (`Noto Sans Devanagari`) and Latin typography (`Plus Jakarta Sans`).

2. **Complete Course & Exam Hierarchy**
   - **School & College**: Class 6, Class 7, Class 8, Class 9, Class 10, Class 11, Class 12, Graduation (BA, BSc, BCom), Post Graduation (MA, MSc, MCom).
   - **Competitive Exams**: SSC CGL, SSC CHSL, SSC MTS, SSC GD, Banking (IBPS PO/Clerk, SBI PO/Clerk), Railway (RRB NTPC, Group D), UPSC Civil Services, BPSC & State PCS, Police & Defence Exams, Teaching Exams (CTET, State TET).
   - Hierarchy: Course → Subjects → Chapters → Official Theory / MCQs / Personal Notes / Summary.

3. **Advanced MCQ Quiz Engine**
   - Unlimited MCQs with server-side answer validation (correct answers are never exposed to client memory before answering).
   - Immediate feedback: **Green** for correct answer, **Red** for incorrect answer, with instant explanation button.
   - Countdown timer, question palette, difficulty badges, and bookmarking.
   - Comprehensive result analysis: score, accuracy rate, correct/incorrect/unattempted breakdown, and retry incorrect questions.
   - Full-length mock test arena with mixed-subject question distribution.

4. **Official Study Notes & PDF Download Center**
   - Official chapter theory with key definitions, important points, formula sheets, worked examples, and quick revision tips.
   - Printable A4 PDF document generator with Rajnish Study branding, page numbers, date, and full Hindi Unicode support.
   - Download official chapter notes, question papers, personal notes, and test performance reports.

5. **Personal Notes Maker**
   - In-app rich notes editor supporting bilingual typing (Hindi & English).
   - Scoped chapter associations, search by title/tag, auto-saving, and PDF export.
   - Private to the authenticated user.

6. **Interactive Student Dashboard**
   - Daily learning streak tracker, total study time, overall quiz accuracy %, and completed chapters.
   - Weekly study activity bar charts and subject-wise performance meters.
   - "Continue Learning" shortcut and recent activity timeline.

7. **Secure Admin Control Center**
   - Role-based access control (Super Admin, Content Admin, Student).
   - Dynamic course, subject, and chapter creation.
   - Bulk MCQ import & export using JSON templates.
   - Student directory and system audit logs.

8. **PWA & Android-Ready**
   - Web App Manifest configured with icons, standalone display mode, and theme colors.
   - In-app install banner with iOS Safari guidance.
   - Offline detection banner and service worker asset caching.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, TypeScript (`server.ts` with Vite middleware)
- **Database**: Relational file-backed ACID JSON store (`server/db.ts`) located in `data/db.json`
- **PWA**: `vite-plugin-pwa` with Workbox precaching
- **Fonts**: Noto Sans Devanagari & Plus Jakarta Sans via Google Fonts

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file (see `.env.example`):
```env
PORT=3000
NODE_ENV=development
```

### 4. Running the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Default Demo Credentials
- **Student Account**:
  - Email: `student@rajnishstudy.com`
  - Password: `Student@123`
- **Super Admin Account**:
  - Email: `admin@rajnishstudy.com`
  - Password: `Admin@123`

---

## 📱 Android Deployment Instructions

To package Rajnish Study for Android devices using Capacitor or Trusted Web Activity (TWA):

### Option A: Capacitor (Recommended)
1. Install Capacitor CLI:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Rajnish Study" "com.rajnishstudy.app" --web-dir=dist
   ```
2. Build the production web bundle:
   ```bash
   npm run build
   ```
3. Add Android platform and copy assets:
   ```bash
   npx cap add android
   npx cap copy
   ```
4. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
5. In Android Studio, build signed APK or Android App Bundle (AAB) for Google Play Store.

### Option B: Bubblewrap / Trusted Web Activity (TWA)
1. Install Bubblewrap CLI:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. Initialize from your live PWA manifest:
   ```bash
   bubblewrap init --manifest="https://your-domain.com/manifest.webmanifest"
   ```
3. Build the release APK:
   ```bash
   bubblewrap build
   ```

---

## 🚢 Production Deployment

1. **Build Client Bundle**:
   ```bash
   npm run build
   ```
2. **Start Production Server**:
   ```bash
   npm start
   ```
   The Express server serves the optimized `dist` client bundle and handles `/api/*` REST endpoints on the specified `PORT`.

---

## 🔒 Security & Privacy

- Client-side sanitized question feeds (correct answers never leak in quiz endpoints).
- Secure password hashing using cryptographic salts.
- Protected admin endpoints with role-based middleware (`requireAdmin`).
- User data isolation (students can only read/edit their own personal notes and bookmarks).
