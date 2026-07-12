import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, History, Settings, LogOut, Moon, Sun, Menu, X, User as UserIcon, ChevronRight
} from "lucide-react";

import LandingPage from "./components/LandingPage";
import GeneratorView from "./components/GeneratorView";
import HistoryView from "./components/HistoryView";
import SettingsView from "./components/SettingsView";
import Logo from "./components/Logo";
import ThemeToggle from "./components/ThemeToggle";
import { AuthProvider, useAppAuth } from "./context/AuthContext";

type ViewTab = "generator" | "history" | "settings";

function AppContent() {
  const { user, loading: authLoading, signOut } = useAppAuth();
  const [activeTab, setActiveTab] = useState<ViewTab>("generator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Dark mode state - dark by default!
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("creo-theme");
    return saved ? saved === "dark" : true;
  });

  // Apply dark mode theme class to document body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("creo-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("creo-theme", "light");
    }
  }, [darkMode]);

  const handleSignOut = () => {
    signOut().catch((err) => console.error("Logout failed:", err));
    setUserMenuOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-creo-black flex flex-col items-center justify-center text-slate-800 dark:text-slate-100 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-creo-black border-2 border-creo-gold/30 flex items-center justify-center text-creo-gold font-bold font-display text-2xl animate-pulse">
              C
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-creo-gold border-t-transparent animate-spin" />
          </div>
          <span className="text-xs font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase animate-pulse">
            Booting Creo Studio...
          </span>
        </div>
      </div>
    );
  }

  // Redirect signed-out users to public landing page
  if (!user) {
    return (
      <LandingPage 
        darkMode={darkMode} 
        onToggleTheme={() => setDarkMode(!darkMode)} 
      />
    );
  }

  // Navigation Items
  const navTabs = [
    { id: "generator" as ViewTab, label: "Generator", icon: Sparkles },
    { id: "history" as ViewTab, label: "History", icon: History },
    { id: "settings" as ViewTab, label: "Settings", icon: Settings },
  ];

  const activeTabDetails = navTabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-creo-black text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col md:flex-row">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-creo-dark border-r border-slate-200 dark:border-white/5 min-h-screen py-8 px-6 shrink-0 relative z-40 transition-colors duration-200">
        {/* Sidebar Logo */}
        <div className="mb-12 px-2">
          <Logo size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative w-full py-3.5 px-4 flex items-center gap-3 rounded-lg text-sm font-semibold transition-colors focus:outline-none cursor-pointer text-left select-none"
              >
                {/* Smooth sliding active-state indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-slate-100 dark:bg-white/5 border-l-2 md:border-l-0 md:border-r-2 border-creo-gold rounded-lg pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                
                <Icon 
                  size={18} 
                  className={`transition-colors relative z-10 ${
                    isActive ? "text-creo-gold" : "text-slate-400 dark:text-slate-500"
                  }`} 
                />
                <span className={`relative z-10 transition-colors ${
                  isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer info or quick help */}
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 text-center">
          <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Creo Engine v1.0
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white dark:bg-creo-dark border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-slate-200 dark:border-white/5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-creo-black cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            
            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-creo-dark border-r border-slate-200 dark:border-white/5 p-6 z-50 md:hidden flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <Logo size="sm" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full py-3 px-4 flex items-center gap-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                          isActive 
                            ? "bg-creo-gold/10 text-creo-gold border-l-2 border-creo-gold" 
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-creo-black"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-creo-gold/10 border border-creo-gold/20 flex items-center justify-center text-creo-gold font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user.email}</div>
                  <button
                    onClick={handleSignOut}
                    className="text-[10px] text-red-500 font-bold tracking-wider hover:underline uppercase"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Navbar / User Profile Area */}
        <header className="hidden md:flex items-center justify-between px-10 py-5 bg-white/40 dark:bg-creo-black backdrop-blur-sm border-b border-slate-200/50 dark:border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              Current View:
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-creo-dark px-2.5 py-1 rounded-md border border-slate-200/30 dark:border-white/5 font-mono">
              {activeTabDetails?.label}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-creo-dark hover:bg-slate-50 dark:hover:bg-creo-black/60 transition-colors focus:outline-none cursor-pointer select-none"
              >
                <div className="h-7 w-7 rounded-lg bg-creo-gold/10 border border-creo-gold/25 flex items-center justify-center text-creo-gold font-bold text-xs uppercase">
                  {user.email?.charAt(0) || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 max-w-[150px] truncate pr-1">
                  {user.email}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    
                    {/* Dropdown Box */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-xl p-2.5 shadow-xl z-20"
                    >
                      <div className="px-3.5 py-2 mb-2 border-b border-slate-100 dark:border-white/5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Signed In As</div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">{user.email}</div>
                      </div>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Log Out of Creo</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full"
            >
              {activeTab === "generator" && <GeneratorView user={user} />}
              {activeTab === "history" && <HistoryView user={user} />}
              {activeTab === "settings" && <SettingsView user={user} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

