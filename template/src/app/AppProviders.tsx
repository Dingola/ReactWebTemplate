import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

import { router } from './router';

export function AppProviders() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
