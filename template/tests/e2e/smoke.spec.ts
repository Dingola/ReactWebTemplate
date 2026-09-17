import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('renders the generated application shell', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('button', { name: /switch to dark theme/i })).toBeVisible();

  const accessibilityResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityResults.violations).toEqual([]);
});
