import { test, expect } from '@playwright/test';
import path from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';
import { installRuntimeChecks } from './runtimeChecks';
installRuntimeChecks();
const qaDir = process.env.QA_OUTPUT ?? 'C:/Users/aswin/.codex/visualizations/2026/10/09/01a122fc-caa1-7b61-aa15-e60f2e1a3540';
test('financial import, comparison, source honesty and local chart controls', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('./#/imports'); await page.getByLabel('Choose dataset file').setInputFiles(path.resolve('public/samples/synthetic-fundamentals.csv'));
  await page.getByRole('button', { name: 'Validate mapped records' }).click(); await expect(page.getByText(/Validated 2 records/)).toBeVisible();
  await page.getByRole('button', { name: 'Confirm local import' }).click(); await page.getByRole('link', { name: 'Open imported analysis', exact: true }).click();
  const financialPanel = page.locator('.panel').filter({ has: page.getByRole('heading', { name: 'Fundamentals and financial evidence', exact: true }) });
  await expect(financialPanel.locator('.metrics')).toContainText('₹1,20,00,000'); await expect(financialPanel.locator('.metrics')).toContainText('12.50%');
  await page.goto('./#/compare'); await page.getByRole('combobox', { name: 'Second dataset', exact: true }).selectOption({ label: 'synthetic-fundamentals' }); await expect(page.locator('table')).toContainText('₹1,20,00,000');
  await page.goto('./#/research'); await page.getByRole('button', { name: 'Educational DemoCo', exact: true }).click();
  await expect(page.getByText(/fictional DemoCo, not Reliance Industries/)).toBeVisible(); await expect(page.locator('.price-chart canvas').first()).toBeVisible();
  await page.getByLabel('SMA / EMA period').fill('50'); await page.getByLabel('Indicators', { exact: true }).uncheck(); await expect(page.locator('.price-chart canvas').first()).toBeVisible();
  await page.getByLabel('Indicators', { exact: true }).check(); await page.screenshot({ path: `${qaDir}/research-educational.png`, fullPage: true }); expect(errors).toEqual([]);
});
test('JSON succeeds, workspace backups exclude credentials and malformed backups are rejected', async ({ page }) => {
  await page.goto('./#/imports'); await page.getByLabel('Choose dataset file').setInputFiles(path.resolve('public/samples/synthetic-ohlcv.json'));
  await page.getByRole('button', { name: 'Validate mapped records' }).click(); await expect(page.getByText(/Validated 215 records/)).toBeVisible(); await page.getByRole('button', { name: 'Confirm local import' }).click();
  await page.goto('./#/settings'); await page.getByLabel('Import workspace backup').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"version":99}') }); await expect(page.getByRole('status')).toContainText('Invalid or incompatible');
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export workspace' }).click(); const exported = await event; const p = await exported.path(); expect(p).toBeTruthy();
  const { readFileSync } = await import('node:fs'); const backup = JSON.parse(readFileSync(p!, 'utf8')); expect(backup.version).toBe(1); expect(backup).not.toHaveProperty('token'); expect(backup).not.toHaveProperty('vault'); expect(backup).not.toHaveProperty('datasets');
});
test('external chart failures keep fallback visible', async ({ page }) => {
  await page.route('**/embed-widget/advanced-chart/**', route => route.abort()); await page.goto('./#/research');
  await page.getByRole('button', { name: 'Chart unavailable?', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Rendering failure'); await expect(page.getByRole('link', { name: /View NSE:RELIANCE on TradingView/ })).toBeVisible();
  await page.getByRole('button', { name: 'Educational DemoCo', exact: true }).click(); await expect(page.locator('.price-chart canvas').first()).toBeVisible();
});
test('mobile routes avoid document overflow and expose navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/academy', '/labs', '/research', '/compare', '/decision', '/portfolio', '/watchlist', '/journal', '/references', '/settings', '/imports']) {
    await page.goto(`./#${route}`); await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toBeVisible();
  }
});
test('real TradingView browser visualisation diagnostics for six company BSE fallbacks', async ({ page }) => {
  test.skip(!process.env.CHECK_EXTERNAL_WIDGETS, 'External provider observation is requested separately from deterministic CI.'); test.setTimeout(180000);
  mkdirSync(qaDir, { recursive: true }); const outcomes: Record<string, unknown>[] = [];
  await page.goto('./#/research');
  for (const symbol of ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'ITC']) {
    await page.getByRole('combobox', { name: 'Company', exact: true }).selectOption(symbol);
    let embedded = false, rendered = false, unsupported = false;
    try {
      await expect(page.locator('.widget iframe')).toBeVisible({ timeout: 20000 }); embedded = true;
      await expect(page.locator('.widget iframe')).toHaveAttribute('title', `BSE:${symbol} TradingView chart`);
      await page.locator('.widget').scrollIntoViewIfNeeded();
      const frame = page.frameLocator('.widget iframe');
      await expect(frame.locator('canvas').first()).toBeVisible({ timeout: 20000 }); rendered = true;
      await expect(frame.getByRole('button', { name: 'Symbol search', exact: true })).toContainText(symbol);
      // Observe the final provider state, rather than counting an empty initial canvas.
      await page.waitForTimeout(5000);
      unsupported = await frame.getByRole('button', { name: 'Invalid symbol', exact: true }).count() > 0 || await frame.getByText(/This symbol doesn't exist|This symbol is only available on/i).count() > 0;
    } catch { /* Record the actual provider failure without pretending availability. */ }
    outcomes.push({ requested: `NSE:${symbol}`, widgetSymbol: `BSE:${symbol}`, embedded, rendered, unsupported, observedAt: new Date().toISOString() });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${qaDir}/widget-${symbol}.png`, fullPage: true, animations: 'disabled' });
  }
  writeFileSync(`${qaDir}/widget-diagnostics.json`, JSON.stringify(outcomes, null, 2));
  console.log('External widget observations:', JSON.stringify(outcomes));
  expect(outcomes).toHaveLength(6);
});
