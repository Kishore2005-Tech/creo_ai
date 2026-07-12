import React from "react";
import { motion } from "motion/react";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ showText = true, size = "md" }: LogoProps) {
  const badgeSize = size === "sm" ? "h-7 w-7 text-sm" : size === "lg" ? "h-14 w-14 text-2xl" : "h-10 w-10 text-lg";
  const textClass = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";

  return (
    <div className="flex items-center gap-3 select-none">
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={`${badgeSize} flex items-center justify-center rounded-xl bg-creo-black border border-creo-gold/30 text-creo-gold font-bold font-display cursor-pointer relative overflow-hidden`}
        style={{
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <span className="relative z-10 font-extrabold tracking-tighter">C</span>
        {/* Subtle geometric lines inside badge */}
        <div className="absolute inset-0 bg-gradient-to-br from-creo-gold/5 via-transparent to-transparent opacity-50" />
      </motion.div>
      {showText && (
        <span className={`${textClass} font-display font-extrabold tracking-tight text-slate-800 dark:text-white transition-colors duration-200 flex items-baseline gap-1`}>
          <span>Creo<span className="text-creo-gold">.ai</span></span>
          <span className="font-sans text-slate-400 dark:text-slate-500 font-medium text-xs tracking-normal uppercase">Studio</span>
        </span>
      )}
    </div>
  );
}
