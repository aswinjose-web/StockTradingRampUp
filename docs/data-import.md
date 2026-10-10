# Local CSV / JSON import

Open Stock Research → Import data. Drop/select CSV (header row) or JSON (array of objects), preview records, choose OHLCV or financial statements, map columns, supply company identifier and source, verify units and synthetic/adjustment labels, validate, then confirm local import. Files are not uploaded. Maximum 10 MB and 50,000 rows (financial schema max 500 statements). Samples in `public/samples` and deployed `samples` are explicitly fictional DemoCo.

## OHLCV

Required fields: `time,open,high,low,close,volume`. Time is a valid `YYYY-MM-DD` daily date; prices are finite positive INR values; volume is a finite nonnegative share count. High must contain open/close/low; low must contain open/close. Duplicate dates are rejected; records are sorted ascending. Blank numeric fields are errors, not zeros. Quoted comma-separated numbers are accepted. Intraday data is not supported in this release.

## Financial statements

Required fields: `period,revenue,netProfit,equity,debt,operatingCashFlow,capex,shares`. Amounts are INR (not crore/lakh-scaled); shares are positive counts. Revenue/debt/capex are nonnegative; profit/equity/OCF can be negative. Period must document annual/quarterly and standalone/consolidated basis (e.g. `FY2024 annual consolidated`). Duplicate period strings are rejected; order is preserved, so provide oldest to newest. Financial statement rows are simplified analyst inputs, not full statutory statements. Source weighted-average shares and attributable earnings where EPS is required.

P/E appears only with a compatible price and an explicitly annual period. Conventional ratios with nonpositive denominators remain unavailable. ROE in this release is labelled return on year-end equity, not average equity. Financial data precision and classifications require user review.

## Provenance and management

Symbol normalises to uppercase and strips NSE/BSE prefix. Exchange is selected separately. Choose the correct exchange if your prefix names one. Every dataset stores provider/source, symbol/exchange, currency/units, latest record/period, import time, synthetic flag and source-declared corporate adjustment flag. It is historical, not an executable quote. Importing does not independently audit data accuracy.

Use the library to reopen, export or explicitly delete datasets. Replacement means import new then delete old. JSON record export is reimportable with source metadata re-entered; it is not a full provenance archive. Workspace backup exports do not include datasets.

## Not yet supported

Standalone shareholding, corporate-action, general ratio, arbitrary research, portfolio CSV and journal CSV schemas are not implemented. Trade/journal backups are supported as part of the versioned workspace JSON; their standalone exports are for inspection. Future schema additions must validate and document units, periods and provenance. Never relabel an unsupported file as prices to make validation pass.
