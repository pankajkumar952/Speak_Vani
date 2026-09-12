import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../services/supabaseClient';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  ArrowLeft,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

type AuthView = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const [view, setView] = useState<AuthView>(initialMode === 'signup' ? 'signup' : 'signin');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate password strength score (0 to 4)
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordScore = calculatePasswordStrength(password);
  const strengthLabels = ['Too Short', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-zinc-400 dark:bg-zinc-600',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-emerald-500',
  ];

  const resetFormState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSwitchView = (newView: AuthView) => {
    setView(newView);
    resetFormState();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (view === 'forgot') {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin + '/profile',
        });
        if (error) throw error;
        setSuccessMsg(
          'Password reset link has been sent to your email. Check your inbox.'
        );
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to send password reset email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (view === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (view === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) throw error;

        // Check if user already exists
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setErrorMsg('An account with this email already exists. Switch to Sign In.');
          return;
        }

        if (data.session) {
          setSuccessMsg('Account created successfully! Welcome to SpeakVaani.');
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setSuccessMsg(
            'Account created! A confirmation email has been sent to your inbox.'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
        if (error) throw error;
        setSuccessMsg('Signed in successfully! Welcome back.');
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (msg.toLowerCase().includes('email not confirmed')) {
        msg = 'Your email is not confirmed yet. Please verify your email inbox link.';
      } else if (msg.toLowerCase().includes('invalid login credentials')) {
        msg = 'Incorrect email or password. If you are new, click "Create Account".';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };



  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative m-auto w-full max-w-[880px] rounded-3xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-2xl grid grid-cols-1 md:grid-cols-12 overflow-hidden"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-primary)] transition-all cursor-pointer shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT POSTER / SHOWCASE COLUMN */}
        <div className="relative hidden md:flex md:col-span-5 flex-col justify-between p-7 bg-[#11131a] text-white overflow-hidden border-r border-white/10">
          {/* Ambient Glow Orbs */}
          <div
            className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)' }}
          />

          {/* Top Brand & Highlight */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-mono-code font-bold tracking-wide">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>SPEAKVAANI SPEAKER SUITE</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-display font-black text-white leading-tight">
                Elevate your voice.
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-amber-200 bg-clip-text text-transparent">
                  Master impromptu speech.
                </span>
              </h3>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Connect your account to sync speech history, track pace & filler reduction metrics.
              </p>
            </div>

            {/* Feature Mini Cards */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Live Pace & WPM Tracking</div>
                  <div className="text-[10px] font-mono-code text-zinc-400">Target 130-160 WPM delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Filler Word Detection</div>
                  <div className="text-[10px] font-mono-code text-zinc-400">Track reduction over takes</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Daily Speech Streaks</div>
                  <div className="text-[10px] font-mono-code text-zinc-400">Compete in daily challenges</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-[10px] font-mono-code text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Free Speech Studio</span>
            </div>
            <span>v2.0</span>
          </div>
        </div>

        {/* RIGHT FORM COLUMN */}
        <div className="md:col-span-7 flex flex-col justify-between p-6 sm:p-7 space-y-4 bg-[var(--bg-surface)] text-[var(--text-primary)]">
          {/* Top Segmented Tab Switcher */}
          {view !== 'forgot' ? (
            <div className="flex items-center p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-primary)]">
              <button
                type="button"
                onClick={() => handleSwitchView('signin')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                  view === 'signin'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchView('signup')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                  view === 'signup'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleSwitchView('signin')}
                className="inline-flex items-center gap-1.5 text-xs font-mono-code font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO SIGN IN</span>
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-display font-black text-[var(--text-primary)] tracking-tight">
              {view === 'signin' && 'Welcome Back'}
              {view === 'signup' && 'Create Speaker Profile'}
              {view === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {view === 'signin' && 'Sign in to access your speech analytics and streak.'}
              {view === 'signup' && 'Join confident spontaneous speakers today.'}
              {view === 'forgot' && 'Enter your email to receive recovery instructions.'}
            </p>
          </div>

          {/* Error / Success Feedback Notifications */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2 animate-fade-in leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2 animate-fade-in leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="flex-1">{successMsg}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {/* Full Name (Sign Up only) */}
            {view === 'signup' && (
              <div className="space-y-1">
                <label className="block text-[11px] font-bold font-mono-code text-[var(--text-secondary)]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#14b8a6] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold font-mono-code text-[var(--text-secondary)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#14b8a6] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            {view !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold font-mono-code text-[var(--text-secondary)]">
                    Password
                  </label>
                  {view === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleSwitchView('forgot')}
                      className="text-[10px] font-mono-code text-[#14b8a6] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={view === 'signup' ? 'Create a secure password (min 6 chars)' : 'Password'}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#14b8a6] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Compact Password Strength Meter (Signup only) */}
                {view === 'signup' && password.length > 0 && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="grid grid-cols-4 gap-1 h-1 flex-1 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`h-full transition-all duration-300 ${
                            idx < passwordScore ? strengthColors[passwordScore] : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono-code font-bold text-[var(--text-secondary)] shrink-0">
                      {strengthLabels[passwordScore]}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#14b8a6] hover:bg-[#0d7d72] active:scale-[0.99] text-white font-display font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-teal-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {view === 'signin' && 'Sign In to SpeakVaani'}
                    {view === 'signup' && 'Create Speaker Account'}
                    {view === 'forgot' && 'Send Reset Instructions'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Offline Guest Practice / Toggle */}
          <div className="pt-2 text-center text-xs text-[var(--text-secondary)] border-t border-[var(--border-primary)]">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono-code text-[var(--text-muted)] hover:text-[#14b8a6] transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Practice in Offline / Guest Mode &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
