import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Course,
  Subject,
  Chapter,
  QuestionServer,
  OfficialNote,
  PersonalNote,
  BookmarkItem,
  Announcement,
  QuizAttemptRecord,
  SubscriptionPlan,
  PaymentTransaction,
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  courses: Course[];
  subjects: Subject[];
  chapters: Chapter[];
  questions: QuestionServer[];
  officialNotes: OfficialNote[];
  personalNotes: PersonalNote[];
  bookmarks: BookmarkItem[];
  announcements: Announcement[];
  quizAttempts: QuizAttemptRecord[];
  auditLogs: { id: string; userId: string; action: string; details: string; timestamp: string }[];
  subscriptionPlan: SubscriptionPlan;
  paymentTransactions: PaymentTransaction[];
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'rajnish_salt_2026').digest('hex');
}

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial rich seed data
function getInitialSeedData(): DatabaseSchema {
  const adminPasswordHash = hashPassword('Admin@123');
  const studentPasswordHash = hashPassword('Student@123');

  const users: (User & { passwordHash: string })[] = [
    {
      id: 'usr_admin_1',
      name: 'Rajnish Kumar (Super Admin)',
      email: 'admin@rajnishstudy.com',
      role: 'super_admin',
      passwordHash: adminPasswordHash,
      medium: 'hi',
      targetExam: 'All Exams',
      streakDays: 45,
      totalStudyMinutes: 3420,
      isPaidMember: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr_student_1',
      name: 'Amit Sharma',
      email: 'student@rajnishstudy.com',
      role: 'student',
      passwordHash: studentPasswordHash,
      medium: 'hi',
      targetExam: 'SSC CGL & Class 10',
      streakDays: 7,
      totalStudyMinutes: 480,
      isPaidMember: false,
      createdAt: '2026-02-15T00:00:00.000Z',
    },
  ];

  const courses: Course[] = [
    // School & College
    {
      id: 'crs_class6',
      category: 'school_college',
      nameEn: 'Class 6 (NCERT & State Boards)',
      nameHi: 'कक्षा 6 (एनसीईआरटी एवं राज्य बोर्ड)',
      descriptionEn: 'Complete foundation syllabus for Science, Mathematics, Social Science and Hindi.',
      descriptionHi: 'विज्ञान, गणित, सामाजिक विज्ञान एवं हिंदी का संपूर्ण आधारभूत पाठ्यक्रम।',
      slug: 'class-6',
      iconName: 'GraduationCap',
      order: 1,
      isPublished: true,
    },
    {
      id: 'crs_class7',
      category: 'school_college',
      nameEn: 'Class 7',
      nameHi: 'कक्षा 7',
      descriptionEn: 'Middle school curriculum with core concepts and chapter practice.',
      descriptionHi: 'माध्यमिक स्तर का पाठ्यक्रम एवं अध्यायवार अभ्यास।',
      slug: 'class-7',
      iconName: 'BookOpen',
      order: 2,
      isPublished: true,
    },
    {
      id: 'crs_class8',
      category: 'school_college',
      nameEn: 'Class 8',
      nameHi: 'कक्षा 8',
      descriptionEn: 'Essential foundation for secondary school exams.',
      descriptionHi: 'माध्यमिक बोर्ड की तैयारी हेतु आवश्यक नींव।',
      slug: 'class-8',
      iconName: 'BookMarked',
      order: 3,
      isPublished: true,
    },
    {
      id: 'crs_class9',
      category: 'school_college',
      nameEn: 'Class 9',
      nameHi: 'कक्षा 9',
      descriptionEn: 'Pre-board curriculum in Science, Math, and Social Science.',
      descriptionHi: 'विज्ञान, गणित एवं सामाजिक विज्ञान का प्री-बोर्ड पाठ्यक्रम।',
      slug: 'class-9',
      iconName: 'School',
      order: 4,
      isPublished: true,
    },
    {
      id: 'crs_class10',
      category: 'school_college',
      nameEn: 'Class 10 (Board Exam Special)',
      nameHi: 'कक्षा 10 (बोर्ड परीक्षा विशेष)',
      descriptionEn: 'Complete 10th Board preparation: Science, Mathematics, Social Science, Hindi & English.',
      descriptionHi: '10वीं बोर्ड परीक्षा की संपूर्ण तैयारी: विज्ञान, गणित, सामाजिक विज्ञान एवं भाषाएं।',
      slug: 'class-10',
      iconName: 'Award',
      order: 5,
      isPublished: true,
    },
    {
      id: 'crs_class11',
      category: 'school_college',
      nameEn: 'Class 11 (Science & Arts)',
      nameHi: 'कक्षा 11 (विज्ञान एवं कला संकाय)',
      descriptionEn: 'Higher secondary foundation: Physics, Chemistry, Biology, Math and Humanities.',
      descriptionHi: 'उच्चतर माध्यमिक स्तर: भौतिकी, रसायन, जीवविज्ञान, गणित एवं मानविकी।',
      slug: 'class-11',
      iconName: 'Atom',
      order: 6,
      isPublished: true,
    },
    {
      id: 'crs_class12',
      category: 'school_college',
      nameEn: 'Class 12 (Board & Entrance)',
      nameHi: 'कक्षा 12 (बोर्ड एवं प्रवेश परीक्षा)',
      descriptionEn: 'Physics, Chemistry, Math, Biology with Board Exam & CUET preparation.',
      descriptionHi: 'भौतिकी, रसायन, गणित, जीवविज्ञान बोर्ड परीक्षा एवं सीयूईटी की तैयारी।',
      slug: 'class-12',
      iconName: 'Compass',
      order: 7,
      isPublished: true,
    },
    {
      id: 'crs_graduation',
      category: 'school_college',
      nameEn: 'Graduation (BA, BSc, BCom)',
      nameHi: 'स्नातक (बी.ए., बी.एससी., बी.कॉम.)',
      descriptionEn: 'Undergraduate core subjects, references and semester summaries.',
      descriptionHi: 'स्नातक स्तर के मुख्य विषय, संदर्भ सामग्री एवं सेमेस्टर नोट्स।',
      slug: 'graduation',
      iconName: 'Library',
      order: 8,
      isPublished: true,
    },
    {
      id: 'crs_post_graduation',
      category: 'school_college',
      nameEn: 'Post Graduation (MA, MSc, MCom)',
      nameHi: 'स्नातकोत्तर (एम.ए., एम.एससी., एम.कॉम.)',
      descriptionEn: 'Advanced university subjects, research methodologies, and UGC NET preparation.',
      descriptionHi: 'उच्च शोध पत्र, विश्वविद्यालयीय पाठ्यक्रम एवं यूजीसी नेट तैयारी।',
      slug: 'post-graduation',
      iconName: 'FileText',
      order: 9,
      isPublished: true,
    },

    // Competitive Exams
    {
      id: 'crs_ssc_cgl',
      category: 'competitive_exam',
      nameEn: 'SSC CGL (Combined Graduate Level)',
      nameHi: 'एसएससी सीजीएल (Combined Graduate Level)',
      descriptionEn: 'Tier-1 & Tier-2 complete preparation: Math, Reasoning, English, General Awareness.',
      descriptionHi: 'टियर-1 एवं टियर-2 की संपूर्ण तैयारी: गणित, तर्कशक्ति, अंग्रेजी, सामान्य अध्ययन।',
      slug: 'ssc-cgl',
      iconName: 'Target',
      order: 10,
      isPublished: true,
    },
    {
      id: 'crs_ssc_chsl',
      category: 'competitive_exam',
      nameEn: 'SSC CHSL & MTS & GD',
      nameHi: 'एसएससी सीएचएसएल, एमटीएस एवं जीडी',
      descriptionEn: 'Comprehensive preparation for 10+2 and matriculation level government staff exams.',
      descriptionHi: '10+2 एवं 10वीं स्तर की सरकारी कर्मचारी चयन परीक्षाओं की तैयारी।',
      slug: 'ssc-chsl-mts-gd',
      iconName: 'ShieldCheck',
      order: 11,
      isPublished: true,
    },
    {
      id: 'crs_banking',
      category: 'competitive_exam',
      nameEn: 'Banking (IBPS PO/Clerk, SBI PO/Clerk)',
      nameHi: 'बैंकिंग (आईबीपीएस पीओ/क्लर्क, एसबीआई पीओ/क्लर्क)',
      descriptionEn: 'Quantitative Aptitude, Reasoning Ability, English, Financial & Banking Awareness.',
      descriptionHi: 'संख्यात्मक अभियोग्यता, तर्कशक्ति, अंग्रेजी एवं वित्तीय जागरूकता।',
      slug: 'banking-po-clerk',
      iconName: 'Landmark',
      order: 12,
      isPublished: true,
    },
    {
      id: 'crs_railway',
      category: 'competitive_exam',
      nameEn: 'Railway RRB (NTPC & Group D)',
      nameHi: 'रेलवे आरआरबी (एनटीपीसी एवं ग्रुप डी)',
      descriptionEn: 'General Science, Math, General Intelligence & Reasoning for RRB recruitments.',
      descriptionHi: 'सामान्य विज्ञान, गणित, सामान्य बुद्धिमत्ता एवं करंट अफेयर्स।',
      slug: 'railway-ntpc-group-d',
      iconName: 'Train',
      order: 13,
      isPublished: true,
    },
    {
      id: 'crs_upsc',
      category: 'competitive_exam',
      nameEn: 'UPSC Civil Services (IAS/IPS)',
      nameHi: 'संघ लोक सेवा आयोग (UPSC सिविल सेवा)',
      descriptionEn: 'General Studies Prelims & Mains: History, Polity, Geography, Economy, CSAT.',
      descriptionHi: 'सामान्य अध्ययन प्रारंभिक एवं मुख्य परीक्षा: इतिहास, राजव्यवस्था, भूगोल, अर्थव्यवस्था, सीएसैट।',
      slug: 'upsc-civil-services',
      iconName: 'Flame',
      order: 14,
      isPublished: true,
    },
    {
      id: 'crs_state_pcs',
      category: 'competitive_exam',
      nameEn: 'BPSC & State PCS (UPPSC, MPPSC, JPSC)',
      nameHi: 'बीपीएससी एवं राज्य पीसीएस (BPSC, UPPSC)',
      descriptionEn: 'State administrative services preparation with special focus on state GK & GS.',
      descriptionHi: 'राज्य प्रशासनिक सेवा परीक्षा: राज्य विशेष सामान्य ज्ञान एवं सामान्य अध्ययन।',
      slug: 'bpsc-state-pcs',
      iconName: 'Building',
      order: 15,
      isPublished: true,
    },
    {
      id: 'crs_police_defence',
      category: 'competitive_exam',
      nameEn: 'Police & Defence Exams (NDA, CDS, SI, Constable)',
      nameHi: 'पुलिस एवं रक्षा परीक्षाएं (दरोगा, सिपाही, एनडीए, सीडीएस)',
      descriptionEn: 'Armed forces, state police sub-inspector & constable exam prep.',
      descriptionHi: 'सशस्त्र बल, राज्य पुलिस दरोगा एवं सिपाही भर्ती परीक्षा की संपूर्ण तैयारी।',
      slug: 'police-defence-exams',
      iconName: 'Shield',
      order: 16,
      isPublished: true,
    },
    {
      id: 'crs_teaching',
      category: 'competitive_exam',
      nameEn: 'Teaching Exams (CTET, State TET, BPSC TRE)',
      nameHi: 'शिक्षक भर्ती परीक्षाएं (सीटीईटी, राज्य टीईटी, बीपीएससी टीआरई)',
      descriptionEn: 'Child Development & Pedagogy, Subject Pedagogy, Environmental Studies.',
      descriptionHi: 'बाल विकास एवं शिक्षाशास्त्र, विषय शिक्षण एवं पर्यावरण अध्ययन।',
      slug: 'teaching-ctet-tet',
      iconName: 'Sparkles',
      order: 17,
      isPublished: true,
    },
  ];

  const subjects: Subject[] = [
    // Class 6
    { id: 'sbj_c6_sci', courseId: 'crs_class6', nameEn: 'Science', nameHi: 'विज्ञान', iconName: 'Atom', order: 1 },
    { id: 'sbj_c6_math', courseId: 'crs_class6', nameEn: 'Mathematics', nameHi: 'गणित', iconName: 'Calculator', order: 2 },
    { id: 'sbj_c6_sst', courseId: 'crs_class6', nameEn: 'Social Science', nameHi: 'सामाजिक विज्ञान', iconName: 'Globe', order: 3 },

    // Class 10
    { id: 'sbj_c10_sci', courseId: 'crs_class10', nameEn: 'Science', nameHi: 'विज्ञान', iconName: 'Atom', order: 1 },
    { id: 'sbj_c10_math', courseId: 'crs_class10', nameEn: 'Mathematics', nameHi: 'गणित', iconName: 'Calculator', order: 2 },
    { id: 'sbj_c10_sst', courseId: 'crs_class10', nameEn: 'Social Science', nameHi: 'सामाजिक विज्ञान', iconName: 'Globe', order: 3 },

    // Class 12
    { id: 'sbj_c12_phy', courseId: 'crs_class12', nameEn: 'Physics', nameHi: 'भौतिक विज्ञान', iconName: 'Zap', order: 1 },
    { id: 'sbj_c12_chem', courseId: 'crs_class12', nameEn: 'Chemistry', nameHi: 'रसायन विज्ञान', iconName: 'FlaskConical', order: 2 },
    { id: 'sbj_c12_math', courseId: 'crs_class12', nameEn: 'Mathematics', nameHi: 'गणित', iconName: 'Calculator', order: 3 },

    // SSC CGL
    { id: 'sbj_ssc_gk', courseId: 'crs_ssc_cgl', nameEn: 'General Studies & Polity', nameHi: 'सामान्य अध्ययन एवं राजव्यवस्था', iconName: 'BookOpen', order: 1 },
    { id: 'sbj_ssc_quant', courseId: 'crs_ssc_cgl', nameEn: 'Quantitative Aptitude', nameHi: 'संख्यात्मक अभियोग्यता (गणित)', iconName: 'TrendingUp', order: 2 },
    { id: 'sbj_ssc_reasoning', courseId: 'crs_ssc_cgl', nameEn: 'General Intelligence & Reasoning', nameHi: 'सामान्य बुद्धिमत्ता एवं तर्कशक्ति', iconName: 'Brain', order: 3 },

    // Railway
    { id: 'sbj_rly_reasoning', courseId: 'crs_railway', nameEn: 'Reasoning Ability', nameHi: 'तर्कशक्ति परीक्षण', iconName: 'Brain', order: 1 },
    { id: 'sbj_rly_sci', courseId: 'crs_railway', nameEn: 'General Science', nameHi: 'सामान्य विज्ञान', iconName: 'Atom', order: 2 },

    // Banking
    { id: 'sbj_bnk_quant', courseId: 'crs_banking', nameEn: 'Quantitative Aptitude & DI', nameHi: 'संख्यात्मक योग्यता एवं डीआई', iconName: 'BarChart3', order: 1 },

    // UPSC
    { id: 'sbj_upsc_history', courseId: 'crs_upsc', nameEn: 'Modern Indian History', nameHi: 'आधुनिक भारत का इतिहास', iconName: 'Clock', order: 1 },
  ];

  const chapters: Chapter[] = [
    // Class 6 Science
    {
      id: 'ch_c6_sci_1',
      subjectId: 'sbj_c6_sci',
      chapterNumber: 1,
      nameEn: 'Components of Food',
      nameHi: 'भोजन के घटक',
      descriptionEn: 'Nutrients, carbohydrates, proteins, fats, vitamins, minerals, and balanced diet.',
      descriptionHi: 'पोषक तत्व, कार्बोहाइड्रेट, प्रोटीन, वसा, विटामिन, खनिज लवण एवं संतुलित आहार।',
      estimatedMinutes: 30,
      isPublished: true,
      isFreeDemo: false,
    },
    // Class 6 Math
    {
      id: 'ch_c6_math_1',
      subjectId: 'sbj_c6_math',
      chapterNumber: 1,
      nameEn: 'Knowing Our Numbers',
      nameHi: 'अपनी संख्याओं की जानकारी',
      descriptionEn: 'Place value, Indian and International numeral systems, estimation, and Roman numerals.',
      descriptionHi: 'स्थानीय मान, भारतीय एवं अंतर्राष्ट्रीय संख्या पद्धति, सन्निकटन एवं रोमन अंक।',
      estimatedMinutes: 35,
      isPublished: true,
      isFreeDemo: false,
    },
    // Class 10 Science (FREE DEMO)
    {
      id: 'ch_c10_sci_1',
      subjectId: 'sbj_c10_sci',
      chapterNumber: 1,
      nameEn: 'Chemical Reactions and Equations',
      nameHi: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
      descriptionEn: 'Balancing chemical equations, combination, decomposition, displacement, redox reactions.',
      descriptionHi: 'रासायनिक समीकरण संतुलित करना, संयोजन, वियोजन, विस्थापन एवं उपचयन-अपचयन अभिक्रियाएँ।',
      estimatedMinutes: 45,
      isPublished: true,
      isFreeDemo: true,
    },
    // Class 10 Math
    {
      id: 'ch_c10_math_1',
      subjectId: 'sbj_c10_math',
      chapterNumber: 1,
      nameEn: 'Real Numbers',
      nameHi: 'वास्तविक संख्याएँ',
      descriptionEn: 'Fundamental Theorem of Arithmetic, irrationality proof of root 2 & 3, rational decimal expansions.',
      descriptionHi: 'अंकगणित की आधारभूत प्रमेय, अपरिमेय संख्याओं का सत्यापन, परिमेय संख्याओं का दशमलव प्रसार।',
      estimatedMinutes: 40,
      isPublished: true,
      isFreeDemo: false,
    },
    // Class 12 Physics
    {
      id: 'ch_c12_phy_1',
      subjectId: 'sbj_c12_phy',
      chapterNumber: 1,
      nameEn: 'Electric Charges and Fields',
      nameHi: 'वैद्युत आवेश तथा क्षेत्र',
      descriptionEn: 'Coulombs law, electric field, electric flux, Gauss law and its practical applications.',
      descriptionHi: 'कूलॉम का नियम, विद्युत क्षेत्र, विद्युत फ्लक्स, गॉस का नियम एवं इसके अनुप्रयोग।',
      estimatedMinutes: 50,
      isPublished: true,
      isFreeDemo: false,
    },
    // SSC GK
    {
      id: 'ch_ssc_gk_1',
      subjectId: 'sbj_ssc_gk',
      chapterNumber: 1,
      nameEn: 'Indian Constitution: Preamble & Fundamental Rights',
      nameHi: 'भारतीय संविधान: प्रस्तावना एवं मौलिक अधिकार',
      descriptionEn: 'Articles 12 to 35, constitutional amendments, writ jurisdiction, and landmark cases.',
      descriptionHi: 'अनुच्छेद 12 से 35, संविधान संशोधन, रिट अधिकारिता एवं प्रमुख वाद।',
      estimatedMinutes: 45,
      isPublished: true,
      isFreeDemo: false,
    },
    // SSC Math
    {
      id: 'ch_ssc_quant_1',
      subjectId: 'sbj_ssc_quant',
      chapterNumber: 1,
      nameEn: 'Percentage and Profit & Loss',
      nameHi: 'प्रतिशतता एवं लाभ तथा हानि',
      descriptionEn: 'Shortcuts, fractional values, successive percentage, marked price, and discount calculations.',
      descriptionHi: 'शॉर्टकट ट्रिक्स, भिन्न रूप, क्रमागत प्रतिशत, अंकित मूल्य एवं बट्टा संबंधी प्रश्न।',
      estimatedMinutes: 45,
      isPublished: true,
      isFreeDemo: false,
    },
    // Railway Reasoning
    {
      id: 'ch_rly_reas_1',
      subjectId: 'sbj_rly_reasoning',
      chapterNumber: 1,
      nameEn: 'Coding-Decoding and Number Series',
      nameHi: 'कोडिंग-डिकोडिंग एवं संख्या श्रृंखला',
      descriptionEn: 'Alphabetical positional patterns, reverse letter coding, and arithmetic progression series.',
      descriptionHi: 'वर्णमाला स्थिति नियम, विपरीत अक्षर कोड एवं गणितीय अनुक्रम श्रृंखला।',
      estimatedMinutes: 35,
      isPublished: true,
      isFreeDemo: false,
    },
    // Banking Quant
    {
      id: 'ch_bnk_quant_1',
      subjectId: 'sbj_bnk_quant',
      chapterNumber: 1,
      nameEn: 'Data Interpretation (Bar & Pie Charts)',
      nameHi: 'आंकड़ा निर्वचन (बार ग्राफ एवं पाई चार्ट)',
      descriptionEn: 'High-speed calculation techniques, percentage ratios, and multi-layered caselets.',
      descriptionHi: 'तीव्र गणना तकनीक, प्रतिशत अनुपात एवं बहुस्तरीय केसलेट विश्लेषण।',
      estimatedMinutes: 40,
      isPublished: true,
      isFreeDemo: false,
    },
    // UPSC History
    {
      id: 'ch_upsc_hist_1',
      subjectId: 'sbj_upsc_history',
      chapterNumber: 1,
      nameEn: 'Revolt of 1857 & National Awakening',
      nameHi: '1857 का विद्रोह एवं राष्ट्रीय पुनर्जागरण',
      descriptionEn: 'Causes, spread, leaders, causes of failure, and constitutional impact of Crown rule 1858.',
      descriptionHi: 'विद्रोह के कारण, प्रसार, प्रमुख नायक, असफलता के कारण एवं 1858 का क्राउन शासन प्रभाव।',
      estimatedMinutes: 55,
      isPublished: true,
      isFreeDemo: false,
    },
  ];

  // Official study notes for Class 10 Science (Chemical Reactions)
  const officialNotes: OfficialNote[] = [
    {
      id: 'not_c10_sci_1',
      chapterId: 'ch_c10_sci_1',
      titleEn: 'Comprehensive Study Notes: Chemical Reactions and Equations',
      titleHi: 'विस्तृत अध्ययन नोट्स: रासायनिक अभिक्रियाएँ एवं समीकरण',
      contentEn: {
        overview:
          'A chemical reaction is a process in which one or more substances (reactants) are converted to one or more different substances (products). In any chemical reaction, chemical bonds between atoms are formed or broken.',
        keyDefinitions: [
          {
            term: 'Chemical Reaction',
            definition:
              'A process where reactants undergo a transformation involving change in state, temperature, color, or evolution of gas to form products.',
          },
          {
            term: 'Law of Conservation of Mass',
            definition:
              'Mass can neither be created nor destroyed in a chemical reaction. Total mass of reactants equals total mass of products.',
          },
          {
            term: 'Catalyst',
            definition: 'A substance that increases the rate of reaction without undergoing any permanent chemical change itself.',
          },
        ],
        importantPoints: [
          'Signs of chemical change: change in state, change in color, evolution of gas, change in temperature.',
          'Always balance equations using coefficients, never alter chemical formulas/subscripts.',
          'Oxidation is gain of oxygen or loss of electrons/hydrogen; Reduction is loss of oxygen or gain of electrons/hydrogen.',
          'Rusting of iron requires both oxygen and moisture: 4Fe + 3O2 + xH2O -> 2Fe2O3.xH2O.',
          'Antioxidants and nitrogen flushing prevent rancidity in fatty foods.',
        ],
        formulas: [
          {
            name: 'Respiration (Exothermic Reaction)',
            formula: 'C6H12O6 + 6O2 -> 6CO2 + 6H2O + Energy (ATP)',
            explanation: 'Glucose breaks down in cells with oxygen, releasing vital metabolic energy.',
          },
          {
            name: 'Slaking of Lime',
            formula: 'CaO (Quicklime) + H2O -> Ca(OH)2 (Slaked Lime) + Heat',
            explanation: 'Vigorous combination reaction releasing a large amount of heat energy.',
          },
          {
            name: 'Photosynthesis (Endothermic Reaction)',
            formula: '6CO2 + 12H2O --(Sunlight/Chlorophyll)--> C6H12O6 + 6O2 + 6H2O',
            explanation: 'Plants absorb radiant light energy to synthesize glucose.',
          },
        ],
        examples: [
          {
            problem: 'Balance the skeletal equation: Fe + H2O -> Fe3O4 + H2',
            solution:
              'Step 1: Balance Fe: 3Fe. Step 2: Balance O: 4H2O. Step 3: Balance H: 4H2. Balanced equation: 3Fe + 4H2O -> Fe3O4 + 4H2.',
          },
          {
            problem: 'Why do silver articles turn black when exposed to air?',
            solution:
              'Silver reacts with trace hydrogen sulfide (H2S) in air to form a thin black coating of silver sulfide (Ag2S). 2Ag + H2S -> Ag2S + H2.',
          },
        ],
        summary:
          'Chemical reactions obey the law of conservation of mass. Reactions are categorized into combination, decomposition, displacement, double displacement, precipitation, and redox reactions based on reactant behavior and energy transfer.',
        revisionTips: [
          'Memorize the reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au.',
          'Remember: Corrosion causes immense economic loss; painting, galvanizing with zinc, and alloying protect metals.',
        ],
      },
      contentHi: {
        overview:
          'रासायनिक अभिक्रिया वह प्रक्रिया है जिसमें एक या अधिक पदार्थ (अभिकारक) परस्पर क्रिया करके नए गुणों वाले एक या अधिक भिन्न पदार्थ (उत्पाद) बनाते हैं। इस प्रक्रिया में परमाणुओं के बीच बंध टूटते एवं बनते हैं।',
        keyDefinitions: [
          {
            term: 'रासायनिक अभिक्रिया (Chemical Reaction)',
            definition:
              'ऐसी प्रक्रिया जिसमें मूल पदार्थों की प्रकृति एवं पहचान बदल जाती है। अवस्था, रंग में परिवर्तन, गैस का उत्सर्जन या तापमान में बदलाव इसके लक्षण हैं।',
          },
          {
            term: 'द्रव्यमान संरक्षण का नियम (Law of Conservation of Mass)',
            definition:
              'किसी भी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है और न ही विनाश। अभिकारकों का कुल द्रव्यमान उत्पादों के कुल द्रव्यमान के बराबर होता है।',
          },
          {
            term: 'रेडॉक्स अभिक्रिया (Redox Reaction)',
            definition:
              'वह अभिक्रिया जिसमें एक अभिकारक का उपचयन (ऑक्सीकरण) तथा दूसरे अभिकारक का अपचयन साथ-साथ होता है।',
          },
        ],
        importantPoints: [
          'रासायनिक समीकरण को संतुलित करते समय केवल गुणांक (Coefficients) बदलते हैं, सूत्रों के पादांक (Subscripts) नहीं।',
          'संयोजन अभिक्रिया में दो या दो से अधिक पदार्थ मिलकर एकल उत्पाद बनाते हैं (उदा. कली चूना + जल)।',
          'वियोजन अभिक्रियाएं तीन प्रकार की होती हैं: ऊष्मीय वियोजन, विद्युत अपघटन एवं प्रकाशीय वियोजन।',
          'लोहे पर जंग लगना एक संक्षारण प्रक्रिया है जिसमें नमी और वायु दोनों अनिवार्य हैं।',
          'तैलीय एवं वसायुक्त खाद्य पदार्थों को विकृतगंधिता से बचाने हेतु नाइट्रोजन गैस का उपयोग किया जाता है।',
        ],
        formulas: [
          {
            name: 'श्वसन (ऊष्माक्षेपी अभिक्रिया)',
            formula: 'C6H12O6 + 6O2 -> 6CO2 + 6H2O + ऊर्जा',
            explanation: 'कोशिकाओं में ग्लूकोज ऑक्सीजन से मिलकर ऊर्जा मुक्त करता है।',
          },
          {
            name: 'कली चूने का बुझना',
            formula: 'CaO (बिना बुझा चूना) + H2O -> Ca(OH)2 (बुझा हुआ चूना) + ऊष्मा',
            explanation: 'यह तीव्र संयोजन अभिक्रिया है जिसमें अत्यधिक मात्रा में ऊष्मा उत्पन्न होती है।',
          },
          {
            name: 'प्रकाश संश्लेषण (ऊष्माशोषी)',
            formula: '6CO2 + 6H2O --(सूर्य प्रकाश / क्लोरोफिल)--> C6H12O6 + 6O2',
            explanation: 'पौधे सौर ऊर्जा का अवशोषण कर कार्बोहाइड्रेट बनाते हैं।',
          },
        ],
        examples: [
          {
            problem: 'समीकरण संतुलित करें: Fe + H2O -> Fe3O4 + H2',
            solution:
              'चरण 1: Fe संतुलित करें: 3Fe. चरण 2: ऑक्सीजन संतुलित करें: 4H2O. चरण 3: हाइड्रोजन संतुलित करें: 4H2. संतुलित समीकरण: 3Fe + 4H2O -> Fe3O4 + 4H2.',
          },
          {
            problem: 'चांदी की वस्तुएं हवा में काली क्यों पड़ जाती हैं?',
            solution:
              'चांदी हवा में मौजूद सल्फर (H2S) से क्रिया करके सिल्वर सल्फाइड (Ag2S) की काली परत बनाती है। 2Ag + H2S -> Ag2S + H2.',
          },
        ],
        summary:
          'रासायनिक परिवर्तन स्थायी होते हैं। इन्हें संतुलित रासायनिक समीकरणों द्वारा दर्शाया जाता है। रासायनिक अभिक्रियाएं संयोजन, वियोजन, विस्थापन, द्विविस्थापन एवं उपचयन-अपचयन में वर्गीकृत होती हैं।',
        revisionTips: [
          'सक्रियता श्रेणी याद रखें: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au.',
          'संक्षारण रोकने के उपाय: यशदलेपन (Galvanization), पेंटिंग, तेल लगाना एवं मिश्र धातु बनाना।',
        ],
      },
      updatedAt: '2026-02-20T10:00:00.000Z',
    },

    // SSC GK Notes
    {
      id: 'not_ssc_gk_1',
      chapterId: 'ch_ssc_gk_1',
      titleEn: 'Comprehensive Study Notes: Indian Constitution & Fundamental Rights',
      titleHi: 'विस्तृत अध्ययन नोट्स: भारतीय संविधान एवं मौलिक अधिकार',
      contentEn: {
        overview:
          'Part III of the Constitution (Articles 12 to 35) guarantees Fundamental Rights to all citizens. Often termed the Magna Carta of India, these rights ensure equality, liberty, and justice.',
        keyDefinitions: [
          {
            term: 'Fundamental Rights',
            definition: 'Basic human rights guaranteed by the Constitution, enforceable by the Supreme Court under Article 32.',
          },
          {
            term: 'Writ of Habeas Corpus',
            definition: 'An order requiring a detained person to be brought before a court to secure release if detention is unlawful.',
          },
        ],
        importantPoints: [
          'Originally 7 Fundamental Rights; Right to Property deleted by 44th Constitutional Amendment Act, 1978 (now Article 300A).',
          'Articles 20 and 21 cannot be suspended even during a National Emergency.',
          'Article 21A (Right to Education) added by 86th Constitutional Amendment Act, 2002.',
          'Supreme Court issues writs under Article 32; High Courts issue writs under Article 226.',
        ],
        formulas: [
          {
            name: 'Six Fundamental Rights Categories',
            formula: 'Equality (14-18) | Freedom (19-22) | Anti-Exploitation (23-24) | Religion (25-28) | Culture (29-30) | Remedies (32)',
            explanation: 'Constitutional blueprint of citizen safeguards.',
          },
        ],
        examples: [
          {
            problem: 'Which writ is issued against illegal usurpation of a public office?',
            solution: 'Quo-Warranto (By what authority or warrant).',
          },
        ],
        summary:
          'Fundamental rights are justiciable and defend the ideal of political democracy. The basic structure doctrine (Kesavananda Bharati, 1973) ensures these core protections cannot be abrogated by Parliament.',
        revisionTips: [
          'Remember: Article 17 abolishes Untouchability; Article 18 abolishes Titles.',
          'Right to privacy is a fundamental right under Article 21 (Puttaswamy case, 2017).',
        ],
      },
      contentHi: {
        overview:
          'भारतीय संविधान के भाग-3 (अनुच्छेद 12 से 35) में नागरिकों के मूल अधिकारों का वर्णन है। इसे भारत का मैग्नाकार्टा कहा जाता है। यह राजनीतिक लोकतंत्र के आदर्शों को बढ़ावा देता है।',
        keyDefinitions: [
          {
            term: 'मौलिक अधिकार (Fundamental Rights)',
            definition: 'संविधान द्वारा प्रत्याभूत वे अधिकार जो व्यक्ति के सर्वांगीण विकास हेतु अनिवार्य हैं एवं न्यायालय द्वारा प्रवर्तनीय हैं।',
          },
          {
            term: 'संवैधानिक उपचारों का अधिकार (अनुच्छेद 32)',
            definition: 'डॉ. बी.आर. अंबेडकर ने अनुच्छेद 32 को "संविधान का हृदय एवं आत्मा" कहा है। इसके तहत सर्वोच्च न्यायालय 5 प्रकार की रिट जारी करता है।',
          },
        ],
        importantPoints: [
          'मूल संविधान में 7 मौलिक अधिकार थे; 44वें संविधान संशोधन (1978) द्वारा संपत्ति के अधिकार को हटाकर अनुच्छेद 300A में कानूनी अधिकार बनाया गया।',
          'अनुच्छेद 20 (अपराधों के दोषसिद्धि के संबंध में संरक्षण) एवं अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता) राष्ट्रीय आपातकाल में भी निलंबित नहीं होते।',
          '86वें संविधान संशोधन (2002) द्वारा अनुच्छेद 21A जोड़कर 6 से 14 वर्ष के बच्चों के लिए शिक्षा को मौलिक अधिकार बनाया गया।',
          'अनुच्छेद 32 के तहत सुप्रीम कोर्ट तथा अनुच्छेद 226 के तहत हाई कोर्ट 5 रिट जारी कर सकते हैं: बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार पृच्छा।',
        ],
        formulas: [
          {
            name: 'छह प्रमुख मौलिक अधिकार',
            formula: 'समानता (14-18) | स्वतंत्रता (19-22) | शोषण के विरुद्ध (23-24) | धार्मिक स्वतंत्रता (25-28) | संस्कृति एवं शिक्षा (29-30) | उपचार (32)',
            explanation: 'संविधान में प्रदत्त 6 मौलिक अधिकारों का वर्गीकरण।',
          },
        ],
        examples: [
          {
            problem: 'यदि किसी व्यक्ति को गैर-कानूनी ढंग से गिरफ्तार किया जाए तो कौन सी रिट जारी होगी?',
            solution: 'बंदी प्रत्यक्षीकरण (Habeas Corpus - सशरीर प्रस्तुत करना)।',
          },
        ],
        summary:
          'मौलिक अधिकार न्यायोचित हैं अर्थात इनके हनन पर व्यक्ति सीधे सर्वोच्च न्यायालय जा सकता है। केशवानंद भारती वाद (1973) के तहत मौलिक अधिकार संविधान के मूल ढांचे का अंग हैं।',
        revisionTips: [
          'अनुच्छेद 17: अस्पृश्यता का अंत। अनुच्छेद 18: उपाधियों का अंत।',
          'अनुच्छेद 21 के तहत निजता का अधिकार (Right to Privacy) पुट्टास्वामी वाद 2017 में मौलिक अधिकार घोषित किया गया।',
        ],
      },
      updatedAt: '2026-02-22T10:00:00.000Z',
    },
  ];

  // 10 realistic sample questions for Class 10 Science (Chemical Reactions)
  const questions: QuestionServer[] = [
    {
      id: 'q_c10_sci_1',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'Which of the following processes represents a chemical change?',
      questionHi: 'निम्नलिखित में से कौन सी प्रक्रिया रासायनिक परिवर्तन का उदाहरण है?',
      optionsEn: ['Melting of ice cubes', 'Dissolving sugar in water', 'Rusting of iron almirah', 'Boiling of water to steam'],
      optionsHi: ['बर्फ के टुकड़ों का पिघलना', 'पानी में चीनी का घुलना', 'लोहे की अलमारी पर जंग लगना', 'जल का उबलकर भाप बनना'],
      correctOptionIndex: 2,
      explanationEn:
        'Rusting of iron is a chemical change because a new chemical compound, hydrated iron oxide (Fe2O3.xH2O), is formed with properties completely different from iron and oxygen. The other options are physical changes involving only phase transitions.',
      explanationHi:
        'लोहे पर जंग लगना एक रासायनिक परिवर्तन है क्योंकि इसमें एक नया रासायनिक यौगिक जलयोजित फेरिक ऑक्साइड (Fe2O3.xH2O) बनता है, जिसके गुण मूल लोहे से भिन्न होते हैं। अन्य सभी विकल्प केवल भौतिक अवस्था परिवर्तन हैं।',
      difficulty: 'Easy',
      marks: 1,
      topic: 'Chemical vs Physical Changes',
    },
    {
      id: 'q_c10_sci_2',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'When quicklime (CaO) reacts vigorously with water, what is the primary product formed and what type of reaction is it?',
      questionHi: 'जब कली चूना (CaO) जल के साथ तीव्र अभिक्रिया करता है, तो मुख्य उत्पाद क्या बनता है और यह किस प्रकार की अभिक्रिया है?',
      optionsEn: [
        'Calcium carbonate, Endothermic',
        'Slaked lime Ca(OH)2, Exothermic combination',
        'Calcium hydride, Decomposition',
        'Calcium sulfate, Displacement',
      ],
      optionsHi: [
        'कैल्शियम कार्बोनेट, ऊष्माशोषी',
        'बुझा हुआ चूना Ca(OH)2, ऊष्माक्षेपी संयोजन',
        'कैल्शियम हाइड्राइड, वियोजन',
        'कैल्शियम सल्फेट, विस्थापन',
      ],
      correctOptionIndex: 1,
      explanationEn:
        'Calcium oxide (quicklime) reacts with water to form calcium hydroxide (slaked lime): CaO + H2O -> Ca(OH)2. A large amount of heat energy is released, making it a classic exothermic combination reaction.',
      explanationHi:
        'कैल्शियम ऑक्साइड (कली चूना) जल के साथ क्रिया करके बुझा हुआ चूना [Ca(OH)2] बनाता है: CaO + H2O -> Ca(OH)2। इसमें भारी मात्रा में ऊष्मा उत्पन्न होती है, इसलिए यह ऊष्माक्षेपी संयोजन अभिक्रिया है।',
      difficulty: 'Medium',
      marks: 1,
      topic: 'Combination Reactions',
    },
    {
      id: 'q_c10_sci_3',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'In the balanced chemical reaction: a Al + b O2 -> c Al2O3, what are the values of stoichiometric coefficients a, b, and c?',
      questionHi: 'संतुलित रासायनिक समीकरण: a Al + b O2 -> c Al2O3 में रससमीकरणमितीय गुणांक a, b एवं c के मान क्या होंगे?',
      optionsEn: ['a = 2, b = 3, c = 1', 'a = 4, b = 3, c = 2', 'a = 4, b = 2, c = 2', 'a = 2, b = 1, c = 1'],
      optionsHi: ['a = 2, b = 3, c = 1', 'a = 4, b = 3, c = 2', 'a = 4, b = 2, c = 2', 'a = 2, b = 1, c = 1'],
      correctOptionIndex: 1,
      explanationEn:
        'To balance 2 moles of Al2O3, we have 4 Al atoms on the right (requiring a = 4) and 6 O atoms on the right (requiring 3 O2 molecules, so b = 3). Thus, 4Al + 3O2 -> 2Al2O3. The values are a=4, b=3, c=2.',
      explanationHi:
        'Al2O3 के 2 अणुओं में 4 एल्युमीनियम परमाणु (a = 4) और 6 ऑक्सीजन परमाणु (3 O2 अणु, b = 3) होते हैं। अतः संतुलित समीकरण: 4Al + 3O2 -> 2Al2O3 होगा। सही मान a = 4, b = 3, c = 2 हैं।',
      difficulty: 'Medium',
      marks: 1,
      topic: 'Balancing Chemical Equations',
    },
    {
      id: 'q_c10_sci_4',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'Why are food items packed with nitrogen gas in sealed bags?',
      questionHi: 'खाद्य पदार्थों को सीलबंद पैकेट में पैक करते समय नाइट्रोजन गैस क्यों भरी जाती है?',
      optionsEn: [
        'To increase the nutritional protein content',
        'To prevent rancidity caused by oxidation of oils and fats',
        'To give the chips a golden crispy color',
        'To reduce packaging transport weight',
      ],
      optionsHi: [
        'खाद्य पदार्थों में प्रोटीन की मात्रा बढ़ाने के लिए',
        'तेल और वसा के ऑक्सीकरण से होने वाली विकृतगंधिता को रोकने के लिए',
        'चिप्स को सुनहरा कुरकुरा रंग देने के लिए',
        'पैकेट का कुल वजन कम करने के लिए',
      ],
      correctOptionIndex: 1,
      explanationEn:
        'Nitrogen is an unreactive (inert) gas under normal conditions. It displaces oxygen from the packet, preventing oxidative degradation (rancidity) of fats and oils which produces bad odor and taste.',
      explanationHi:
        'नाइट्रोजन एक अक्रिय गैस है जो पैकेट से ऑक्सीजन को बाहर कर देती है। इससे तेल एवं वसा का ऑक्सीकरण (उपचयन) नहीं होता, जिससे खाद्य सामग्री लंबे समय तक विकृतगंधिता (खराब स्वाद व गंध) से सुरक्षित रहती है।',
      difficulty: 'Easy',
      marks: 1,
      topic: 'Rancidity & Antioxidants',
    },
    {
      id: 'q_c10_sci_5',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'When an iron nail is immersed in blue copper sulfate (CuSO4) solution for 30 minutes, what observable change occurs?',
      questionHi: 'जब लोहे की कील को नीले कॉपर सल्फेट (CuSO4) के घोल में 30 मिनट तक डुबोया जाता है, तो कौन सा परिवर्तन दिखाई देता है?',
      optionsEn: [
        'Solution turns dark pink and no deposit on nail',
        'Solution turns pale green and a reddish-brown coating forms on the iron nail',
        'Solution becomes completely colorless with vigorous bubbling of gas',
        'The iron nail dissolves completely without any color change',
      ],
      optionsHi: [
        'घोल गहरा गुलाबी हो जाता है और कील पर कोई जमाव नहीं होता',
        'घोल का रंग हल्का हरा हो जाता है तथा लोहे की कील पर लाल-भूरे रंग की परत जम जाती है',
        'घोल पूरी तरह रंगहीन हो जाता है और तीव्र बुलबुले निकलते हैं',
        'लोहे की कील बिना किसी रंग परिवर्तन के पूरी तरह घुल जाती है',
      ],
      correctOptionIndex: 1,
      explanationEn:
        'Iron is more reactive than copper. It displaces copper from CuSO4 solution: Fe + CuSO4 (blue) -> FeSO4 (pale green) + Cu (reddish-brown deposit on nail). This is a single displacement reaction.',
      explanationHi:
        'लोहा (Fe) तांबे (Cu) से अधिक क्रियाशील है। यह कॉपर सल्फेट से कॉपर को विस्थापित कर देता है: Fe + CuSO4 (नीला) -> FeSO4 (हल्का हरा) + Cu (कील पर लाल-भूरा तांबा जमाव)। यह विस्थापन अभिक्रिया है।',
      difficulty: 'Medium',
      marks: 1,
      topic: 'Displacement Reactions',
    },
    {
      id: 'q_c10_sci_6',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'In the redox reaction: CuO + H2 -> Cu + H2O, which substance acts as the oxidizing agent?',
      questionHi: 'रेडॉक्स अभिक्रिया: CuO + H2 -> Cu + H2O में कौन सा पदार्थ ऑक्सीकारक (उपचायक) के रूप में कार्य करता है?',
      optionsEn: ['H2', 'Cu', 'CuO', 'H2O'],
      optionsHi: ['H2', 'Cu', 'CuO', 'H2O'],
      correctOptionIndex: 2,
      explanationEn:
        'CuO loses oxygen to form Cu, so CuO is reduced. The substance that undergoes reduction and provides oxygen for the oxidation of another substance is the oxidizing agent. Hence, CuO is the oxidizing agent.',
      explanationHi:
        'CuO ऑक्सीजन खोकर Cu में अपचयित होता है। जो पदार्थ स्वयं अपचयित होकर दूसरे पदार्थ को ऑक्सीजन प्रदान करता है, वह ऑक्सीकारक (उपचायक) कहलाता है। अतः यहाँ CuO ऑक्सीकारक है।',
      difficulty: 'Hard',
      marks: 1,
      topic: 'Redox Reactions',
    },
    {
      id: 'q_c10_sci_7',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'Which of the following decomposition reactions is utilized in black and white photography?',
      questionHi: 'निम्नलिखित में से किस वियोजन अभिक्रिया का उपयोग श्वेत-श्याम (ब्लैक एंड व्हाइट) फोटोग्राफी में किया जाता है?',
      optionsEn: [
        'Thermal decomposition of CaCO3',
        'Photolytic decomposition of Silver Bromide (2AgBr --(light)--> 2Ag + Br2)',
        'Electrolysis of water (2H2O -> 2H2 + O2)',
        'Decomposition of Lead Nitrate 2Pb(NO3)2',
      ],
      optionsHi: [
        'CaCO3 का ऊष्मीय अपघटन',
        'सिल्वर ब्रोमाइड का प्रकाशीय वियोजन (2AgBr --(प्रकाश)--> 2Ag + Br2)',
        'जल का विद्युत अपघटन (2H2O -> 2H2 + O2)',
        'लेड नाइट्रेट 2Pb(NO3)2 का ऊष्मीय वियोजन',
      ],
      correctOptionIndex: 1,
      explanationEn:
        'Silver chloride and silver bromide undergo photolytic decomposition in the presence of sunlight: 2AgBr(s) --(Sunlight)--> 2Ag(s) + Br2(g). The metallic silver deposited gives the photographic contrast.',
      explanationHi:
        'सिल्वर ब्रोमाइड (AgBr) सूर्य के प्रकाश में वियोजित होकर धात्विक सिल्वर (ग्रे रंग) और ब्रोमीन गैस बनाता है। इसी प्रकाशीय अभिक्रिया का उपयोग ब्लैक एंड व्हाइट फोटोग्राफी में होता है।',
      difficulty: 'Easy',
      marks: 1,
      topic: 'Photolytic Decomposition',
    },
    {
      id: 'q_c10_sci_8',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'When lead nitrate Pb(NO3)2 powder is strongly heated in a boiling test tube, what brown fumes are evolved?',
      questionHi: 'जब लेड नाइट्रेट Pb(NO3)2 चूर्ण को क्वथन नली में तीव्र गर्म किया जाता है, तो कौन सी भूरे रंग की गैस निकलती है?',
      optionsEn: ['Nitrogen gas (N2)', 'Nitrogen dioxide (NO2)', 'Nitrous oxide (N2O)', 'Oxygen gas (O2)'],
      optionsHi: ['नाइट्रोजन गैस (N2)', 'नाइट्रोजन डाइऑक्साइड (NO2)', 'नाइट्रस ऑक्साइड (N2O)', 'ऑक्सीजन गैस (O2)'],
      correctOptionIndex: 1,
      explanationEn:
        'Heating lead nitrate undergoes thermal decomposition: 2Pb(NO3)2 -> 2PbO (yellow residue) + 4NO2 (brown pungent fumes) + O2. The characteristic brown gas is nitrogen dioxide (NO2).',
      explanationHi:
        'लेड नाइट्रेट को गर्म करने पर ऊष्मीय वियोजन होता है: 2Pb(NO3)2 -> 2PbO (पीला लेड ऑक्साइड) + 4NO2 (भूरे रंग की धूएँदार गैस) + O2। निकलने वाली भूरी गैस नाइट्रोजन डाइऑक्साइड (NO2) है।',
      difficulty: 'Hard',
      marks: 1,
      topic: 'Thermal Decomposition',
    },
    {
      id: 'q_c10_sci_9',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'Which of the following is an example of an endothermic process?',
      questionHi: 'निम्नलिखित में से कौन सी एक ऊष्माशोषी (Endothermic) प्रक्रिया है?',
      optionsEn: [
        'Respiration in living organisms',
        'Combustion of liquefied petroleum gas (LPG)',
        'Photosynthesis in green plants',
        'Dilution of concentrated sulfuric acid with water',
      ],
      optionsHi: [
        'जीवों में होने वाली श्वसन क्रिया',
        'घरेलू रसोई गैस (एलपीजी) का दहन',
        'हरे पौधों में प्रकाश संश्लेषण',
        'सांद्र सल्फ्यूरिक अम्ल में जल मिलाना',
      ],
      correctOptionIndex: 2,
      explanationEn:
        'Photosynthesis requires external solar energy to synthesize glucose from carbon dioxide and water, making it endothermic. Respiration, combustion, and acid dilution all liberate energy (exothermic).',
      explanationHi:
        'प्रकाश संश्लेषण में हरे पौधे सूर्य के प्रकाश (ऊर्जा) का अवशोषण करते हैं, अतः यह ऊष्माशोषी प्रक्रिया है। श्वसन, एलपीजी का दहन एवं अम्ल का तनुकरण ऊष्माक्षेपी (ऊर्जा उत्पन्न करने वाली) प्रक्रियाएं हैं।',
      difficulty: 'Medium',
      marks: 1,
      topic: 'Endothermic vs Exothermic',
    },
    {
      id: 'q_c10_sci_10',
      chapterId: 'ch_c10_sci_1',
      questionEn: 'What precipitate is formed when barium chloride (BaCl2) reacts with sodium sulfate (Na2SO4) solution?',
      questionHi: 'जब बेरियम क्लोराइड (BaCl2) सोडियम सल्फेट (Na2SO4) के जलीय विलयन से क्रिया करता है, तो कौन सा अवक्षेप बनता है?',
      optionsEn: [
        'White precipitate of Barium Sulfate (BaSO4)',
        'Yellow precipitate of Sodium Chloride',
        'Black precipitate of Barium Sulfide',
        'Blue precipitate of Sodium Sulfate',
      ],
      optionsHi: [
        'बेरियम सल्फेट (BaSO4) का सफेद अवक्षेप',
        'सोडियम क्लोराइड का पीला अवक्षेप',
        'बेरियम सल्फाइड का काला अवक्षेप',
        'सोडियम सल्फेट का नीला अवक्षेप',
      ],
      correctOptionIndex: 0,
      explanationEn:
        'BaCl2 + Na2SO4 -> BaSO4 (white insoluble solid) + 2NaCl. This is an example of a double displacement and precipitation reaction.',
      explanationHi:
        'BaCl2 + Na2SO4 -> BaSO4 (सफेद अविलेय अवक्षेप) + 2NaCl। यह द्विविस्थापन एवं अवक्षेपण (Precipitation) अभिक्रिया का प्रमुख उदाहरण है।',
      difficulty: 'Medium',
      marks: 1,
      topic: 'Double Displacement Reactions',
    },

    // SSC GK Questions (Indian Polity & Constitution)
    {
      id: 'q_ssc_gk_1',
      chapterId: 'ch_ssc_gk_1',
      questionEn: 'Which Article of the Indian Constitution is termed the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar?',
      questionHi: 'डॉ. बी.आर. अंबेडकर ने भारतीय संविधान के किस अनुच्छेद को "संविधान का हृदय एवं आत्मा" कहा था?',
      optionsEn: [
        'Article 14 (Right to Equality)',
        'Article 19 (Right to Freedom)',
        'Article 21 (Right to Life)',
        'Article 32 (Right to Constitutional Remedies)',
      ],
      optionsHi: [
        'अनुच्छेद 14 (समानता का अधिकार)',
        'अनुच्छेद 19 (स्वतंत्रता का अधिकार)',
        'अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता)',
        'अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार)',
      ],
      correctOptionIndex: 3,
      explanationEn:
        'Dr. B.R. Ambedkar called Article 32 the "Heart and Soul of the Constitution" because without constitutional remedies, all other fundamental rights would be meaningless and unenforceable in court.',
      explanationHi:
        'डॉ. अंबेडकर ने अनुच्छेद 32 को "संविधान की आत्मा और हृदय" कहा था, क्योंकि इसके बिना अन्य सभी मौलिक अधिकार अर्थहीन हो जाते हैं। इसके तहत नागरिक अधिकारों के संरक्षण हेतु सीधे सुप्रीम कोर्ट जा सकते हैं।',
      difficulty: 'Easy',
      marks: 1,
      topic: 'Fundamental Rights & Writs',
    },
    {
      id: 'q_ssc_gk_2',
      chapterId: 'ch_ssc_gk_1',
      questionEn: 'By which Constitutional Amendment was the Right to Property removed from the list of Fundamental Rights?',
      questionHi: 'किस संविधान संशोधन द्वारा संपत्ति के अधिकार को मौलिक अधिकारों की सूची से हटाया गया था?',
      optionsEn: [
        '42nd Amendment Act, 1976',
        '44th Amendment Act, 1978',
        '86th Amendment Act, 2002',
        '73rd Amendment Act, 1992',
      ],
      optionsHi: [
        '42वां संशोधन अधिनियम, 1976',
        '44वां संशोधन अधिनियम, 1978',
        '86वां संशोधन अधिनियम, 2002',
        '73वां संशोधन अधिनियम, 1992',
      ],
      correctOptionIndex: 1,
      explanationEn:
        'The 44th Amendment Act of 1978 enacted by the Janata Party government repealed Article 31 and shifted the Right to Property to Article 300A as a legal/constitutional right, reducing Fundamental Rights from 7 to 6.',
      explanationHi:
        '44वें संविधान संशोधन (1978) द्वारा संपत्ति के अधिकार को मौलिक अधिकारों (अनुच्छेद 31) से हटाकर संविधान के भाग-12 में अनुच्छेद 300A के तहत एक कानूनी अधिकार बना दिया गया।',
      difficulty: 'Medium',
      marks: 1,
      topic: 'Constitutional Amendments',
    },
    {
      id: 'q_ssc_gk_3',
      chapterId: 'ch_ssc_gk_1',
      questionEn: 'Which of the following Fundamental Rights cannot be suspended even during a National Emergency under Article 352?',
      questionHi: 'अनुच्छेद 352 के तहत राष्ट्रीय आपातकाल के दौरान भी निम्नलिखित में से कौन से मौलिक अधिकार निलंबित नहीं किए जा सकते?',
      optionsEn: ['Articles 14 and 19', 'Articles 20 and 21', 'Articles 21 and 22', 'Articles 25 and 26'],
      optionsHi: ['अनुच्छेद 14 एवं 19', 'अनुच्छेद 20 एवं 21', 'अनुच्छेद 21 एवं 22', 'अनुच्छेद 25 एवं 26'],
      correctOptionIndex: 1,
      explanationEn:
        'Under the 44th Amendment Act 1978, the enforcement of Fundamental Rights under Article 20 (protection in respect of conviction for offences) and Article 21 (protection of life and personal liberty) cannot be suspended by the President during any National Emergency.',
      explanationHi:
        '44वें संविधान संशोधन 1978 के अनुसार, राष्ट्रपति राष्ट्रीय आपातकाल के दौरान भी अनुच्छेद 20 (अपराधों के लिए दोषसिद्धि के संबंध में संरक्षण) और अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता) को निलंबित नहीं कर सकते।',
      difficulty: 'Hard',
      marks: 1,
      topic: 'Emergency Provisions',
    },
    {
      id: 'q_ssc_gk_4',
      chapterId: 'ch_ssc_gk_1',
      questionEn: 'Which writ is issued by the higher courts to command an inferior court or public officer to perform a mandatory statutory duty?',
      questionHi: 'किसी अधीनस्थ न्यायालय अथवा लोक अधिकारी को अपने कानूनी दायित्व का पालन करने का आदेश देने हेतु उच्च न्यायालय कौन सी रिट जारी करता है?',
      optionsEn: ['Habeas Corpus', 'Mandamus', 'Quo-Warranto', 'Certiorari'],
      optionsHi: ['बंदी प्रत्यक्षीकरण', 'परमादेश (Mandamus)', 'अधिकार पृच्छा', 'उत्प्रेषण'],
      correctOptionIndex: 1,
      explanationEn:
        'Mandamus literally means "We Command". It is an order issued by the court to a public official, tribunal, or lower court asking them to perform a statutory public duty that they have failed or refused to perform.',
      explanationHi:
        'परमादेश (Mandamus) का शाब्दिक अर्थ है "हम आदेश देते हैं"। यह रिट किसी सार्वजनिक अधिकारी या संस्था को उसके कानूनी कर्तव्य का पालन करने के लिए बाध्य करने हेतु जारी की जाती है।',
      difficulty: 'Medium',
      marks: 1,
      topic: 'Writs & Judicial Remedies',
    },
  ];

  const personalNotes: PersonalNote[] = [
    {
      id: 'pnot_1',
      userId: 'usr_student_1',
      chapterId: 'ch_c10_sci_1',
      chapterTitle: 'Chemical Reactions and Equations',
      title: 'Top 5 Balancing Equation Rules & Shortcuts',
      content:
        'Key reminders for tomorrow:\n1. Never change the subscript inside the formula (e.g. H2O cannot become H2O2).\n2. Count metals first, then non-metals, then hydrogen, and oxygen last.\n3. Keep polyatomic ions (like SO4, NO3) as single units if they appear unchanged on both sides!\n4. Remember: Rusting = 4Fe + 3O2 + xH2O -> 2Fe2O3.xH2O.',
      tags: ['Science', 'Formulas', 'Tricks'],
      isBookmarked: true,
      updatedAt: '2026-03-01T08:30:00.000Z',
      createdAt: '2026-03-01T08:30:00.000Z',
    },
  ];

  const bookmarks: BookmarkItem[] = [
    {
      id: 'bm_1',
      userId: 'usr_student_1',
      itemType: 'question',
      itemId: 'q_c10_sci_6',
      title: 'Redox Reaction & Oxidizing Agent Question',
      subtitle: 'Class 10 Science - Chemical Reactions',
      targetId: 'ch_c10_sci_1',
      createdAt: '2026-03-01T09:00:00.000Z',
    },
    {
      id: 'bm_2',
      userId: 'usr_student_1',
      itemType: 'official_note',
      itemId: 'not_c10_sci_1',
      title: 'Official Theory: Chemical Reactions and Equations',
      subtitle: 'Complete notes with balanced equations and formulas',
      targetId: 'ch_c10_sci_1',
      createdAt: '2026-03-01T09:15:00.000Z',
    },
  ];

  const announcements: Announcement[] = [
    {
      id: 'ann_1',
      titleEn: 'New NCERT 2026 Updated Study Notes Available',
      titleHi: 'नवीनतम एनसीईआरटी 2026 अपडेटेड नोट्स उपलब्ध',
      messageEn: 'Class 6 to Class 12 Science and Math bilingual notes and chapter MCQs have been refreshed.',
      messageHi: 'कक्षा 6 से 12 तक विज्ञान एवं गणित के द्विभाषी नोट्स और अभ्यास प्रश्न बैंक अपलोड कर दिए गए हैं।',
      category: 'new_notes',
      date: '2026-03-01',
      isActive: true,
    },
    {
      id: 'ann_2',
      titleEn: 'SSC CGL 2026 All India Free Live Mock Test',
      titleHi: 'एसएससी सीजीएल 2026 ऑल इंडिया फ्री लाइव मॉक टेस्ट',
      messageEn: 'Participate in the nationwide bilingual mock test with instant all-India rank and section analysis.',
      messageHi: 'ऑल इंडिया फ्री मॉक टेस्ट में भाग लें और तुरंत अपनी रैंक एवं विषयवार स्कोर कार्ड प्राप्त करें।',
      category: 'exam_alert',
      date: '2026-03-05',
      isActive: true,
    },
  ];

  const quizAttempts: QuizAttemptRecord[] = [
    {
      id: 'qa_demo_1',
      userId: 'usr_student_1',
      chapterId: 'ch_c10_sci_1',
      title: 'Chemical Reactions Chapter Practice',
      testType: 'chapter_practice',
      score: 8,
      totalQuestions: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      unattempted: 0,
      accuracy: 80,
      timeTakenSeconds: 320,
      answers: [
        { questionId: 'q_c10_sci_1', selectedOption: 2, isCorrect: true },
        { questionId: 'q_c10_sci_2', selectedOption: 1, isCorrect: true },
        { questionId: 'q_c10_sci_3', selectedOption: 1, isCorrect: true },
        { questionId: 'q_c10_sci_4', selectedOption: 1, isCorrect: true },
        { questionId: 'q_c10_sci_5', selectedOption: 1, isCorrect: true },
        { questionId: 'q_c10_sci_6', selectedOption: 0, isCorrect: false },
        { questionId: 'q_c10_sci_7', selectedOption: 1, isCorrect: true },
        { questionId: 'q_c10_sci_8', selectedOption: 1, isCorrect: true },
        { questionId: 'q_c10_sci_9', selectedOption: 1, isCorrect: false },
        { questionId: 'q_c10_sci_10', selectedOption: 0, isCorrect: true },
      ],
      createdAt: '2026-03-01T11:00:00.000Z',
    },
  ];

  const auditLogs = [
    {
      id: 'aud_1',
      userId: 'usr_admin_1',
      action: 'SYSTEM_BOOTSTRAP',
      details: 'Initialized Rajnish Study bilingual course catalog and questions database',
      timestamp: '2026-03-01T00:00:00.000Z',
    },
  ];

  const subscriptionPlan: SubscriptionPlan = {
    price: 99,
    originalPrice: 499,
    titleHi: 'रजनीश स्टडी संपूर्ण पेड बैच (All-Access VIP)',
    titleEn: 'Rajnish Study All-Access Complete Paid Batch',
    subtitleHi: 'मात्र ₹99 में सभी क्लास, नोट्स, क्विज एवं टेस्ट सीरीज अनलॉक करें',
    subtitleEn: 'Unlock all classes, official theory, quizzes & mock tests for just ₹99',
    upiId: 'rajnishstudy@upi',
    upiReceiverName: 'Rajnish Study Education Services',
    featuresHi: [
      'सभी स्कूल व कॉलेज कक्षाएं (Class 6 से 12 एवं ग्रेजुएशन)',
      'सभी प्रतियोगी परीक्षाएं (SSC, Banking, Railway, UPSC, State PCS)',
      'असीमित वस्तुनिष्ठ प्रश्न (MCQ) एवं संपूर्ण मॉक टेस्ट सीरीज',
      'आधिकारिक थ्योरी नोट्स एवं सूत्र सारांश का A4 पीडीएफ डाउनलोड',
      'व्यक्तिगत नोट्स मेकर एवं क्लाउड सिंक',
      'लाइफ-टाइम वैलिडिटी एवं आगामी सभी अपडेट्स फ्री',
    ],
    featuresEn: [
      'All School & College classes (Class 6 to 12 & Graduation)',
      'All Competitive Exams (SSC, Banking, Railway, UPSC, State PCS)',
      'Unlimited Chapter MCQs & Full-Length Mock Test Series',
      'Official Theory Notes & Formula Sheets Printable A4 PDF Downloads',
      'Personal Study Notes Maker with Cloud Backup',
      'Full Access to All Current & Upcoming Chapters Included',
    ],
  };

  const paymentTransactions: PaymentTransaction[] = [
    {
      id: 'tx_demo_sample_1',
      userId: 'usr_student_sample',
      studentName: 'Rohan Verma',
      studentEmail: 'rohan.aspirant@gmail.com',
      amount: 99,
      paymentMethod: 'UPI (PhonePe)',
      utrNumber: 'UPI498273918234',
      status: 'success',
      createdAt: '2026-03-02T10:15:00.000Z',
    },
  ];

  return {
    users,
    courses,
    subjects,
    chapters,
    questions,
    officialNotes,
    personalNotes,
    bookmarks,
    announcements,
    quizAttempts,
    auditLogs,
    subscriptionPlan,
    paymentTransactions,
  };
}

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure all required collections exist
        const seed = getInitialSeedData();
        return {
          users: parsed.users || seed.users,
          courses: parsed.courses || seed.courses,
          subjects: parsed.subjects || seed.subjects,
          chapters: parsed.chapters || seed.chapters,
          questions: parsed.questions || seed.questions,
          officialNotes: parsed.officialNotes || seed.officialNotes,
          personalNotes: parsed.personalNotes || seed.personalNotes,
          bookmarks: parsed.bookmarks || seed.bookmarks,
          announcements: parsed.announcements || seed.announcements,
          quizAttempts: parsed.quizAttempts || seed.quizAttempts,
          auditLogs: parsed.auditLogs || seed.auditLogs,
          subscriptionPlan: parsed.subscriptionPlan || seed.subscriptionPlan,
          paymentTransactions: parsed.paymentTransactions || seed.paymentTransactions,
        };
      }
    } catch (err) {
      console.error('Error reading db.json, generating default seed:', err);
    }
    const seed = getInitialSeedData();
    this.persist(seed);
    return seed;
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  // Generic accessors
  public getData(): DatabaseSchema {
    return this.data;
  }

  public save() {
    this.persist();
  }

  // User management
  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: User & { passwordHash: string }) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>) {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updates);
      this.save();
    }
    return user;
  }

  // Course hierarchy
  public getCourses(category?: string) {
    return this.data.courses
      .filter((c) => (category ? c.category === category : true))
      .sort((a, b) => a.order - b.order)
      .map((c) => {
        const subCount = this.data.subjects.filter((s) => s.courseId === c.id).length;
        const chapCount = this.data.chapters.filter((ch) => {
          const sub = this.data.subjects.find((s) => s.id === ch.subjectId);
          return sub && sub.courseId === c.id;
        }).length;
        return {
          ...c,
          totalSubjects: subCount,
          totalChapters: chapCount,
        };
      });
  }

  public getSubjectsByCourse(courseId: string) {
    return this.data.subjects
      .filter((s) => s.courseId === courseId)
      .sort((a, b) => a.order - b.order)
      .map((s) => {
        const chapCount = this.data.chapters.filter((ch) => ch.subjectId === s.id).length;
        return {
          ...s,
          chapterCount: chapCount,
        };
      });
  }

  public getChaptersBySubject(subjectId: string) {
    return this.data.chapters
      .filter((ch) => ch.subjectId === subjectId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
      .map((ch) => {
        const qCount = this.data.questions.filter((q) => q.chapterId === ch.id).length;
        return {
          ...ch,
          questionCount: qCount,
        };
      });
  }

  public getChapterById(chapterId: string) {
    const chapter = this.data.chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return null;
    const subject = this.data.subjects.find((s) => s.id === chapter.subjectId);
    const course = subject ? this.data.courses.find((c) => c.id === subject.courseId) : null;
    return {
      chapter,
      subject,
      course,
    };
  }

  // Questions - Client sanitization (NEVER send correct answer in practice mode!)
  public getQuestionsForClient(chapterId: string) {
    return this.data.questions
      .filter((q) => q.chapterId === chapterId)
      .map((q) => {
        // Strip secret correct answer and explanation
        const { correctOptionIndex, explanationEn, explanationHi, ...clientFields } = q;
        return clientFields;
      });
  }

  // Server validation of answer
  public verifyAnswer(questionId: string, selectedOption: number) {
    const question = this.data.questions.find((q) => q.id === questionId);
    if (!question) return null;
    const isCorrect = question.correctOptionIndex === selectedOption;
    return {
      questionId,
      selectedOption,
      isCorrect,
      correctOptionIndex: question.correctOptionIndex,
      explanationEn: question.explanationEn,
      explanationHi: question.explanationHi,
    };
  }

  // Official notes
  public getOfficialNote(chapterId: string) {
    return this.data.officialNotes.find((n) => n.chapterId === chapterId);
  }

  // Personal notes
  public getPersonalNotes(userId: string) {
    return this.data.personalNotes
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public savePersonalNote(note: PersonalNote) {
    const index = this.data.personalNotes.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      this.data.personalNotes[index] = note;
    } else {
      this.data.personalNotes.unshift(note);
    }
    this.save();
    return note;
  }

  public deletePersonalNote(id: string, userId: string) {
    const prevLen = this.data.personalNotes.length;
    this.data.personalNotes = this.data.personalNotes.filter((n) => !(n.id === id && n.userId === userId));
    const deleted = this.data.personalNotes.length < prevLen;
    if (deleted) this.save();
    return deleted;
  }

  // Bookmarks
  public getBookmarks(userId: string) {
    return this.data.bookmarks
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addBookmark(bookmark: BookmarkItem) {
    // Avoid duplicates
    const exists = this.data.bookmarks.find(
      (b) => b.userId === bookmark.userId && b.itemType === bookmark.itemType && b.itemId === bookmark.itemId
    );
    if (exists) return exists;
    this.data.bookmarks.unshift(bookmark);
    this.save();
    return bookmark;
  }

  public removeBookmark(id: string, userId: string) {
    this.data.bookmarks = this.data.bookmarks.filter((b) => !(b.id === id && b.userId === userId));
    this.save();
    return true;
  }

  // Quiz Attempts
  public recordQuizAttempt(attempt: QuizAttemptRecord) {
    this.data.quizAttempts.unshift(attempt);
    // Update user stats
    const user = this.findUserById(attempt.userId);
    if (user) {
      user.totalStudyMinutes += Math.max(1, Math.round(attempt.timeTakenSeconds / 60));
    }
    this.save();
    return attempt;
  }

  public getQuizAttempts(userId: string) {
    return this.data.quizAttempts.filter((a) => a.userId === userId);
  }

  // Analytics for student dashboard
  public getUserAnalytics(userId: string) {
    const attempts = this.getQuizAttempts(userId);
    const totalAttempts = attempts.length;
    const totalQuestionsAttempted = attempts.reduce((acc, curr) => acc + curr.totalQuestions, 0);
    const totalCorrect = attempts.reduce((acc, curr) => acc + curr.correctAnswers, 0);
    const totalIncorrect = attempts.reduce((acc, curr) => acc + curr.incorrectAnswers, 0);
    const accuracy = totalQuestionsAttempted > 0 ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) : 0;
    const user = this.findUserById(userId);

    const personalNotesCount = this.data.personalNotes.filter((n) => n.userId === userId).length;
    const bookmarksCount = this.data.bookmarks.filter((b) => b.userId === userId).length;

    // Recent activity list
    const recentActivity = attempts.slice(0, 5).map((a) => ({
      id: a.id,
      title: a.title,
      type: 'quiz' as const,
      timestamp: a.createdAt,
      score: `${a.score}/${a.totalQuestions} (${a.accuracy}%)`,
    }));

    return {
      totalQuizAttempts: totalAttempts,
      totalQuestionsAttempted,
      correctAnswers: totalCorrect,
      incorrectAnswers: totalIncorrect,
      overallAccuracy: accuracy,
      totalStudyMinutes: user?.totalStudyMinutes || 0,
      completedChaptersCount: Math.min(this.data.chapters.length, Math.max(1, Math.floor(totalAttempts * 0.8))),
      personalNotesCount,
      bookmarksCount,
      streakDays: user?.streakDays || 1,
      subjectPerformance: [
        { subjectName: 'Science (विज्ञान)', totalAttempted: 15, accuracy: 80 },
        { subjectName: 'Mathematics (गणित)', totalAttempted: 12, accuracy: 75 },
        { subjectName: 'Polity (राजव्यवस्था)', totalAttempted: 10, accuracy: 90 },
        { subjectName: 'Reasoning (तर्कशक्ति)', totalAttempted: 8, accuracy: 88 },
      ],
      recentActivity,
      weeklyActivityDays: [
        { day: 'Mon', minutes: 45, quizzes: 2 },
        { day: 'Tue', minutes: 60, quizzes: 3 },
        { day: 'Wed', minutes: 30, quizzes: 1 },
        { day: 'Thu', minutes: 75, quizzes: 4 },
        { day: 'Fri', minutes: 50, quizzes: 2 },
        { day: 'Sat', minutes: 90, quizzes: 5 },
        { day: 'Sun', minutes: 40, quizzes: 2 },
      ],
    };
  }

  // Global search across all entities
  public globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: {
      id: string;
      title: string;
      subtitle: string;
      type: 'course' | 'subject' | 'chapter' | 'question' | 'note';
      targetId: string;
      category?: string;
    }[] = [];

    // Search courses
    this.data.courses.forEach((c) => {
      if (c.nameEn.toLowerCase().includes(q) || c.nameHi.includes(q)) {
        results.push({
          id: c.id,
          title: `${c.nameHi} / ${c.nameEn}`,
          subtitle: c.category === 'school_college' ? 'School & College' : 'Competitive Exam',
          type: 'course',
          targetId: c.id,
        });
      }
    });

    // Search chapters
    this.data.chapters.forEach((ch) => {
      if (ch.nameEn.toLowerCase().includes(q) || ch.nameHi.includes(q) || ch.descriptionEn.toLowerCase().includes(q)) {
        results.push({
          id: ch.id,
          title: `${ch.nameHi} (${ch.nameEn})`,
          subtitle: `Chapter ${ch.chapterNumber} · ${ch.estimatedMinutes} mins`,
          type: 'chapter',
          targetId: ch.id,
        });
      }
    });

    // Search questions
    this.data.questions.forEach((qu) => {
      if (qu.questionEn.toLowerCase().includes(q) || qu.questionHi.includes(q)) {
        results.push({
          id: qu.id,
          title: qu.questionHi.substring(0, 60) + '...',
          subtitle: `MCQ · Difficulty: ${qu.difficulty}`,
          type: 'question',
          targetId: qu.chapterId,
        });
      }
    });

    return results.slice(0, 20);
  }

  // Announcements
  public getAnnouncements() {
    return this.data.announcements.filter((a) => a.isActive);
  }

  public addAnnouncement(ann: Announcement) {
    this.data.announcements.unshift(ann);
    this.save();
    return ann;
  }

  // Admin: Course & Chapter CRUD
  public createCourse(course: Course) {
    this.data.courses.push(course);
    this.save();
    return course;
  }

  public updateCourse(id: string, updates: Partial<Course>) {
    const course = this.data.courses.find((c) => c.id === id);
    if (course) {
      Object.assign(course, updates);
      this.save();
    }
    return course;
  }

  public deleteCourse(id: string) {
    this.data.courses = this.data.courses.filter((c) => c.id !== id);
    this.save();
    return true;
  }

  public createSubject(subject: Subject) {
    this.data.subjects.push(subject);
    this.save();
    return subject;
  }

  public createChapter(chapter: Chapter) {
    this.data.chapters.push(chapter);
    this.save();
    return chapter;
  }

  public addQuestion(question: QuestionServer) {
    this.data.questions.push(question);
    this.save();
    return question;
  }

  public bulkImportQuestions(newQuestions: QuestionServer[]) {
    this.data.questions.push(...newQuestions);
    this.save();
    return newQuestions.length;
  }

  public saveOfficialNote(note: OfficialNote) {
    const index = this.data.officialNotes.findIndex((n) => n.id === note.id || n.chapterId === note.chapterId);
    if (index >= 0) {
      this.data.officialNotes[index] = note;
    } else {
      this.data.officialNotes.push(note);
    }
    this.save();
    return note;
  }

  // Subscription & Paid Access Management
  public getSubscriptionPlan(): SubscriptionPlan {
    return this.data.subscriptionPlan;
  }

  public updateSubscriptionPlan(updates: Partial<SubscriptionPlan>): SubscriptionPlan {
    this.data.subscriptionPlan = { ...this.data.subscriptionPlan, ...updates };
    this.save();
    return this.data.subscriptionPlan;
  }

  public getPaymentTransactions(): PaymentTransaction[] {
    return this.data.paymentTransactions;
  }

  public unlockUserSubscription(
    userId: string,
    txDetails: { amount: number; paymentMethod: string; utrNumber?: string }
  ) {
    const user = this.findUserById(userId);
    if (!user) return null;

    user.isPaidMember = true;
    user.paidExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const tx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      studentName: user.name,
      studentEmail: user.email,
      amount: txDetails.amount || this.data.subscriptionPlan.price,
      paymentMethod: txDetails.paymentMethod || 'UPI Instant',
      utrNumber: txDetails.utrNumber || `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      status: 'success',
      createdAt: new Date().toISOString(),
    };

    this.data.paymentTransactions.unshift(tx);
    this.data.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      userId,
      action: 'PAID_BATCH_UNLOCKED',
      details: `Student ${user.name} unlocked All-Access Paid Batch for ₹${tx.amount} (${tx.paymentMethod})`,
      timestamp: new Date().toISOString(),
    });

    this.save();
    return { user, transaction: tx };
  }

  public toggleUserPaidStatus(userId: string, isPaid: boolean) {
    const user = this.findUserById(userId);
    if (user) {
      user.isPaidMember = isPaid;
      this.save();
    }
    return user;
  }

  public toggleChapterDemoStatus(chapterId: string, isFreeDemo: boolean) {
    const chapter = this.data.chapters.find((ch) => ch.id === chapterId);
    if (chapter) {
      chapter.isFreeDemo = isFreeDemo;
      this.save();
    }
    return chapter;
  }
}

export const db = new DatabaseService();
