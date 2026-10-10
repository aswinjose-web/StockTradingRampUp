import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { companies } from '../data/synthetic';
import { useStore } from '../state/store';
import { PageTitle, Panel, Notice } from '../components/ui';
export default function Watchlist() {
  const { state, setState } = useStore();
  return <><PageTitle title="Watchlist" subtitle="Businesses you want to understand, without the pressure to act." action={<Link className="button primary" to="/research">Research a company</Link>}/><Notice>Saved company identifiers are reference selections. No live prices or investment recommendations are implied.</Notice><Panel>{state.watchlist.length ? state.watchlist.map(symbol => { const c = companies.find(c => c.symbol === symbol); return <div className="watchlist-row" key={symbol}><Star size={20} className="green"/><div><h2>{c?.name ?? symbol}</h2><p>{symbol} · {c?.sector ?? 'Unclassified'}</p></div><Link className="button" to={`/research?symbol=${symbol}`}>Open research</Link><Link className="button" to={`/decision?company=${symbol}`}>Write thesis</Link><button className="icon-button" aria-label={`Remove ${symbol} from watchlist`} onClick={() => setState(s => ({ ...s, watchlist: s.watchlist.filter(x => x !== symbol) }))}><Trash2 size={17}/></button></div>; }) : <p>No saved companies. Add one in Stock Research.</p>}</Panel></>;
}
