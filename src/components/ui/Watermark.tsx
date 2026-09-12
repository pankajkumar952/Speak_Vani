import React from 'react';

/**
 * Persistent, unobtrusive creator watermark shown in the corner on every page.
 */
export const Watermark: React.FC = () => {
  return (
    <div
      className="fixed bottom-3 right-3 z-40 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="pointer-events-auto rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)]/80 backdrop-blur-sm px-3 py-1.5 shadow-sm">
        <p className="font-mono-code text-[10px] sm:text-[11px] tracking-wide text-[var(--text-muted)] whitespace-nowrap">
          Er. Pankaj Kumar
        </p>
      </div>
    </div>
  );
};
