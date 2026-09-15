import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

import { router } from './router';

/**
 * Composes the application-wide providers and installs the client-side router.
 *
 * Provider order is intentional: the error boundary protects every descendant,
 * while the theme provider makes the active color theme available to all routes.
 */
export function AppProviders() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
