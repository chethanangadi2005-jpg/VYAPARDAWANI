import React, { useState } from 'react';
import { Smartphone, Layout, Sun, Moon, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MobileAppPreview } from '../preview/MobileAppPreview';
import { WebDashboardPreview } from '../preview/WebDashboardPreview';

export type InterfaceMode = 'mobile' | 'web';

interface InterfacePreviewToggleProps {
  initialMode?: InterfaceMode;
  className?: string;
}

export const InterfacePreviewToggle: React.FC<InterfacePreviewToggleProps> = ({
  initialMode = 'mobile',
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<InterfaceMode>(initialMode);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      
      {/* Top Interface & Theme Control Header Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
        
        {/* Left Branding & Mode Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Zap className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
                VyaparDhwani Preview Architecture
              </h2>
              <span className="px-2 py-0.5 text-[9px] font-extrabold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30 rounded-full flex items-center gap-1 font-mono">
                <ShieldCheck className="w-2.5 h-2.5" />
                Capacitor 7 + React 18
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Dual-Interface OS: Switch between Mobile Device Shell & Web Command Center
            </p>
          </div>
        </div>

        {/* Right Controls: Viewport Switcher Tabs + Theme Toggle */}
        <div className="flex items-center space-x-3">
          
          {/* Dual Viewport Mode Selector */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-obsidian-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveMode('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeMode === 'mobile'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App UI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('web')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeMode === 'web'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Web Dashboard UI</span>
            </button>
          </div>

          {/* Stateful Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            onKeyDown={handleKeyDown}
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            className={`relative inline-flex items-center gap-2 p-1.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950 cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700 shadow-md'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:border-slate-400 shadow-sm'
            }`}
          >
            <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
              <Sun
                className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 transform ${
                  isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
                }`}
              />
              <Moon
                className={`w-4 h-4 text-cyan-400 absolute transition-all duration-300 transform ${
                  isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
                }`}
              />
            </div>
            <span className="text-xs font-bold hidden md:inline-block">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content Preview */}
      <div className="w-full flex justify-center">
        {activeMode === 'mobile' ? (
          <MobileAppPreview />
        ) : (
          <WebDashboardPreview />
        )}
      </div>
    </div>
  );
};
