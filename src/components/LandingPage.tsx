import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, ArrowRight, AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";
import { useAppAuth } from "../context/AuthContext";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

interface LandingPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function LandingPage({ darkMode, onToggleTheme }: LandingPageProps) {
  const { isClerkConfigured, signInWithDemo } = useAppAuth();
  const [email, setEmail] = useState("");
  const [demoError, setDemoError] = useState("");

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setDemoError("Please enter a valid email address for the demo.");
      return;
    }
    setDemoError("");
    signInWithDemo(email.trim());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-creo-black text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-creo-black/70 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
        </div>
      </nav>

      {/* Hero and Auth Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-6 py-12 gap-12 items-center justify-center">
        {/* Left Side: Copy/Intro */}
        <div className="flex-1 space-y-8 text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-creo-gold/10 border border-creo-gold/25 text-creo-gold text-sm font-medium tracking-wide">
            <Sparkles size={14} className="animate-pulse" />
            <span>Next-Gen Content Copywriting</span>
          </div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight"
            >
              Transform your ideas into{" "}
              <span className="text-creo-gold relative inline-block">
                ready-to-use
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-creo-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>{" "}
              content instantly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg text-slate-500 dark:text-slate-400 font-sans font-light leading-relaxed"
            >
              Creo utilizes server-safe Gemini AI intelligence to write high-converting copy across YouTube, LinkedIn, Instagram, Blogs, Emails, and more. Describe your topic, choose your tone, and let Creo do the rest.
            </motion.p>
          </div>

          {/* Social Proof Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-xs font-mono text-slate-400 dark:text-slate-500"
          >
            <div>⚡ ZERO PREAMBLE OUTPUT</div>
            <div>📋 ONE-CLICK CLIPBOARD</div>
            <div>🗂️ SECURED HISTORY LOGS</div>
          </motion.div>
        </div>

        {/* Right Side: Auth Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-md bg-white dark:bg-creo-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-creo-gold/2"
        >
          {isClerkConfigured ? (
            /* REAL CLERK INTERFACE */
            <div className="space-y-6 text-center">
              <div>
                <span className="text-xs font-mono tracking-widest text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full uppercase">
                  ✓ Clerk Auth Active
                </span>
                <h2 className="text-2xl font-display font-bold mt-4">
                  Welcome to Creo
                </h2>
                <p className="text-sm text-slate-400 dark:text-slate-400 mt-1.5">
                  Sign in or create an account securely via Clerk's industry-leading identity provider.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <SignInButton mode="modal">
                  <button className="w-full py-3 px-4 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
                    <span>Sign In securely with Clerk</span>
                    <ArrowRight size={16} />
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-creo-black/40 hover:bg-slate-50 dark:hover:bg-creo-black/80 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <span>Create a new Account</span>
                  </button>
                </SignUpButton>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                Clerk manages identity, tokens, session state, and security automatically.
              </p>
            </div>
          ) : (
            /* DEMO/SETUP MODE */
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono tracking-wide text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase w-fit mx-auto">
                  <ShieldAlert size={12} className="shrink-0" />
                  <span>Clerk Setup Required</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-center mt-4">
                  Welcome back to Creo
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-400 text-center mt-2 leading-relaxed">
                  Authentication is transitioning to **Clerk**. To enable Clerk fully, add <code className="bg-slate-100 dark:bg-white/5 px-1 py-0.5 rounded text-amber-400 font-mono">VITE_CLERK_PUBLISHABLE_KEY</code> inside Settings &gt; Secrets.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl space-y-2 text-xs">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">How to activate Clerk:</h3>
                <ol className="list-decimal list-inside text-slate-500 dark:text-slate-400 space-y-1 ml-0.5 leading-relaxed">
                  <li>Visit your <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="text-creo-gold underline">Clerk Dashboard</a></li>
                  <li>Copy your **Publishable Key** (<code className="text-[10px]">pk_test_...</code>)</li>
                  <li>Click **Settings** &gt; **Secrets** in AI Studio and paste it!</li>
                </ol>
              </div>

              <div className="relative my-4 text-center">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-slate-200 dark:bg-slate-800" />
                <span className="relative z-10 px-3 bg-white dark:bg-creo-dark text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Or Test Demo Now
                </span>
              </div>

              {demoError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2 items-center">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{demoError}</span>
                </div>
              )}

              <form onSubmit={handleDemoLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                    Enter Email for Demo Login
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-creo-black/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-creo-gold focus:ring-1 focus:ring-creo-gold/30 transition-all font-sans text-sm"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-creo-gold hover:bg-creo-gold/90 text-creo-black font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Launch Demo Sandbox</span>
                  <ArrowRight size={16} />
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
