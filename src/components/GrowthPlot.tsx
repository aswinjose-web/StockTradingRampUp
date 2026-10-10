import { money } from '../engines/finance';
export function GrowthPlot({ values, invested, labels, title = 'Hypothetical growth' }: { values: number[]; invested?: number[]; labels?: string[]; title?: string }) {
  const width = 600, height = 220, max = Math.max(1, ...values, ...(invested ?? [])), min = Math.min(0, ...values);
  const x = (i: number) => 65 + i / Math.max(1, values.length - 1) * 510, y = (v: number) => 185 - (v - min) / (max - min) * 160;
  const line = (vs: number[]) => vs.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return <figure className="plot"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}. Ending value ${money(values.at(-1) ?? 0)}`}>
    <title>{title}</title>
    {[0, 1, 2, 3, 4].map(i => { const value = min + (max - min) * i / 4; return <g key={i}><line x1="65" x2="575" y1={y(value)} y2={y(value)} stroke="var(--border)"/><text x="57" y={y(value) + 4} textAnchor="end">{Math.abs(value) >= 100000 ? `${(value / 100000).toFixed(1)}L` : Math.round(value).toLocaleString('en-IN')}</text></g>; })}
    {invested && <polyline points={line(invested)} fill="none" stroke="#97abc6" strokeWidth="2"/>}
    <polygon points={`65,${y(0)} ${line(values)} ${x(values.length - 1)},${y(0)}`} fill="var(--mint)" opacity=".7"/>
    <polyline points={line(values)} fill="none" stroke="var(--green)" strokeWidth="3"/>
    {values.map((v, i) => values.length < 25 ? <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="var(--green)"/> : null)}
    {values.map((_, i) => i % Math.max(1, Math.floor(values.length / 6)) === 0 || i === values.length - 1 ? <text key={i} x={x(i)} y="210" textAnchor="middle">{labels?.[i] ?? i}</text> : null)}
  </svg><figcaption><span className="dot"/> {title}{invested && <><span className="dot blue"/> Contributions</>}</figcaption></figure>;
}
