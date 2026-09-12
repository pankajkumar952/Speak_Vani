import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode, event?: React.MouseEvent | MouseEvent) => void;
  toggleTheme: (event?: React.MouseEvent | MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('speakvaani_theme_mode') as ThemeMode;
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to OS color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: ResolvedTheme =
    themeMode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('speakvaani_theme_mode', themeMode);
  }, [themeMode, resolvedTheme]);

  /**
   * Cinematic Radial Reveal Transition using the View Transitions API
   */
  const setThemeMode = (mode: ThemeMode, event?: React.MouseEvent | MouseEvent) => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsViewTransition = 'startViewTransition' in document;

    const targetResolved: ResolvedTheme =
      mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

    // If reduced motion is preferred or View Transition is unsupported or same theme
    if (isReduced || !supportsViewTransition || targetResolved === resolvedTheme) {
      setThemeModeState(mode);
      return;
    }

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? 40;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore - Document.startViewTransition is standard in modern browsers
    const transition = document.startViewTransition(() => {
      setThemeModeState(mode);
      const root = document.documentElement;
      if (targetResolved === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 380,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const toggleTheme = (event?: React.MouseEvent | MouseEvent) => {
    let nextMode: ThemeMode = 'light';
    if (themeMode === 'light') nextMode = 'dark';
    else if (themeMode === 'dark') nextMode = 'system';
    else nextMode = 'light';

    setThemeMode(nextMode, event);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
