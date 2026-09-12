import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Award,
  Mic,
  Activity,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Edit3,
} from 'lucide-react';
import { getStoredHistory } from '../utils/historyStorage';
import { RealPracticeAttempt } from '../types';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form profile fields
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [practiceHistory, setPracticeHistory] = useState<RealPracticeAttempt[]>([]);

  useEffect(() => {
    // Load auth user
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      setUser(authUser);
      if (authUser) {
        const meta = authUser.user_metadata || {};
        setFullName(meta.full_name || authUser.email?.split('@')[0] || '');
        setAge(meta.age ? String(meta.age) : '');
        setGender(meta.gender || 'Prefer not to say');
        setPhoneNumber(meta.phone_number || '');
      }
      setLoading(false);
    });

    // Load practice history stats
    const history = getStoredHistory();
    setPracticeHistory(history);
  }, []);

  // Compute speech stats
  const totalAttempts = practiceHistory.length;
  const totalWords = practiceHistory.reduce((acc, h) => acc + (h.wordCount || 0), 0);
  const totalSeconds = practiceHistory.reduce((acc, h) => acc + (h.durationSeconds || 0), 0);
  const avgWpm =
    totalAttempts > 0
      ? Math.round(practiceHistory.reduce((acc, h) => acc + (h.wordsPerMinute || 0), 0) / totalAttempts)
      : 0;
  const avgFillerRate =
    totalAttempts > 0
      ? (
          practiceHistory.reduce((acc, h) => acc + (h.fillerRatePerMinute || 0), 0) / totalAttempts
        ).toFixed(1)
      : '0.0';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedbackMsg(null);

    try {
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: fullName.trim(),
            age: age ? parseInt(age, 10) : undefined,
            gender,
            phone_number: phoneNumber.trim(),
          },
        });
        if (error) throw error;
      }

      setFeedbackMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (fullName) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return fullName.slice(0, 2).toUpperCase();
    }
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return 'ME';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono-code font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-mono-code font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>SIGN OUT</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-xl overflow-hidden">
        {/* Background Ambient Glow */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          {/* Large Avatar Badge */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#14b8a6] to-[#2dd4bf] p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-[22px] bg-[var(--bg-primary)] flex items-center justify-center font-display font-black text-3xl sm:text-4xl text-[#14b8a6]">
              {getInitials()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[var(--bg-primary)] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* User Basic Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
                  {fullName || 'Speaker Account'}
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-mono-code flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>{user?.email || 'Guest User (Offline Profile)'}</span>
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl editorial-surface border border-[var(--border-primary)] hover:border-[#14b8a6] text-xs font-bold text-[var(--text-primary)] hover:text-[#14b8a6] transition-all cursor-pointer shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-xs font-mono-code">
              {age && (
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)]">
                  🎂 {age} yrs
                </span>
              )}
              {gender && gender !== 'Prefer not to say' && (
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)]">
                  👤 {gender}
                </span>
              )}
              {phoneNumber && (
                <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {phoneNumber}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[#14b8a6] font-bold">
                Level 1 Speaker
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-1 text-center">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-[#14b8a6] mx-auto flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
            {totalAttempts}
          </div>
          <div className="text-[10px] sm:text-xs font-mono-code text-[var(--text-secondary)] uppercase">
            Speeches Delivered
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-1 text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
            {totalWords}
          </div>
          <div className="text-[10px] sm:text-xs font-mono-code text-[var(--text-secondary)] uppercase">
            Total Words Spoken
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-1 text-center">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
            {avgWpm}
          </div>
          <div className="text-[10px] sm:text-xs font-mono-code text-[var(--text-secondary)] uppercase">
            Avg WPM (Pace)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-1 text-center">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
            {avgFillerRate}/m
          </div>
          <div className="text-[10px] sm:text-xs font-mono-code text-[var(--text-secondary)] uppercase">
            Filler Rate
          </div>
        </div>
      </div>

      {/* Edit Profile Form (Expanded when isEditing is true) */}
      {isEditing && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-lg space-y-6 animate-fade-in">
          <div className="border-b border-[var(--border-primary)] pb-3">
            <h2 className="text-lg font-display font-black text-[var(--text-primary)]">
              Personal Information & Settings
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono-code">
              Keep your profile details up to date
            </p>
          </div>

          {feedbackMsg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] font-mono-code">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#14b8a6]"
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] font-mono-code">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'Guest User'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] text-sm text-[var(--text-muted)] cursor-not-allowed"
                />
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] font-mono-code">
                  Age
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#14b8a6]"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] font-mono-code">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#14b8a6]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] font-mono-code">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#14b8a6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#14b8a6] hover:bg-[#0d7d72] text-white text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
