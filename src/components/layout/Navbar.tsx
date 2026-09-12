import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  Laptop,
  Volume2,
  VolumeX,
  Menu,
  X,
  Mic,
} from 'lucide-react';

import { supabase } from '../../services/supabaseClient';
import { AuthModal } from '../auth/AuthModal';
import { User as SupabaseUser } from '@supabase/supabase-js';

import { Logo } from '../ui/Logo';

export const Navbar: React.FC = () => {
  const {
    soundEnabled,
    toggleSound,
    isKidsMode,
    selectedAudience,
    setKidsAgeTier,
    switchToKidsMode,
    switchToNormalMode,
  } = useAppState();

  const { themeMode, setThemeMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isFullscreenPractice = location.pathname === '/practice';
  if (isFullscreenPractice) return null;

  const currentAgeTier =
    selectedAudience === 'KIDS_8_10'
      ? '8-10'
      : selectedAudience === 'KIDS_11_13'
      ? '11-13'
      : '5-7';

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5 transition-transform duration-200" /> },
    { mode: 'system', label: 'Auto', icon: <Laptop className="w-3.5 h-3.5 transition-transform duration-200" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 transition-transform duration-200" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo size="md" />
        </div>

        {/* Center: Desktop Navigation & Mode Control */}
        <div className="hidden md:flex items-center gap-6">
          {/* General vs Kids Segmented Mode Switch */}
          <div className="flex items-center p-0.5 rounded-full editorial-subtle text-xs font-bold">
            <button
              onClick={() => {
                if (isKidsMode) {
                  switchToNormalMode();
                  if (location.pathname.startsWith('/kids')) navigate('/');
                }
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                !isKidsMode
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              General
            </button>
            <button
              onClick={() => {
                if (!isKidsMode) {
                  switchToKidsMode('KIDS_5_7');
                  navigate('/kids/age');
                }
              }}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                isKidsMode
                  ? 'bg-[#0d9488] text-white shadow-sm font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>🧒 Kids</span>
            </button>
          </div>

          {/* Kids Age Quick Selector */}
          {isKidsMode && (
            <div className="flex items-center gap-1 p-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-xs font-bold">
              {(['5-7', '8-10', '11-13'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setKidsAgeTier(tier)}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    currentAgeTier === tier
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-amber-700 dark:text-amber-300 hover:text-amber-900'
                  }`}
                >
                  {tier}y
                </button>
              ))}
            </div>
          )}

          {/* Standard Navigation Links */}
          {!isKidsMode && (
            <nav className="flex items-center gap-5 text-xs font-bold text-[var(--text-secondary)]">
              <Link
                to="/spinner"
                className={`transition-colors hover:text-[var(--text-primary)] ${
                  location.pathname === '/spinner' ? 'text-[#0d9488]' : ''
                }`}
              >
                Roulette
              </Link>
              <Link
                to="/challenges"
                className={`transition-colors hover:text-[var(--text-primary)] ${
                  location.pathname === '/challenges' ? 'text-[#0d9488]' : ''
                }`}
              >
                Challenges
              </Link>
              <Link
                to="/progress"
                className={`transition-colors hover:text-[var(--text-primary)] ${
                  location.pathname === '/progress' ? 'text-[#0d9488]' : ''
                }`}
              >
                Progress
              </Link>
            </nav>
          )}
        </div>

        {/* Right: Controls & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Animated Theme Selector (Light / Auto / Dark) */}
          <div className="flex items-center p-0.5 rounded-full editorial-subtle text-xs" title="Theme Mode">
            {themeOptions.map((opt) => (
              <button
                key={opt.mode}
                onClick={(e) => setThemeMode(opt.mode, e)}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  themeMode === opt.mode
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm scale-105'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] opacity-70 hover:opacity-100'
                }`}
                title={`Switch to ${opt.label} Mode`}
              >
                {opt.icon}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              soundEnabled
                ? 'editorial-surface text-[#0d9488] border-[#0d9488]/40'
                : 'border-[var(--border-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* User Auth Profile / Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-[var(--border-primary)]">
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#14b8a6] to-[#2dd4bf] text-white flex items-center justify-center text-xs font-bold font-mono-code uppercase shadow-sm hover:scale-105 transition-transform"
                title="View Speaker Profile"
              >
                {currentUser.user_metadata?.full_name
                  ? currentUser.user_metadata.full_name[0].toUpperCase()
                  : currentUser.email
                  ? currentUser.email[0].toUpperCase()
                  : 'U'}
              </Link>
              <Link
                to="/profile"
                className="text-xs font-mono-code font-bold text-[var(--text-primary)] hover:text-[#14b8a6] transition-colors"
              >
                Profile
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-[#14b8a6] text-xs font-bold font-mono-code transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>🔑 Sign In</span>
            </button>
          )}

          {/* Start Speaking CTA */}
          <button
            onClick={() => navigate('/practice')}
            className="px-4 py-1.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-display font-bold tracking-wide hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>START SPEAKING</span>
          </button>
        </div>

        {/* Mobile Action Controls & Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          {currentUser ? (
            <Link
              to="/profile"
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#14b8a6] to-[#2dd4bf] text-white flex items-center justify-center text-xs font-bold font-mono-code uppercase shadow-sm"
              title="Profile"
            >
              {currentUser.user_metadata?.full_name
                ? currentUser.user_metadata.full_name[0].toUpperCase()
                : 'U'}
            </Link>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-2.5 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-[#14b8a6] text-xs font-bold font-mono-code cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full editorial-subtle text-[var(--text-primary)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-6 space-y-4 animate-in fade-in duration-150">
          {/* Mobile Auth Banner */}
          {!currentUser ? (
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold font-display text-[var(--text-primary)]">
                  Speaker Account
                </div>
                <div className="text-[10px] text-[var(--text-secondary)] font-mono-code">
                  Sync streaks & recordings
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#14b8a6] hover:bg-[#0d7d72] text-white text-xs font-bold font-mono-code shadow-sm"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-primary)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#14b8a6] to-[#2dd4bf] text-white flex items-center justify-center text-xs font-bold font-mono-code">
                  {currentUser.user_metadata?.full_name
                    ? currentUser.user_metadata.full_name[0].toUpperCase()
                    : 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    {currentUser.user_metadata?.full_name || 'Speaker'}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono-code">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono-code text-[#14b8a6] font-bold"
              >
                View &rarr;
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
            <span className="text-xs font-bold text-[var(--text-secondary)]">Mode:</span>
            <div className="flex items-center p-0.5 rounded-full editorial-subtle text-xs font-bold">
              <button
                onClick={() => {
                  switchToNormalMode();
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full ${
                  !isKidsMode ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)]'
                }`}
              >
                General
              </button>
              <button
                onClick={() => {
                  switchToKidsMode('KIDS_5_7');
                  navigate('/kids/age');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full ${
                  isKidsMode ? 'bg-[#0d9488] text-white' : 'text-[var(--text-secondary)]'
                }`}
              >
                Kids
              </button>
            </div>
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-bold text-[var(--text-secondary)]">
            <Link
              to="/spinner"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
            >
              🎲 Prompt Roulette
            </Link>
            <Link
              to="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
            >
              🏆 Daily Challenges
            </Link>
            <Link
              to="/progress"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
            >
              📈 Progress Analytics
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] flex items-center justify-between"
            >
              <span>👤 Speaker Profile</span>
              {currentUser && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono-code">
                  Logged In
                </span>
              )}
            </Link>
          </nav>

          <div className="pt-2 border-t border-[var(--border-primary)] flex items-center justify-between">
            <div className="flex items-center p-0.5 rounded-full editorial-subtle text-xs">
              {themeOptions.map((opt) => (
                <button
                  key={opt.mode}
                  onClick={(e) => {
                    setThemeMode(opt.mode, e);
                  }}
                  className={`p-2 rounded-full ${
                    themeMode === opt.mode
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {opt.icon}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/practice');
              }}
              className="px-5 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-display font-bold"
            >
              START SPEAKING
            </button>
          </div>
        </div>
      )}

      {/* Cloud Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
};
