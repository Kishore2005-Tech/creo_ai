import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-creo-dark text-slate-600 dark:text-slate-300 hover:text-creo-gold dark:hover:text-creo-gold transition-colors focus:outline-none focus:ring-1 focus:ring-creo-gold/50 cursor-pointer"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
}
