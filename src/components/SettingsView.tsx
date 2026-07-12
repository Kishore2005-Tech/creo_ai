import React from "react";
import { User as UserIcon, Mail, Shield, Info, LogOut } from "lucide-react";
import { AppUser } from "../types";
import { useAppAuth } from "../context/AuthContext";
import { motion } from "motion/react";

interface SettingsViewProps {
  user: AppUser;
}

export default function SettingsView({ user }: SettingsViewProps) {
  const { signOut } = useAppAuth();

  const handleSignOut = () => {
    signOut().catch(err => console.error("Signout error:", err));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative min-h-[500px]">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-sans">
          Manage your account profile and check configuration statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
              <UserIcon size={18} className="text-creo-gold" />
              Account Profile
            </h2>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <div className="h-10 w-10 rounded-full bg-creo-gold/10 border border-creo-gold/20 flex items-center justify-center text-creo-gold">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 dark:text-slate-500">EMAIL ADDRESS</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 break-all">
                    {user.email || "No email available"}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <div className="h-10 w-10 rounded-full bg-creo-gold/10 border border-creo-gold/20 flex items-center justify-center text-creo-gold">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 dark:text-slate-500">ACCOUNT STATUS</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Active &bull; Fully Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                className="px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 text-sm font-semibold cursor-pointer"
              >
                <LogOut size={16} />
                <span>Log Out of Creo</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-creo-dark border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Info size={16} className="text-creo-gold" />
              Creo Engine Info
            </h2>
            <div className="space-y-3.5 text-xs font-mono text-slate-400 dark:text-slate-500 leading-relaxed">
              <div>
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Model:</span> gemini-3.5-flash
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Data Center:</span> Server-Side Proxy
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Storage:</span> Secure LocalStorage
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Workspace:</span> Cloud Sandbox
              </div>
              <p className="font-sans leading-relaxed text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                Creo uses the official Google GenAI SDK coupled with secure Server-Sent Events (SSE) to deliver near-zero latency text compositions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Large beautiful subtle watermark Logo in the bottom-right corner */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] select-none translate-x-4 translate-y-4">
        <div className="h-64 w-64 rounded-[40px] bg-creo-gold border-[15px] border-creo-gold flex items-center justify-center text-creo-gold font-bold font-display text-[150px] font-extrabold leading-none">
          C
        </div>
      </div>
    </div>
  );
}
