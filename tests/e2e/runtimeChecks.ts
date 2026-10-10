import { test, expect, type Page } from '@playwright/test';
export function installRuntimeChecks() {
  const failures = new WeakMap<Page, string[]>();
  test.beforeEach(async ({ page }) => { const messages: string[] = []; failures.set(page, messages); page.on('pageerror', e => messages.push(e.message)); });
  test.afterEach(async ({ page }) => {
    expect(failures.get(page) ?? [], 'No unhandled application runtime errors').toEqual([]);
    await expect(page.locator('vite-error-overlay')).toHaveCount(0);
    await expect(page.getByText('This view could not load.', { exact: true })).toHaveCount(0);
  });
}
