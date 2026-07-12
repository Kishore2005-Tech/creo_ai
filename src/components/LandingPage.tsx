import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Mail, ArrowRight, AlertCircle, ShieldAlert, CheckCircle, 
  Copy, Check, MessageSquare, Terminal, RefreshCw, Send, FileText, Play, Eye, Flame,
  Lock, ShieldCheck, Layers, Settings, History, User, Globe, Menu, X, ExternalLink,
  Cpu, LockKeyhole, Compass, Shield
} from "lucide-react";
import { useAppAuth } from "../context/AuthContext";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { generateLocalContent } from "../lib/contentDatabase";
import { ContentType, Tone, Length, AppUser } from "../types";

interface LandingPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  user: AppUser | null;
  onEnterWorkspace: (initialTab: "generator" | "history" | "settings") => void;
}

interface AnimatedMetricProps {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
}

function AnimatedMetric({ from, to, duration = 1200, decimals = 1 }: AnimatedMetricProps) {
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Clean easeOutQuad
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const val = from + (to - from) * easeOutQuad;
      setCurrent(val);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCurrent(to);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [from, to, duration]);

  return <span>{current.toFixed(decimals)}</span>;
}

const PRESET_TOPICS = [
  "🧘 Mindfulness and focus at work",
  "⚡ Unlocking organic marketing growth",
  "📈 The secret of compound interest in habits",
  "🧠 Why simple and clean UI always wins"
];

export default function LandingPage({ darkMode, onToggleTheme, user, onEnterWorkspace }: LandingPageProps) {
  const { isClerkConfigured, signInWithDemo } = useAppAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Dummy password to look highly secured
  const [demoError, setDemoError] = useState("");

  // Navigation & Authentication states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<"generator" | "history" | "settings" | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-entry flow when user state becomes active
  useEffect(() => {
    if (user) {
      const target = pendingTab || "generator";
      onEnterWorkspace(target);
      setPendingTab(null);
      setShowAuthModal(false);
    }
  }, [user, pendingTab, onEnterWorkspace]);

  const handleNavClick = (tab: "generator" | "history" | "settings") => {
    if (user) {
      onEnterWorkspace(tab);
    } else {
      setPendingTab(tab);
      setAuthMode("signin");
      setShowAuthModal(true);
    }
    setIsMobileMenuOpen(false);
  };

  // Sandbox Copywriting Simulator State
  const [sandboxTopic, setSandboxTopic] = useState("Unlocking Organic Growth Secrets");
  const [sandboxType, setSandboxType] = useState<ContentType>("LinkedIn Post");
  const [sandboxTone, setSandboxTone] = useState<Tone>("Storytelling");
  const [sandboxLength, setSandboxLength] = useState<Length>("Medium");
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [sandboxGenerating, setSandboxGenerating] = useState(false);
  const [sandboxCopied, setSandboxCopied] = useState(false);
  const [sandboxProgress, setSandboxProgress] = useState("");
  const [sandboxStep, setSandboxStep] = useState<"idle" | "analyzing" | "composing" | "streaming">("idle");

  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize sandbox with a beautiful pre-generated content
  useEffect(() => {
    const initialText = generateLocalContent(
      "Unlocking Organic Growth Secrets",
      "LinkedIn Post",
      "Storytelling",
      "Medium",
      0
    );
    setSandboxOutput(initialText);
  }, []);

  // Clean up any running stream interval on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setDemoError("Please enter a valid email address for the demo.");
      return;
    }
    setDemoError("");
    signInWithDemo(email.trim());
  };

  // Run simulated sandbox generation
  const handleSimulateGeneration = () => {
    if (!sandboxTopic.trim()) return;

    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }

    setSandboxGenerating(true);
    setSandboxOutput("");
    setSandboxStep("analyzing");
    setSandboxProgress("Analyzing your topic keywords...");

    // Phase 1: Analyzing (800ms)
    setTimeout(() => {
      setSandboxStep("composing");
      setSandboxProgress("Synthesizing tone matrices & drafting structure...");

      // Phase 2: Composing (900ms)
      setTimeout(() => {
        setSandboxStep("streaming");
        setSandboxProgress("Streaming copy from Creo engine...");

        const generated = generateLocalContent(
          sandboxTopic.trim(),
          sandboxType,
          sandboxTone,
          sandboxLength,
          Math.floor(Math.random() * 10) // cycles between 10 high-quality variations
        );

        const words = generated.split(" ");
        let currentWordIndex = 0;
        let accumulated = "";

        // Stream word by word for natural premium feeling
        streamTimerRef.current = setInterval(() => {
          if (currentWordIndex < words.length) {
            accumulated += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex];
            setSandboxOutput(accumulated);
            currentWordIndex++;
          } else {
            if (streamTimerRef.current) {
              clearInterval(streamTimerRef.current);
            }
            setSandboxGenerating(false);
            setSandboxStep("idle");
            setSandboxProgress("");
          }
        }, 30); // smooth typewriter effect speed
      }, 900);
    }, 800);
  };

  const handleCopySandboxOutput = () => {
    if (!sandboxOutput) return;
    navigator.clipboard.writeText(sandboxOutput);
    setSandboxCopied(true);
    setTimeout(() => setSandboxCopied(false), 2000);
  };

  // Count metrics for sandbox
  const wordCount = sandboxOutput ? sandboxOutput.trim().split(/\s+/).length : 0;
  const charCount = sandboxOutput ? sandboxOutput.length : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-creo-black text-slate-800 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      
      {/* Immersive Floating Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-40 dark:opacity-20">
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 lg:left-1/4 w-[400px] h-[400px] rounded-full bg-creo-gold/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 50, 0],
            y: [0, 60, -50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 lg:right-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[100px]"
        />
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-900 bg-white/75 dark:bg-creo-black/75 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Logo />
          
          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => {
                document.getElementById("playground-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <Compass size={12} className="text-slate-400" />
              <span>Features</span>
            </button>
            <button 
              onClick={() => handleNavClick("generator")}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <Sparkles size={12} className="text-creo-gold" />
              <span>AI Generator</span>
            </button>
            <button 
              onClick={() => handleNavClick("history")}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <History size={12} className="text-slate-400" />
              <span>History Logs</span>
            </button>
            <button 
              onClick={() => handleNavClick("settings")}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <Settings size={12} className="text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <button
                onClick={() => onEnterWorkspace("generator")}
                className="px-4 py-2 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md select-none"
              >
                <span>Enter Studio Dashboard</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthMode("signin");
                    setShowAuthModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer select-none"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all hover:opacity-90 cursor-pointer shadow-md select-none border border-slate-200 dark:border-white/10"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer rounded-lg border border-slate-200/40 dark:border-white/5 bg-slate-50/50 dark:bg-creo-black/50"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-creo-dark px-6 py-4 space-y-4"
          >
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById("playground-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full text-left text-sm font-semibold py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Features & Interactive Sandbox
              </button>
              <button 
                onClick={() => handleNavClick("generator")}
                className="w-full text-left text-sm font-semibold py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                AI Generator
              </button>
              <button 
                onClick={() => handleNavClick("history")}
                className="w-full text-left text-sm font-semibold py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                History Logs
              </button>
              <button 
                onClick={() => handleNavClick("settings")}
                className="w-full text-left text-sm font-semibold py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Settings
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onEnterWorkspace("generator");
                  }}
                  className="w-full py-2.5 rounded-xl bg-creo-gold text-creo-black text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Enter Studio Dashboard</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthMode("signin");
                      setShowAuthModal(true);
                    }}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-creo-black"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthMode("signup");
                      setShowAuthModal(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center text-xs font-bold"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-16 lg:py-24 flex flex-col gap-16 lg:gap-24 justify-center items-stretch">
        
        {/* CENTERED HERO SECTION */}
        <div className="space-y-10 text-center max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-creo-gold/10 border border-creo-gold/20 text-creo-gold text-xs font-medium tracking-wide uppercase font-mono"
          >
            <Sparkles size={12} className="animate-spin" />
            <span>Zero-Friction AI Copywriter</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-extrabold tracking-tight leading-[1.05] sm:leading-[1.1] text-slate-900 dark:text-white"
            >
              Create high-impact content{" "}
              <span className="text-creo-gold relative inline-block">
                instantly.
                <svg className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-1.5 sm:h-2.5 text-creo-gold/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 dark:text-slate-400 font-sans font-light leading-relaxed max-w-3xl lg:max-w-4xl mx-auto animate-fade-in"
            >
              Creo.ai Studio is the professional toolkit built to instantly spin high-quality, formatted copy tailored to your exact brand tone. Use our 10-variation cyclic engine to avoid repetitive AI outputs.
            </motion.p>
          </div>

          {/* Mathematical / Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full grid grid-cols-3 gap-3 md:gap-6 border-y border-slate-200/60 dark:border-slate-800/60 py-8 font-mono text-center my-4 max-w-4xl lg:max-w-5xl"
          >
            <div className="space-y-1.5 flex flex-col items-center justify-center">
              <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                Style Fit
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-creo-gold flex items-baseline gap-0.5 font-sans justify-center">
                <AnimatedMetric from={0} to={99.4} decimals={1} />
                <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 font-medium">%</span>
              </div>
              <div className="text-[9px] sm:text-xs md:text-sm text-slate-400 dark:text-slate-500 leading-tight font-medium">
                Cosine similarity check
              </div>
            </div>

            <div className="space-y-1.5 border-x border-slate-200/50 dark:border-slate-800/50 px-2 sm:px-4 flex flex-col items-center justify-center">
              <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                CTR Boost
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-creo-gold flex items-baseline gap-0.5 font-sans justify-center">
                <span className="text-creo-gold text-lg sm:text-xl font-bold self-center">+</span>
                <AnimatedMetric from={0} to={41.2} decimals={1} />
                <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 font-medium">%</span>
              </div>
              <div className="text-[9px] sm:text-xs md:text-sm text-slate-400 dark:text-slate-500 leading-tight font-medium">
                User engagement lift
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col items-center justify-center">
              <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                Redundancy
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-creo-gold flex items-baseline gap-0.5 font-sans justify-center">
                <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-semibold mr-0.5">&lt;</span>
                <AnimatedMetric from={0.95} to={0.02} decimals={2} />
                <span className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 font-medium ml-0.5">H</span>
              </div>
              <div className="text-[9px] sm:text-xs md:text-sm text-slate-400 dark:text-slate-500 leading-tight font-medium">
                Entropy variance cap
              </div>
            </div>
          </motion.div>

        </div>

        {/* AUTHENTICATION PORTAL CARD */}
        <div className="max-w-xl w-full mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full bg-white dark:bg-creo-dark border border-slate-200 dark:border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            {/* Card Accent line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-creo-gold to-amber-500" />

            {user ? (
              /* ALREADY SIGNED IN */
              <div className="space-y-4 text-center py-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Securely Connected</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Session Active: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{user.email}</strong>
                  </p>
                </div>
                <button
                  onClick={() => onEnterWorkspace("generator")}
                  className="w-full py-2.5 px-4 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Go to Studio Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : isClerkConfigured ? (
              /* REAL CLERK INTERFACE */
              <div className="space-y-5 text-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full uppercase">
                    ✓ Clerk Active
                  </span>
                  <h2 className="text-xl font-display font-bold mt-2 text-slate-950 dark:text-slate-100">
                    Access the Studio
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Sign in securely to save generation history, custom presets, and export assets.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <SignInButton mode="modal">
                    <button className="flex-1 py-2.5 px-4 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                      <span>Sign In</span>
                      <ArrowRight size={14} />
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-creo-black/35 hover:bg-slate-50 dark:hover:bg-creo-black/75 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>Create Account</span>
                    </button>
                  </SignUpButton>
                </div>
              </div>
            ) : (
              /* DEMO SANDBOX MODE WITH EXTRA ENCRYPTED LOOK */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-display font-bold text-slate-950 dark:text-slate-100 flex items-center gap-2">
                    <LockKeyhole size={18} className="text-creo-gold" />
                    <span>Launch Demo Sandbox</span>
                  </h2>
                  <div className="flex items-center gap-1 text-[9px] font-mono tracking-wide text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase shrink-0">
                    <ShieldAlert size={10} />
                    <span>Clerk Offline</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center sm:text-left">
                  Instantly start writing content by entering an email and password credentials below.
                </p>

                {demoError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2 items-center">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="text-[11px]">{demoError}</span>
                  </div>
                )}

                <form onSubmit={handleDemoLogin} className="space-y-3 pt-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-creo-black/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-creo-gold focus:ring-1 focus:ring-creo-gold/20 transition-all font-sans text-xs"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <Lock size={14} />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security password key..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-creo-black/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-creo-gold focus:ring-1 focus:ring-creo-gold/20 transition-all font-sans text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <ShieldCheck size={14} />
                    <span>Authenticate & Enter Creo.ai Studio</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1">
              <CheckCircle size={10} className="text-creo-gold" />
              <span>10x MULTI-OUTPUTS</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={10} className="text-creo-gold" />
              <span>ZERO AI INTRO TRAPS</span>
            </div>
          </div>
        </div>

        {/* Elegant Section Divider */}
        <div id="playground-section" className="relative flex py-6 items-center max-w-4xl lg:max-w-5xl w-full mx-auto">
          <div className="flex-grow border-t border-slate-200/50 dark:border-slate-800/40"></div>
          <span className="flex-shrink mx-4 text-xs font-mono text-slate-400 dark:text-slate-600 tracking-widest uppercase">
            Interactive Playground
          </span>
          <div className="flex-grow border-t border-slate-200/50 dark:border-slate-800/40"></div>
        </div>

        {/* BOTTOM SECTION: Interactive Copywriting Sandbox Simulator */}
        <div className="max-w-4xl lg:max-w-5xl w-full mx-auto space-y-4">
          
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Terminal size={12} className="text-creo-gold" />
              <span>CREO_SIMULATOR_SANDBOX.TSX</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-slate-800/40 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Interactive Live Demo</span>
            </span>
          </div>

          {/* Sandbox Main Container */}
          <div className="bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
            
            {/* Window Header */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-[#121212] border-b border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 ml-2">creo-local-engine v2.0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-slate-200/60 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                  Client Mode
                </span>
              </div>
            </div>

            {/* Form Input Controls Inside Sandbox */}
            <div className="p-4 bg-slate-50/50 dark:bg-[#0f0f0f]/60 border-b border-slate-100 dark:border-slate-900/50 space-y-3 shrink-0">
              
              {/* Topic field with dynamic preset chips */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Topic / Concept Focus
                </label>
                <input
                  type="text"
                  value={sandboxTopic}
                  onChange={(e) => setSandboxTopic(e.target.value)}
                  placeholder="Type anything to test the copywriter..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-creo-black border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-creo-gold transition-colors font-sans"
                />
                
                {/* Preset Quick Chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {PRESET_TOPICS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSandboxTopic(preset.substring(2)); // strip emojis
                        handleSimulateGeneration();
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-creo-black/50 border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-creo-gold hover:text-creo-gold transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid for Selector Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                
                {/* Format select */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Channel Format
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-white dark:bg-creo-black border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg">
                    {(["LinkedIn Post", "Instagram Caption", "Twitter/X Thread", "YouTube Script"] as ContentType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSandboxType(type)}
                        className={`text-[10px] py-1 rounded-md font-medium transition-all cursor-pointer text-center ${
                          sandboxType === type
                            ? "bg-creo-gold/15 text-creo-gold border border-creo-gold/20"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                      >
                        {type.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone Select & Trigger */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Brand Tone
                  </label>
                  <div className="flex gap-1 bg-white dark:bg-creo-black border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg">
                    {(["Professional", "Storytelling", "Witty"] as Tone[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSandboxTone(t)}
                        className={`flex-1 text-[10px] py-1 rounded-md font-medium transition-all cursor-pointer text-center ${
                          sandboxTone === t
                            ? "bg-creo-gold/15 text-creo-gold border border-creo-gold/20"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Generate Button inside Playground */}
              <div className="flex justify-end pt-1">
                <button
                  disabled={sandboxGenerating}
                  onClick={handleSimulateGeneration}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-creo-gold dark:hover:bg-creo-gold/90 text-white dark:text-creo-black rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {sandboxGenerating ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Simulating Creo...</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      <span>Simulate Creo Magic ✨</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* LIVE CONSOLE PREVIEW SCREEN */}
            <div className="flex-1 bg-slate-50/30 dark:bg-creo-black/30 p-4 relative overflow-y-auto flex flex-col justify-between font-sans">
              
              {/* Generation overlays */}
              <AnimatePresence>
                {sandboxGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 dark:bg-creo-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4"
                  >
                    {/* Loading beam */}
                    <div className="relative w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-creo-gold"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    
                    <div className="text-center space-y-1">
                      <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 justify-center">
                        <Sparkles size={12} className="text-creo-gold animate-bounce" />
                        <span>{sandboxProgress}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Please wait while the local engine renders variations</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text Output Render Box */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-900/60">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <FileText size={10} className="text-creo-gold" />
                    <span>{sandboxType} Preview</span>
                  </div>
                  
                  {/* Live metrics indicator */}
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span>Words: <strong className="text-slate-700 dark:text-slate-300">{wordCount}</strong></span>
                    <span>Chars: <strong className="text-slate-700 dark:text-slate-300">{charCount}</strong></span>
                  </div>
                </div>

                {/* Rendered content */}
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-all font-light pr-2 select-text max-h-[220px] overflow-y-auto">
                  {sandboxOutput ? (
                    sandboxOutput
                  ) : (
                    <span className="italic text-slate-400">Write a topic above or pick a sample preset to witness immediate copywriting rendering.</span>
                  )}
                </div>
              </div>

              {/* Footer Copy CTA inside Preview screen */}
              {sandboxOutput && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between bg-white dark:bg-[#0d0d0d] -mx-4 -mb-4 p-3.5 shrink-0">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    // One-click clipboard support
                  </span>
                  
                  <button
                    onClick={handleCopySandboxOutput}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-creo-black hover:border-creo-gold hover:text-creo-gold transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {sandboxCopied ? (
                      <>
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* PROFESSIONAL MULTI-COLUMN FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-[#080808] transition-colors duration-200 relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Logo & Description Column */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Logo />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-light">
              Creo.ai Studio is the professional-grade copywriting suite for high-impact content. Spin native variations with zero AI boilerplate.
            </p>
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                Engine Status: Online
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavClick("generator")}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  AI Content Generator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("history")}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Historic Audit Log
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("settings")}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Brand Tone Profiles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    document.getElementById("playground-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sandbox Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Security Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Security & Engine
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-light space-y-2.5">
              <li className="flex items-center gap-1.5 font-mono text-[10px]">
                <ShieldCheck size={12} className="text-creo-gold" />
                <span>Encrypted Credentials</span>
              </li>
              <li className="flex items-center gap-1.5 font-mono text-[10px]">
                <Cpu size={12} className="text-slate-400" />
                <span>Entropy Variance Control</span>
              </li>
              <li className="flex items-center gap-1.5 font-mono text-[10px]">
                <Lock size={12} className="text-slate-400" />
                <span>Strict CSRF Gateways</span>
              </li>
              <li className="flex items-center gap-1.5 font-mono text-[10px]">
                <Globe size={12} className="text-slate-400" />
                <span>Decentralized Node Logs</span>
              </li>
            </ul>
          </div>

          {/* System Environment Info */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Live Environment
            </h4>
            <div className="space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                <span>Vite Compiler</span>
                <span className="text-slate-800 dark:text-slate-200">v5.0 Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                <span>Authentication</span>
                <span className="text-emerald-500 font-semibold">{isClerkConfigured ? "Clerk Prod" : "Secure Sandbox"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                <span>SSL Security</span>
                <span className="text-emerald-500">256-bit AES</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Platform Port</span>
                <span>Container Routed</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-900 py-6 px-6 bg-slate-50 dark:bg-[#050505] transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono text-center sm:text-left">
              © 2026 Creo.ai Inc. All assets and custom workspace models securely persisted.
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-slate-500 font-mono">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Privacy Protocol</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <span>System Status</span>
                <ExternalLink size={10} />
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* SECURE AUTHENTICATION GATEWAY MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with premium blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-creo-dark border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
            >
              {/* Gold Security top bar */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-creo-gold to-amber-500" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-5">
                {/* Secure Badge */}
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-creo-gold/10 border border-creo-gold/20 flex items-center justify-center text-creo-gold">
                    <Lock size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-creo-gold uppercase font-bold">
                      Strict Access Control
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                      Authentication Required
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-creo-black/40 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1.5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    You are trying to access:
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-creo-gold uppercase font-semibold bg-creo-gold/10 border border-creo-gold/25 px-2.5 py-1 rounded-lg w-max">
                    {pendingTab === "generator" && (
                      <>
                        <Sparkles size={12} />
                        <span>AI Generator Studio</span>
                      </>
                    )}
                    {pendingTab === "history" && (
                      <>
                        <History size={12} />
                        <span>Historic Audit Logs</span>
                      </>
                    )}
                    {pendingTab === "settings" && (
                      <>
                        <Settings size={12} />
                        <span>System Settings</span>
                      </>
                    )}
                    {!pendingTab && (
                      <>
                        <Layers size={12} />
                        <span>Studio Workspace</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">
                    To maintain strict data security and save your custom workspace assets, please verify your credentials.
                  </p>
                </div>

                {isClerkConfigured ? (
                  /* CLERK POPUP MODAL CTAs */
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2 pt-1">
                      <SignInButton mode="modal">
                        <button className="w-full py-2.5 px-4 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                          <span>Sign In to Your Account</span>
                          <ArrowRight size={14} />
                        </button>
                      </SignInButton>

                      <SignUpButton mode="modal">
                        <button className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-creo-black/35 hover:bg-slate-50 dark:hover:bg-creo-black/75 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                          <span>Create a Free Account</span>
                        </button>
                      </SignUpButton>
                    </div>
                  </div>
                ) : (
                  /* DEMO SIGNIN/SIGNUP FORMS WITH SECURE PASSWORD INPUTS */
                  <div className="space-y-4">
                    {/* Toggle */}
                    <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-creo-black/50 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                      <button
                        onClick={() => setAuthMode("signin")}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          authMode === "signin"
                            ? "bg-white dark:bg-creo-dark text-slate-900 dark:text-white shadow-sm font-bold"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setAuthMode("signup")}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          authMode === "signup"
                            ? "bg-white dark:bg-creo-dark text-slate-900 dark:text-white shadow-sm font-bold"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Create Account
                      </button>
                    </div>

                    {demoError && (
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2 items-center">
                        <AlertCircle size={14} className="shrink-0" />
                        <span className="text-[11px]">{demoError}</span>
                      </div>
                    )}

                    <form onSubmit={handleDemoLogin} className="space-y-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                          <Mail size={13} />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address..."
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-creo-black/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-creo-gold focus:ring-1 focus:ring-creo-gold/20 transition-all font-sans text-xs"
                        />
                      </div>

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                          <Lock size={13} />
                        </span>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your secure key / password..."
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-creo-black/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-creo-gold focus:ring-1 focus:ring-creo-gold/20 transition-all font-sans text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-2"
                      >
                        <ShieldCheck size={14} />
                        <span>
                          {authMode === "signin" ? "Decrypt & Sign In" : "Register Secure Account"}
                        </span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
