'use client';

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Custom ThemeProvider wrapper using next-themes.
 * It handles the attribute switching between Catppuccin themes (latte/mocha).
 */
export const ThemeProvider = ({ children }) => {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
      // Mapping standard themes to Catppuccin flavors used in globals.css
      value={{
        light: 'latte',
        dark: 'mocha'
      }}
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
