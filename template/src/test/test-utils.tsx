import type { ReactElement } from 'react';

import { render, type RenderOptions } from '@testing-library/react';

import { ThemeProvider } from '@/app/providers/theme/ThemeProvider';

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}

export * from '@testing-library/react';
