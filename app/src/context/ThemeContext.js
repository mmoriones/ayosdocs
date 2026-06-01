'use client';

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

/**
 * Custom ThemeProvider wrapper using next-themes.
 */
export const ThemeProvider = ({ children }) => {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="light"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
};

/**
 * Custom hook to maintain compatibility with existing codebase
 * while leveraging next-themes power.
 */
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return { 
    theme: resolvedTheme || theme, // Fallback to theme if resolved isn't ready
    setTheme, 
    toggleTheme,
    actualTheme: theme // 'light', 'dark', or 'system'
  };
};
