import type { ReactNode } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
export function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) { return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>; }
export function Panel({ title, children, subtitle, className = '' }: { title?: string; children: ReactNode; subtitle?: string; className?: string }) { return <section className={`panel ${className}`}>{title && <div className="panel-heading"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>}{children}</section>; }
export function ArrowLink({ to, children }: { to: string; children: ReactNode }) { return <Link className="button primary" to={to}>{children}<ArrowRight size={17}/></Link>; }
export function NumberField({ label, value, onChange, min = 0, max = 1e12, step = 1 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number }) { return <label className="field">{label}<input type="number" value={value} min={min} max={max} step={step} onChange={e => { if (e.target.value === '') { onChange(min); return; } const n = Number(e.target.value); if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n))); }}/></label>; }
export function ResetButton({ onClick }: { onClick: () => void }) { return <button className="button subtle" onClick={onClick}><RotateCcw size={15}/>Reset experiment</button>; }
export function Notice({ children, warning = false }: { children: ReactNode; warning?: boolean }) { return <div className={`notice ${warning ? 'warning' : ''}`}>{children}</div>; }
export function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div>; }
export function Empty({ children }: { children: ReactNode }) { return <div className="empty">{children}</div>; }
