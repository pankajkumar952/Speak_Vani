import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border-primary)] bg-[var(--bg-surface)] py-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-6">
          <Link to="/spinner" className="hover:text-[var(--text-primary)] transition-colors">
            Spinner
          </Link>
          <Link to="/challenges" className="hover:text-[var(--text-primary)] transition-colors">
            Challenges
          </Link>
          <Link to="/progress" className="hover:text-[var(--text-primary)] transition-colors">
            Progress
          </Link>
          <Link to="/kids/age" className="hover:text-[var(--text-primary)] transition-colors">
            Kids Mode
          </Link>
        </div>

        <p className="font-mono-code text-[11px] text-[var(--text-muted)]">
          © {new Date().getFullYear()} SpeakVaani. Free Speech Practice & AI Analysis.
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="font-mono-code text-[10px] tracking-wide text-[var(--text-muted)]">
          Designed &amp; Developed by{' '}
          <span className="text-[var(--text-accent)] font-semibold">Er. Pankaj Kumar</span>
        </p>
      </div>
    </footer>
  );
};
