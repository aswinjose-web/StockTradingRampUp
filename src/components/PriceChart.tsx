import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries, ColorType, type Time } from 'lightweight-charts';
import { sma, ema, rsi, macd, bollinger, type Value } from '../engines/indicators';
import type { Candle } from '../data/schema';
import { useStore } from '../state/store';
export default function PriceChart({ candles, period = 20, indicators = true, support, resistance, volume = true, height = 420 }: { candles: Candle[]; period?: number; indicators?: boolean; support?: number; resistance?: number; volume?: boolean; height?: number }) {
  const ref = useRef<HTMLDivElement>(null), { dark } = useStore(), [error, setError] = useState('');
  useEffect(() => {
    if (!ref.current) return; const node = ref.current;
    let chart: ReturnType<typeof createChart> | undefined;
    try {
      setError('');
      chart = createChart(node, { autoSize: true, height, layout: { background: { type: ColorType.Solid, color: dark ? '#142321' : '#ffffff' }, textColor: dark ? '#b8ccc5' : '#667085', attributionLogo: true }, grid: { vertLines: { color: dark ? '#243b35' : '#f1f4f6' }, horzLines: { color: dark ? '#243b35' : '#f1f4f6' } }, rightPriceScale: { borderColor: dark ? '#314b43' : '#e6ebee' }, timeScale: { borderColor: dark ? '#314b43' : '#e6ebee' } });
      const c = chart.addSeries(CandlestickSeries, { upColor: '#198363', downColor: '#c85959', borderVisible: false, wickUpColor: '#198363', wickDownColor: '#c85959' });
      c.setData(candles.map(v => ({ ...v, time: v.time as Time })));
      if (support !== undefined) c.createPriceLine({ price: support, color: '#d09d3a', lineWidth: 2, title: 'Support hypothesis' });
      if (resistance !== undefined) c.createPriceLine({ price: resistance, color: '#c85959', lineWidth: 2, title: 'Resistance hypothesis' });
      if (volume) { const v = chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' } }, 1); v.setData(candles.map(c => ({ time: c.time as Time, value: c.volume, color: c.close >= c.open ? '#19836366' : '#c8595966' }))); }
      const closes = candles.map(c => c.close);
      if (indicators) {
        const line = (vs: Value[], color: string, pane = 0, title = '') => { const s = chart!.addSeries(LineSeries, { color, lineWidth: 1, title, priceLineVisible: false, lastValueVisible: false }, pane); s.setData(vs.flatMap((v, i) => v === null ? [] : [{ time: candles[i].time as Time, value: v }])); };
        line(sma(closes, period), '#d09d3a', 0, `SMA ${period}`); line(ema(closes, period), '#567cb5', 0, `EMA ${period}`);
        line(sma(closes, 50), '#9174b5', 0, 'SMA 50'); line(sma(closes, 200), '#d5729a', 0, 'SMA 200');
        const bands = bollinger(closes); line(bands.upper, '#97aaa4'); line(bands.lower, '#97aaa4');
        const rsiPane = volume ? 2 : 1; line(rsi(closes), '#9174b5', rsiPane, 'RSI 14');
        const m = macd(closes); line(m.line, '#198363', rsiPane + 1, 'MACD'); line(m.signal, '#d09d3a', rsiPane + 1, 'Signal');
      }
      const panes = chart.panes(); panes.forEach((p, i) => p.setHeight(i === 0 ? Math.max(180, height - (panes.length - 1) * 75) : 75));
      chart.timeScale().fitContent();
    } catch { setError('Chart could not render. Check data, reload, or choose another dataset.'); }
    return () => chart?.remove();
  }, [candles, period, indicators, support, resistance, dark, height, volume]);
  return <div>{error ? <p role="alert" className="notice warning">{error}</p> : null}<div ref={ref} className="price-chart" style={{ height }} aria-label="Interactive candlestick chart with price and indicator panes"/><p className="caption">Drag to pan · scroll to zoom · {candles.length} valid daily candles · Indicator panes share the time axis. <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer">TradingView Lightweight Charts™</a> · Copyright (с) 2025 TradingView, Inc.</p></div>;
}
