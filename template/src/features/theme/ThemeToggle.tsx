import { Button } from '@/components/ui/Button';

import { useTheme } from './useTheme';

/** Renders a control that switches between the resolved light and dark themes. */
export function ThemeToggle() {
  const { resolvedTheme, setPreference } = useTheme();
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => setPreference(nextTheme)}
      variant="secondary"
    >
      {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  );
}
