import { useContext } from 'react';

import { ThemeContext } from './ThemeContext';

/**
 * Returns the active theme context.
 *
 * @throws Error when called outside `ThemeProvider`.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }

  return context;
}
