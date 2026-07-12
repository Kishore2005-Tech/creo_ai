import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  History, Trash2, Calendar, FileText, ArrowLeft, Copy, Check, Download, RefreshCw, Inbox, ChevronDown
} from "lucide-react";
import { ContentHistoryEntry, AppUser } from "../types";
import { getHistoryFromStore, deleteHistoryFromStore } from "../lib/historyStore";

interface HistoryViewProps {
  user: AppUser;
}

export default function HistoryView({ user }: HistoryViewProps) {
  const [history, setHistory] = useState<ContentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<ContentHistoryEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const fetchHistory = () => {
    setLoading(true);
    try {
      const entries = getHistoryFromStore(user.id);
      setHistory(entries);
    } catch (err) {
      console.error("Local history fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (entryId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this piece of history?")) return;

    try {
      deleteHistoryFromStore(user.id, entryId);
      setHistory(prev => prev.filter(item => item.id !== entryId));
      if (selectedEntry?.id === entryId) {
        setSelectedEntry(null);
      }
    } catch (err) {
      console.error("Local history delete error:", err);
    }
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleExport = (entry: ContentHistoryEntry, format: 'txt' | 'md') => {
    const element = document.createElement("a");
    const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
    const file = new Blob([entry.outputText], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `${entry.contentType.toLowerCase().replace(/[\s/]+/g, "_")}_creo.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFormatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return "Recent";
    }
  };

  // Helper colors for badges
  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "Blog Post": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Instagram Caption": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "LinkedIn Post": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "Twitter/X Thread": return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "YouTube Script": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Product Description": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-teal-500/10 text-teal-500 border-teal-500/20";
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <History className="text-creo-gold" />
            Content History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-sans">
            Your personal catalog of saved Gemini-crafted copy.
          </p>
        </div>
        
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-creo-dark text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {[1, 2, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-creo-dark border border-slate-100 dark:border-white/5 rounded-2xl p-6 h-48 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-md w-full" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-md w-2/3" />
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-2xl p-16 text-center select-none max-w-lg mx-auto mt-12 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-5">
            <Inbox size={28} />
          </div>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">No content saved yet</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
            Every piece of copy you compose in the Creo Studio and choose to save will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Main Grid & Morph Detail View */}
          <AnimatePresence mode="wait">
            {!selectedEntry ? (
              /* Grid View */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {history.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layoutId={`card-container-${entry.id}`}
                    whileHover={{ scale: 1.01, border: "1px solid rgba(212, 175, 55, 0.3)" }}
                    onClick={() => setSelectedEntry(entry)}
                    className="bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-2xl p-6 cursor-pointer flex flex-col justify-between hover:shadow-lg transition-all text-left relative overflow-hidden"
                  >
                    <div className="space-y-3.5">
                      {/* Top bar with Badge & Date */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 text-[11px] font-bold border rounded-full uppercase tracking-wider ${getBadgeStyles(entry.contentType)}`}>
                          {entry.contentType}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Calendar size={11} />
                          {getFormatDate(entry.createdAt)}
                        </span>
                      </div>

                      {/* Topic Title */}
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {entry.topic}
                      </h3>

                      {/* Text Snippet Preview */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed line-clamp-3">
                        {entry.outputText}
                      </p>
                    </div>

                    {/* Lower Controls */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-xs font-mono text-slate-400 dark:text-slate-500">
                      <span className="hover:text-creo-gold transition-colors font-semibold">
                        Click to expand →
                      </span>
                      
                      <motion.button
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 dark:text-slate-500 cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Morphed Expanded Detail View */
              <motion.div
                key="detail"
                layoutId={`card-container-${selectedEntry.id}`}
                className="bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-xl relative text-left"
              >
                {/* Close Button / Back */}
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-creo-gold transition-colors focus:outline-none cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Library</span>
                </button>

                {/* Info Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-white/5 pb-5 mb-6 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2.5 items-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold border rounded-full uppercase tracking-wider ${getBadgeStyles(selectedEntry.contentType)}`}>
                        {selectedEntry.contentType}
                      </span>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                        Saved: {getFormatDate(selectedEntry.createdAt)}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Topic: {selectedEntry.topic}
                    </h2>
                  </div>

                  {/* Actions for Detail */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopyText(selectedEntry.outputText)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-creo-gold dark:hover:text-creo-gold transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-green-500" />
                          <span className="text-green-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>

                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-creo-gold dark:hover:text-creo-gold transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Export</span>
                        <ChevronDown size={12} className={`transition-transform duration-200 ${exportMenuOpen ? "rotate-180" : ""}`} />
                      </motion.button>
                      
                      <AnimatePresence>
                        {exportMenuOpen && (
                          <>
                            {/* Backdrop to close the dropdown when clicked outside */}
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setExportMenuOpen(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-xl shadow-xl p-1.5 z-20 flex flex-col gap-0.5"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  handleExport(selectedEntry, 'txt');
                                  setExportMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <FileText size={14} className="text-slate-400" />
                                <span>Export as Plain Text (.txt)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleExport(selectedEntry, 'md');
                                  setExportMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <FileText size={14} className="text-creo-gold" />
                                <span>Export as Markdown (.md)</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(selectedEntry.id)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-slate-50 dark:bg-creo-black/40 border border-slate-200 dark:border-white/5 rounded-xl p-6 relative">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {selectedEntry.outputText}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
