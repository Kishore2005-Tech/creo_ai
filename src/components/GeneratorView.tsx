import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Copy, Check, FileText, RefreshCw, Save, Download, 
  ChevronDown, CheckCircle, AlertCircle
} from "lucide-react";
import { ContentType, Tone, Length, AppUser } from "../types";
import { saveHistoryToStore } from "../lib/historyStore";

interface GeneratorViewProps {
  user: AppUser;
}

const CONTENT_TYPES: ContentType[] = [
  "Blog Post",
  "Instagram Caption",
  "LinkedIn Post",
  "Twitter/X Thread",
  "YouTube Script",
  "Product Description",
  "Email"
];

const TONES: Tone[] = ["Professional", "Casual", "Persuasive", "Witty", "Storytelling"];
const LENGTHS: Length[] = ["Short", "Medium", "Long"];

const QUICK_PROMPTS = [
  {
    label: "Social Media Post",
    topic: "An engaging launch announcement for an organic, zero-sugar energy drink highlighting active focus and natural ingredients.",
    contentType: "LinkedIn Post" as ContentType,
    tone: "Witty" as Tone,
  },
  {
    label: "Blog Intro",
    topic: "The opening hook and introduction for a deep-dive article examining how artificial intelligence is transforming daily clinical diagnosis.",
    contentType: "Blog Post" as ContentType,
    tone: "Professional" as Tone,
  },
  {
    label: "Email Subject Line",
    topic: "A highly compelling, curiosity-driven subject line and preview header for a 24-hour flash sale on minimalist mechanical keyboards.",
    contentType: "Email" as ContentType,
    tone: "Persuasive" as Tone,
  },
  {
    label: "Product Pitch",
    topic: "An elegant, benefits-focused description for ultra-premium noise-canceling headphones emphasizing ergonomic design and rich acoustics.",
    contentType: "Product Description" as ContentType,
    tone: "Storytelling" as Tone,
  }
];

export default function GeneratorView({ user }: GeneratorViewProps) {
  // Input States
  const [contentType, setContentType] = useState<ContentType>("Blog Post");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [topic, setTopic] = useState("");

  // Output States
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [error, setError] = useState("");

  // Live Stats
  const wordCount = outputText ? outputText.trim().split(/\s+/).length : 0;
  const charCount = outputText ? outputText.length : 0;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError("Please describe your topic or idea.");
      return;
    }

    setError("");
    setLoading(true);
    setSaved(false);
    setOutputText("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, topic, tone, length })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}: Failed to generate.`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Could not start streaming reader from response.");

      const decoder = new TextDecoder();
      let done = false;
      let accumulated = "";
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        buffer += decoder.decode(value, { stream: !doneReading });

        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // hold on to the last incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith("data: ")) {
            const dataContent = trimmed.slice(6).trim();
            if (dataContent === "[DONE]") {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(dataContent);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulated += parsed.text;
                setOutputText(accumulated);
              }
            } catch (err) {
              // Ignore JSON parse errors for incomplete buffers
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Generator error:", err);
      setError(err.message || "Something went wrong while generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSaveToHistory = async () => {
    if (!outputText || saved) return;
    try {
      saveHistoryToStore(user.id, {
        userId: user.id,
        contentType,
        topic: topic.trim(),
        outputText,
        createdAt: new Date().toISOString()
      });
      setSaved(true);
    } catch (err: any) {
      console.error("Failed to save to local store:", err);
      setError("Successfully generated, but failed to save in your history logs.");
    }
  };

  const handleExport = (format: 'txt' | 'md') => {
    if (!outputText) return;
    const element = document.createElement("a");
    const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
    const file = new Blob([outputText], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `${contentType.toLowerCase().replace(/[\s/]+/g, "_")}_creo.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          <Sparkles className="text-creo-gold" />
          Creo Studio
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-sans">
          Compose highly engaging material tailored exactly to your brand voice.
        </p>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Topic Input */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  1. Describe Topic / Idea
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  placeholder="What should Creo create for you? e.g. Sustainable Urban Architecture Trends for 2026..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-creo-gold/50 focus:ring-1 focus:ring-creo-gold/30 transition-all font-sans text-sm resize-none"
                />
              </div>

              {/* Predefined Quick Prompts Buttons */}
              <div className="space-y-2">
                <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Quick Prompts:
                </span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.label}
                      type="button"
                      onClick={() => {
                        setTopic(qp.topic);
                        setContentType(qp.contentType);
                        setTone(qp.tone);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-creo-gold/10 hover:text-creo-gold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-creo-gold/20 transition-all cursor-pointer select-none"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                2. Content Format
              </label>
              <div className="relative">
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="w-full appearance-none pl-4 pr-10 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-creo-gold/50 focus:ring-1 focus:ring-creo-gold/30 transition-all font-sans text-sm cursor-pointer"
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-white dark:bg-creo-dark text-slate-800 dark:text-slate-100">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Grid for Tone & Length */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tone */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  3. Brand Tone
                </label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-creo-gold/50 focus:ring-1 focus:ring-creo-gold/30 transition-all font-sans text-sm cursor-pointer"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t} className="bg-white dark:bg-creo-dark text-slate-800 dark:text-slate-100">
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-slate-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Length */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  4. Length Limit
                </label>
                <div className="relative">
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as Length)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-creo-gold/50 focus:ring-1 focus:ring-creo-gold/30 transition-all font-sans text-sm cursor-pointer"
                  >
                    {LENGTHS.map((len) => (
                      <option key={len} value={len} className="bg-white dark:bg-creo-dark text-slate-800 dark:text-slate-100">
                        {len}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-slate-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2 items-start"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-xl font-bold text-sm cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_35px_rgba(212,175,55,0.22)] transition-all flex items-center justify-center gap-2.5 text-creo-black ${
                loading
                  ? "bg-creo-gold/70 animate-pulse cursor-not-allowed"
                  : "bg-creo-gold hover:bg-creo-gold/90"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Creo is composing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} fill="currentColor" />
                  <span>Generate Content</span>
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Right Side: Output Preview Box */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          <div className="flex-1 bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-sm">
            
            {/* Box Header Controls */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-creo-black/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  Generated Output
                </span>
                {outputText && (
                  <span className="px-2 py-0.5 bg-creo-gold/10 text-creo-gold rounded text-[9px] uppercase font-bold tracking-wider">
                    Draft v1.0
                  </span>
                )}
              </div>
              
              {/* Output Actions */}
              <div className="flex items-center gap-2">
                {outputText && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-creo-gold/10 hover:text-creo-gold text-slate-500 dark:text-slate-400 transition-colors cursor-pointer border border-slate-200/50 dark:border-white/10"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={16} className="text-green-500 animate-bounce" /> : <Copy size={16} />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveToHistory}
                      disabled={saved}
                      className={`p-2 rounded-lg text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/10 transition-colors cursor-pointer ${
                        saved 
                          ? "bg-green-500/15 text-green-500 border-green-500/20 cursor-default" 
                          : "bg-slate-100 dark:bg-white/5 hover:bg-creo-gold/10 hover:text-creo-gold"
                      }`}
                      title={saved ? "Saved to history log" : "Save to history log"}
                    >
                      {saved ? <CheckCircle size={16} className="text-green-500" /> : <Save size={16} />}
                    </motion.button>

                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-creo-gold/10 hover:text-creo-gold text-slate-500 dark:text-slate-400 transition-colors cursor-pointer border border-slate-200/50 dark:border-white/10 flex items-center gap-1"
                        title="Export options"
                      >
                        <Download size={16} />
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
                                  handleExport('txt');
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
                                  handleExport('md');
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
                  </>
                )}
              </div>
            </div>

            {/* Editable Text Area Box */}
            <div className="flex-1 p-8 relative flex flex-col min-h-[350px]">
              {outputText ? (
                <textarea
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  className="w-full flex-1 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-200"
                  placeholder="Composition area..."
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 select-none text-slate-300 dark:text-slate-700">
                  <div className="h-14 w-14 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500">No output generated yet</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-600 max-w-xs mt-1">
                    Describe your concept, configure settings on the left, and click "Generate Content".
                  </p>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            {outputText && (
              <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-creo-black/30 flex items-center justify-between text-xs font-mono text-slate-400 dark:text-slate-500 select-none">
                <div>
                  Words: <span className="font-bold text-creo-gold font-mono">{wordCount}</span>
                </div>
                <div>
                  Characters: <span className="font-bold text-creo-gold font-mono">{charCount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
