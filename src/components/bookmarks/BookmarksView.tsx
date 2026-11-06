import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { BookmarkItem } from '../../types/index.ts';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  BookOpen,
  HelpCircle,
  FileText,
  Search,
} from 'lucide-react';

interface BookmarksViewProps {
  onOpenItem: (type: string, targetId: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ onOpenItem }) => {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [token]);

  const handleRemove = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const filtered = bookmarks.filter((b) => {
    const matchesType = filterType === 'all' || b.itemType === filterType;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <HelpCircle className="w-4 h-4 text-emerald-500" />;
      case 'official_note':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'personal_note':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <Bookmark className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
          <span>{t.bookmarks.title}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.bookmarks.subtitle}
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Interactive filter buttons per §1.A */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold self-start">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.bookmarks.all}
          </button>
          <button
            onClick={() => setFilterType('question')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'question'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.bookmarks.questions}
          </button>
          <button
            onClick={() => setFilterType('official_note')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === 'official_note'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.bookmarks.notes}
          </button>
        </div>

        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          {t.common.loading}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-xs text-slate-500">{t.bookmarks.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0">
                  {getIcon(b.itemType)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {b.title}
                  </h4>
                  {b.subtitle && (
                    <p className="text-[11px] text-slate-400 truncate">
                      {b.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenItem(b.itemType, b.targetId)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-2xs"
                >
                  <span>{t.bookmarks.open}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(b.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                  title={t.bookmarks.remove}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
