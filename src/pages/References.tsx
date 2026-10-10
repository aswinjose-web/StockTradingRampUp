import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { PageTitle } from '../components/ui';
const references = [
  ['SEBI Investor Education', 'Regulation, financial foundations, fraud awareness and investor protection.', 'https://investor.sebi.gov.in/', 'Education'],
  ['NISM', 'Investor education, learning programmes and securities-market training.', 'https://www.nism.ac.in/', 'Education'],
  ['NSE Investor Centre', 'Exchange guidance, corporate filings, market structure and current circulars.', 'https://www.nseindia.com/static/invest/investors-home', 'Primary source'],
  ['BSE', 'Exchange filings, company announcements and official exchange information.', 'https://www.bseindia.com/', 'Primary source'],
  ['Zerodha Varsity: market foundations', 'Supplemental structured education about market participants and mechanics.', 'https://zerodha.com/varsity/module/introduction-to-stock-markets/', 'Education'],
  ['Zerodha Varsity: fundamentals', 'Supplemental reading about accounting, ratios and valuation.', 'https://zerodha.com/varsity/module/fundamental-analysis/', 'Education'],
  ['Zerodha Varsity: technical analysis', 'Supplemental reading about OHLC, chart indicators and their interpretation.', 'https://zerodha.com/varsity/module/technical-analysis/', 'Education'],
  ['Income Tax Department', 'Current tax guidance and official filing information. Verify the applicable year and facts.', 'https://www.incometax.gov.in/iec/foportal/', 'Current rules'],
  ['NSE derivative contract specifications', 'Current product-specific lot sizes, expiry and settlement specifications.', 'https://www.nseindia.com/static/products-services/equity-derivatives-contract-specifications', 'Current rules'],
  ['Upstox Analytics Token', 'Official read-only token setup, validity and supported categories.', 'https://upstox.com/developer/api-documentation/analytics-token/', 'Integration'],
  ['Upstox Fundamentals', 'Documented company profile and financial-statement endpoints.', 'https://upstox.com/developer/api-documentation/fundamentals/', 'Integration'],
  ['Upstox Rate Limits', 'Official per-user API limits. This app sends manual requests with caching and 429 backoff.', 'https://upstox.com/developer/api-documentation/rate-limiting/', 'Integration'],
  ['TradingView Widgets', 'Official embedded charts, market support and attribution.', 'https://www.tradingview.com/widget-docs/', 'Integration'],
  ['TradingView Lightweight Charts', 'Rendering library documentation and licence attribution.', 'https://tradingview.github.io/lightweight-charts/docs', 'Integration'],
];
export default function References() {
  const [search, setSearch] = useState('');
  return <><PageTitle title="Reference Library" subtitle="Follow an idea back to an authoritative source."/><label className="search">Search references<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Try filings, indicators or tax…"/></label><p className="caption">Reference review date: 10 October 2026. Time-sensitive rules must be checked again when used. References are not extra automated data providers.</p><div className="reference-list">{references.filter(r => r.join(' ').toLowerCase().includes(search.toLowerCase())).map(([title, description, href, category]) => <a key={href} href={href} target="_blank" rel="noreferrer"><span>{category}</span><div><h2>{title}</h2><p>{description}</p></div><ExternalLink size={19}/></a>)}</div></>;
}
