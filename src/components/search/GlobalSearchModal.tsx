import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Search, X, BookOpen, Layers, HelpCircle, FileText, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, targetId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onSelectResult }) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = [
    { title: 'Class 10 Science (रासायनिक अभिक्रियाएं)', targetId: 'ch_c10_sci_1', type: 'chapter' },
    { title: 'SSC CGL Polity & Constitution', targetId: 'ch_ssc_gk_1', type: 'chapter' },
    { title: 'Class 6 Knowing Our Numbers (संख्या पद्धति)', targetId: 'ch_c6_math_1', type: 'chapter' },
    { title: 'Railway Reasoning Coding-Decoding', targetId: 'ch_rly_reas_1', type: 'chapter' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <Layers className="w-4 h-4 text-blue-500" />;
      case 'chapter':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'question':
        return <HelpCircle className="w-4 h-4 text-emerald-500" />;
      case 'note':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.placeholder}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results / Popular suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading && (
            <div className="py-6 text-center text-xs text-slate-400">
              {t.common.loading}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.search.results} ({results.length})
              </p>
              {results.map((item) => (
                <button
                  key={`${item.type}_${item.id}`}
                  onClick={() => {
                    onSelectResult(item.type, item.targetId);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              {t.search.noResults}
            </div>
          )}

          {!query && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.search.suggested}
              </p>
              <div className="space-y-1">
                {popularSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectResult(item.type, item.targetId);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {language === 'hi' ? 'खोलें' : 'Open'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
