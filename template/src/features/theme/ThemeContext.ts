import { createContext } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
