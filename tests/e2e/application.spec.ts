import { test, expect } from '@playwright/test';
import path from 'node:path';
import { lessons } from '../../src/content/curriculum';
import { installRuntimeChecks } from './runtimeChecks';
installRuntimeChecks();
const qaDir = process.env.QA_OUTPUT ?? 'C:/Users/aswin/.codex/visualizations/2026/10/09/01a122fc-caa1-7b61-aa15-e60f2e1a3540';
test.beforeEach(async ({ page }) => { await page.goto('./'); });
test('onboarding, personalised dashboard and stored preferences', async ({ page }) => {
  await page.getByRole('button', { name: 'Personalise', exact: true }).click();
  await page.getByLabel('Display name').fill('Aswin QA'); await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Appearance').selectOption('light'); await page.getByRole('button', { name: 'Start exploring' }).click();
  await expect(page.locator('h1')).toContainText('Aswin QA'); await page.reload(); await expect(page.locator('h1')).toContainText('Aswin QA');
  await page.getByRole('link', { name: 'Settings & Integrations', exact: true }).click(); await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveValue('light');
});
test('quiz, completion and bookmark survive deep-route refresh', async ({ page }) => {
  await page.getByRole('link', { name: 'Start lesson', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Introduction to Investing'); await page.getByRole('button', { name: 'Bookmark', exact: true }).click();
  await page.getByRole('radio', { name: lessons[0].options[lessons[0].answer], exact: true }).check();
  await page.getByRole('button', { name: 'Check understanding' }).click(); await expect(page.getByRole('status')).toContainText('Correct');
  await page.getByRole('button', { name: 'Complete lesson', exact: true }).click(); await page.reload();
  await expect(page.getByRole('button', { name: 'Mark as unfinished' })).toBeVisible(); await expect(page.getByRole('button', { name: 'Bookmarked', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open interactive demonstration' }).click(); await page.getByLabel('Principal (INR)').fill('20000'); await expect(page.getByText('Hypothetical ending value')).toBeVisible();
});
test('all 36 lessons render complete teaching sections and knowledge checks', async ({ page }) => {
  for (const l of lessons) { await page.goto(`./#/academy/${l.id}`); await expect(page.locator('h1')).toHaveText(l.title); await expect(page.getByRole('heading', { name: 'Your practical exercise', exact: true })).toBeVisible(); await expect(page.getByRole('radio')).toHaveCount(3); await expect(page.getByRole('heading', { name: 'Connect it to stock research', exact: true })).toBeVisible(); }
});
test('all lab routes render and reset controls respond without runtime errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  const ids = ['compound', 'sip', 'inflation', 'candlestick', 'order-book', 'pe', 'statements', 'ratios', 'moving-average', 'indicators', 'support', 'risk-reward', 'position-sizing', 'allocation', 'comparison', 'checklist', 'drawdown', 'options'];
  for (const id of ids) {
    await page.goto(`./#/labs/${id}`); await expect(page.locator('h1')).toBeVisible();
    await page.getByRole('button', { name: 'Reset experiment', exact: true }).click();
    await expect(page.getByText('This view could not load.')).toHaveCount(0);
    if (['moving-average', 'indicators', 'support'].includes(id)) await expect(page.locator('.price-chart canvas').first()).toBeVisible();
  } expect(errors).toEqual([]);
});
test('order-book fills and calculator updates use real input state', async ({ page }) => {
  await page.goto('./#/labs/order-book'); await page.getByRole('button', { name: 'Simulate order' }).click(); await expect(page.getByRole('status')).toContainText('Average ₹101.33');
  await page.getByLabel('Order type').selectOption('limit'); await page.getByLabel('Maximum buy price (INR)').fill('100'); await page.getByRole('button', { name: 'Simulate order' }).click(); await expect(page.getByRole('status')).toContainText('Unfilled 150');
  await page.goto('./#/labs/compound'); await page.getByLabel('Principal (INR)').fill('10000'); await page.getByLabel('Effective annual return (%)').fill('10'); await page.getByLabel('Years', { exact: true }).fill('2'); await expect(page.locator('.metrics')).toContainText('₹12,100');
});
test('CSV import maps, validates, saves to IndexedDB and reopens after refresh', async ({ page }) => {
  await page.goto('./#/imports'); await page.getByLabel('Choose dataset file').setInputFiles(path.resolve('public/samples/synthetic-ohlcv.csv'));
  await expect(page.getByRole('heading', { name: /File preview/ })).toBeVisible(); await page.getByRole('button', { name: 'Validate mapped records' }).click();
  await expect(page.getByText(/Validated 215 records/)).toBeVisible(); await page.getByRole('button', { name: 'Confirm local import' }).click(); await page.getByRole('link', { name: 'Open imported analysis', exact: true }).click();
  await expect(page.locator('.provenance')).toContainText('DEMOCO'); await expect(page.locator('.price-chart canvas').first()).toBeVisible(); await page.reload(); await expect(page.locator('.provenance')).toContainText('DEMOCO');
  await page.getByRole('link', { name: 'Import data', exact: true }).click(); await expect(page.getByRole('link', { name: 'synthetic-ohlcv', exact: true })).toBeVisible();
});
test('JSON invalid OHLC is rejected without saving', async ({ page }) => {
  await page.goto('./#/imports'); await page.getByLabel('Choose dataset file').setInputFiles({ name: 'synthetic-bad.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify([{ time: '2024-01-01', open: 100, high: 90, low: 80, close: 110, volume: 100 }])) });
  await page.getByRole('button', { name: 'Validate mapped records' }).click(); await expect(page.getByRole('alert')).toContainText('inconsistent'); await expect(page.getByRole('button', { name: 'Confirm local import' })).toHaveCount(0);
});
test('journal saves and edits a transparent research note', async ({ page }) => {
  await page.goto('./#/decision'); await page.getByLabel('Business quality and central thesis').fill('Synthetic research: cash conversion needs investigation.');
  await page.getByLabel('Risks and conflicting evidence').fill('Invented data is not evidence about real companies.'); await page.getByLabel('Conditions that invalidate the thesis', { exact: true }).fill('Deteriorating customer collections.');
  await page.getByRole('button', { name: 'Save research note' }).click(); await expect(page.getByRole('status')).toContainText('saved locally');
  await page.goto('./#/journal'); await page.reload(); await expect(page.getByText('Synthetic research: cash conversion needs investigation.')).toBeVisible();
  await page.getByRole('button', { name: 'Edit note for DEMOCO' }).click(); await expect(page.getByLabel('Conditions that invalidate the thesis', { exact: true })).toHaveValue('Deteriorating customer collections.');
});
test('paper accounting handles buy, sell, fees and insufficient shares', async ({ page }) => {
  await page.goto('./#/portfolio'); await page.getByLabel('Flat transaction cost (%)').fill('0'); await page.getByLabel('Adverse slippage (%)').fill('0');
  await page.getByRole('button', { name: 'Record simulated buy' }).click(); await expect(page.getByRole('status')).toContainText('Simulated buy'); await expect(page.locator('.portfolio-summary')).toContainText('₹99,000');
  await page.getByRole('combobox', { name: 'Action', exact: true }).selectOption('sell'); await page.getByLabel('Scenario price (INR)').fill('120'); await page.getByLabel('Quantity (shares)').fill('5');
  await page.getByRole('button', { name: 'Record simulated sell' }).click(); await expect(page.locator('.portfolio-summary .metric').filter({ has: page.getByText('Realised P/L', { exact: true }) })).toContainText('₹100');
  await page.getByLabel('Quantity (shares)').fill('100'); await page.getByRole('button', { name: 'Record simulated sell' }).click(); await expect(page.getByRole('alert')).toContainText('Cannot sell');
});
test('session tokens are not persisted and encrypted tokens unlock after reload', async ({ page }) => {
  await page.goto('./#/settings'); const token = 'fictional-test-token-never-sent-to-provider';
  await page.getByLabel('Analytics Token', { exact: true }).fill(token); await page.getByRole('button', { name: 'Use for this session' }).click();
  const local = await page.evaluate(() => JSON.stringify(localStorage)); expect(local).not.toContain(token);
  await page.getByLabel('Analytics Token', { exact: true }).fill(token); await page.getByLabel('Persist encrypted across visits').check(); await page.getByLabel('Passphrase (never saved)').fill('a long QA passphrase'); await page.getByRole('button', { name: 'Encrypt and save token' }).click();
  await expect(page.getByRole('status')).toContainText('available in memory'); await page.reload(); await expect(page.getByText('Token locked', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(token); expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('a long QA passphrase');
  await page.getByLabel('Passphrase (never saved)').fill('a long QA passphrase'); await page.getByRole('button', { name: 'Unlock saved token' }).click(); await expect(page.getByRole('status')).toContainText('Unlocked');
  await page.getByRole('button', { name: 'Remove credential', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Credential removed'); expect(await page.evaluate(() => localStorage.getItem('market-lab:vault'))).toBeNull();
});
test('desktop and mobile navigation, dark theme and layout stay usable', async ({ page }) => {
  await page.goto('./#/settings'); await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('light'); await page.getByRole('button', { name: 'Skip personal setup' }).click();
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click(); await expect(page.locator('h1')).toContainText('Aswin');
  await page.screenshot({ path: `${qaDir}/dashboard-desktop.png`, fullPage: true, animations: 'disabled' });
  await page.getByRole('link', { name: 'Interactive Labs', exact: true }).click(); await expect(page.locator('h1')).toHaveText('Interactive Labs'); await page.goBack(); await expect(page.locator('h1')).toContainText('Aswin'); await page.goForward(); await expect(page.locator('h1')).toHaveText('Interactive Labs');
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./#/'); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click(); await page.getByRole('link', { name: 'Settings & Integrations', exact: true }).click(); await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark'); await page.getByRole('button', { name: 'Open navigation' }).click(); await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await expect(page.locator('.sidebar')).not.toHaveClass(/open/); await expect(page.locator('.nav-scrim')).toHaveCount(0);
  await page.screenshot({ path: `${qaDir}/dashboard-mobile-dark.png`, fullPage: true, animations: 'disabled' });
});
