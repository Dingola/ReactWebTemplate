import { createContext } from 'react';

/** Color-theme preference selected by the user. */
export type ThemePreference = 'light' | 'dark' | 'system';

/** Values exposed to components that consume the application theme. */
export type ThemeContextValue = {
  /** Persisted user preference. */
  preference: ThemePreference;
  /** Concrete theme currently applied after resolving the system preference. */
  resolvedTheme: 'light' | 'dark';
  /** Updates and persists the user preference. */
  setPreference: (preference: ThemePreference) => void;
};

/** Internal React context consumed through the `useTheme` hook. */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
