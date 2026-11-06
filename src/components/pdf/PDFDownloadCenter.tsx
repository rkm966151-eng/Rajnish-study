import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { printDocument } from '../../utils/pdfExport.ts';
import {
  FileText,
  Download,
  BookOpen,
  HelpCircle,
  Award,
  Sparkles,
  CheckCircle,
  Printer,
} from 'lucide-react';

export const PDFDownloadCenter: React.FC = () => {
  const { t, language } = useLanguage();
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadableDocs = [
    {
      id: 'doc_class10_chem',
      titleEn: 'Class 10 Science: Chemical Reactions & Equations (Official Notes)',
      titleHi: 'कक्षा 10 विज्ञान: रासायनिक अभिक्रियाएँ एवं समीकरण (अधिकारिक नोट्स)',
      type: 'official_notes',
      size: '2.4 MB · A4 Format',
      fetchUrl: '/api/notes/official/ch_c10_sci_1',
    },
    {
      id: 'doc_ssc_gk',
      titleEn: 'SSC CGL Indian Polity & Fundamental Rights (Theory & 100+ Facts)',
      titleHi: 'एसएससी सीजीएल भारतीय राजव्यवस्था एवं मौलिक अधिकार (थ्योरी एवं तथ्य)',
      type: 'official_notes',
      size: '3.1 MB · A4 Format',
      fetchUrl: '/api/notes/official/ch_ssc_gk_1',
    },
    {
      id: 'doc_mcq_chem',
      titleEn: 'Chemical Reactions Chapter Question Bank with Detailed Explanations',
      titleHi: 'रासायनिक अभिक्रियाएँ वस्तुनिष्ठ प्रश्न बैंक एवं विस्तृत व्याख्या',
      type: 'quiz_sheet',
      size: '1.8 MB · A4 Format',
      fetchUrl: '/api/quiz/questions/ch_c10_sci_1',
    },
    {
      id: 'doc_mock_paper',
      titleEn: 'All India Full-Length Bilingual Mock Test Paper 2026',
      titleHi: 'अखिल भारतीय संपूर्ण द्विभाषी मॉक टेस्ट प्रश्न पत्र 2026',
      type: 'mock_test',
      size: '4.2 MB · A4 Format',
      fetchUrl: '/api/quiz/mock-test',
    },
  ];

  const handleDownload = async (doc: (typeof downloadableDocs)[0]) => {
    setDownloading(doc.id);
    try {
      if (doc.type === 'official_notes') {
        const res = await fetch(doc.fetchUrl);
        const data = await res.json();
        const note = data.note;
        if (note) {
          const content = language === 'hi' ? note.contentHi : note.contentEn;
          const title = language === 'hi' ? note.titleHi : note.titleEn;
          printDocument({
            title,
            subtitle: 'Rajnish Study Official Printable Study Material',
            sections: [
              { heading: 'Overview', content: content.overview },
              {
                heading: 'Important Definitions',
                content: content.keyDefinitions?.map((d: any) => `• ${d.term}: ${d.definition}`).join('\n\n') || '',
              },
              {
                heading: 'Key Principles & Notes',
                content: content.importantPoints?.join('\n') || '',
              },
              {
                heading: 'Formulas & Equations',
                content: content.formulas?.map((f: any) => `[${f.name}]\n${f.formula}\n${f.explanation}`).join('\n\n') || '',
              },
              { heading: 'Summary', content: content.summary || '' },
            ],
            language,
          });
        }
      } else if (doc.type === 'quiz_sheet') {
        const title = language === 'hi' ? doc.titleHi : doc.titleEn;
        printDocument({
          title,
          subtitle: 'Official Practice Question Paper & Answer Key',
          sections: [
            {
              heading: 'Instructions',
              content: 'All questions carry equal marks. Choose the most appropriate single option.',
            },
            {
              heading: 'Sample Question Set',
              content:
                '1. Which of the following is a chemical change?\n(A) Melting of ice  (B) Dissolving sugar  (C) Rusting of iron  (D) Boiling water\nAns: (C) Rusting of iron - Forms new chemical oxide.\n\n2. What is slaked lime?\n(A) CaO  (B) Ca(OH)2  (C) CaCO3  (D) CaCl2\nAns: (B) Ca(OH)2 - Formed by vigorous exothermic hydration of CaO.\n\n3. Balance: 4Al + 3O2 -> 2Al2O3\nAns: Stoichiometric coefficients are 4, 3, and 2 respectively.',
            },
          ],
          language,
        });
      } else if (doc.type === 'mock_test') {
        const title = language === 'hi' ? doc.titleHi : doc.titleEn;
        printDocument({
          title,
          subtitle: 'Rajnish Study All-India Bilingual Mock Test Paper',
          sections: [
            {
              heading: 'General Instructions / सामान्य निर्देश',
              content:
                '• Duration: 60 minutes / कुल समय: 60 मिनट\n• Maximum Marks: 100 / पूर्णांक: 100\n• Negative marking: 0.50 marks for each incorrect answer.\n• Bilingual support: Hindi & English.',
            },
            {
              heading: 'Section 1: General Studies & Science',
              content:
                'Q1. Under which Article of Indian Constitution can Supreme Court issue writs?\n(A) Article 21  (B) Article 32  (C) Article 226  (D) Article 368\n\nQ2. Which gas is filled in chips packets to prevent rancidity?\n(A) Oxygen  (B) Nitrogen  (C) Carbon dioxide  (D) Chlorine\n\nQ3. Revolt of 1857 started from which cantonment?\n(A) Meerut  (B) Barrackpore  (C) Jhansi  (D) Gwalior',
            },
            {
              heading: 'Section 2: Quantitative Aptitude & Mathematics',
              content:
                'Q4. If 20% of A is equal to 30% of B, what is the ratio of A to B?\n(A) 2:3  (B) 3:2  (C) 4:5  (D) 5:4\n\nQ5. A shopkeeper gives 10% discount on marked price and still gains 20%. If cost price is Rs. 300, find marked price.',
            },
          ],
          language,
        });
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B192C] text-white border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Printer className="w-3.5 h-3.5" />
          <span>{t.pdf.title}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          {language === 'hi'
            ? 'अधिकारिक अध्ययन सामग्री एवं टेस्ट पेपर पीडीएफ डाउनलोड'
            : 'Download Official Notes & Mock Test Papers in Printable A4 PDF'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {t.pdf.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {downloadableDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  {doc.type === 'official_notes' ? (
                    <BookOpen className="w-5 h-5" />
                  ) : doc.type === 'quiz_sheet' ? (
                    <HelpCircle className="w-5 h-5" />
                  ) : (
                    <Award className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {doc.size}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? doc.titleHi : doc.titleEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t.pdf.hindiUnicodeNotice}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Syllabus
              </span>

              <button
                onClick={() => handleDownload(doc)}
                disabled={downloading === doc.id}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs whitespace-nowrap disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {downloading === doc.id ? t.pdf.generating : t.pdf.downloadNow}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
