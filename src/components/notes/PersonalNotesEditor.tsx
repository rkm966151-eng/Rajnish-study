import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { PersonalNote } from '../../types/index.ts';
import { printDocument } from '../../utils/pdfExport.ts';
import {
  FileText,
  Plus,
  Save,
  Trash2,
  Download,
  Search,
  Bookmark,
  Check,
  Tag,
  Clock,
  Edit3,
} from 'lucide-react';

interface PersonalNotesEditorProps {
  defaultChapterId?: string;
  defaultChapterTitle?: string;
}

export const PersonalNotesEditor: React.FC<PersonalNotesEditorProps> = ({
  defaultChapterId,
  defaultChapterTitle,
}) => {
  const { user, token } = useAuth();
  const { t, language } = useLanguage();

  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<PersonalNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSavedNotice, setAutoSavedNotice] = useState(false);

  // Fetch student's private notes
  const fetchNotes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/notes/personal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
        if (data.notes && data.notes.length > 0 && !selectedNote) {
          // If defaultChapterId is provided, pick note for that chapter or select first
          const match = defaultChapterId
            ? data.notes.find((n: PersonalNote) => n.chapterId === defaultChapterId)
            : null;
          handleSelectNote(match || data.notes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load personal notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const handleSelectNote = (note: PersonalNote) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.join(', '));
  };

  const handleCreateNewNote = () => {
    const newNote: PersonalNote = {
      id: `pnot_${Date.now()}`,
      userId: user?.id || 'guest',
      chapterId: defaultChapterId,
      chapterTitle: defaultChapterTitle,
      title: 'New Study Note',
      content: '',
      tags: ['Study'],
      isBookmarked: false,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setSelectedNote(newNote);
    setTitle(newNote.title);
    setContent('');
    setTagsInput('Study');
  };

  const handleSaveNote = async () => {
    if (!token || !selectedNote) return;
    setSaving(true);

    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/notes/personal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedNote.id,
          title: title || 'Untitled Note',
          content,
          tags,
          chapterId: selectedNote.chapterId || defaultChapterId,
          chapterTitle: selectedNote.chapterTitle || defaultChapterTitle,
          isBookmarked: selectedNote.isBookmarked,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAutoSavedNotice(true);
        setTimeout(() => setAutoSavedNotice(false), 2500);
        // Refresh local list
        setNotes((prev) => {
          const idx = prev.findIndex((n) => n.id === data.note.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.note;
            return next;
          }
          return [data.note, ...prev];
        });
        setSelectedNote(data.note);
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!token || !confirm(t.notes.deleteConfirm)) return;
    try {
      const res = await fetch(`/api/notes/personal/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const remaining = notes.filter((n) => n.id !== id);
        setNotes(remaining);
        if (selectedNote?.id === id) {
          if (remaining.length > 0) {
            handleSelectNote(remaining[0]);
          } else {
            setSelectedNote(null);
            setTitle('');
            setContent('');
            setTagsInput('');
          }
        }
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleExportPDF = (noteToExport?: PersonalNote) => {
    const target = noteToExport || selectedNote;
    if (!target) return;

    printDocument({
      title: target.title,
      subtitle: `Personal Notes by ${user?.name || 'Student'} · ${target.chapterTitle || 'General Subject'}`,
      sections: [
        {
          heading: 'Study Notes & Formulas',
          content: target.content || 'No content written yet.',
        },
        {
          heading: 'Associated Tags',
          content: target.tags.join(', ') || 'General',
        },
      ],
      language,
    });
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((tg) => tg.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-500" />
            <span>{t.notes.myPersonalNotes}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'अध्याय अनुसार व्यक्तिगत नोट्स बनाएं, हिंदी व अंग्रेजी में टाइप करें और पीडीएफ डाउनलोड करें'
              : 'Write chapter-scoped private summaries, type in Hindi & English, and export to PDF'}
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.notes.createNewNote}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left Column: Notes List & Search (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 flex flex-col">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.notes.searchNotes}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
            {filteredNotes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                {t.notes.noNotesYet}
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = selectedNote?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-2xs'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                        {new Date(n.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {n.content || 'Empty note'}
                    </p>

                    {n.tags && n.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {n.tags.map((tg, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-slate-500 dark:text-slate-400"
                          >
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Editor (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          {selectedNote ? (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Header Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {selectedNote.chapterTitle || defaultChapterTitle || 'General Notes'}
                  </span>
                  {autoSavedNotice && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                      <Check className="w-3.5 h-3.5" />
                      {t.notes.autoSaved}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportPDF()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.notes.exportPdf}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSaveNote}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? t.common.loading : t.notes.saveNote}</span>
                  </button>
                </div>
              </div>

              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.notes.noteTitlePlaceholder}
                className="w-full text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-none focus:outline-hidden placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />

              {/* Tags input */}
              <div className="flex items-center gap-2 text-xs">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder={t.notes.tagsPlaceholder}
                  className="w-full text-xs text-slate-600 dark:text-slate-300 bg-transparent border-none focus:outline-hidden placeholder:text-slate-400"
                />
              </div>

              {/* Textarea for note content */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.notes.noteContentPlaceholder}
                className="w-full flex-1 min-h-[300px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans focus:outline-hidden focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <p className="text-xs text-slate-500">
                Select an existing note or click "Create New Note" to start writing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
