import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { z } from 'zod';
import { defaults } from '../config/defaults';
import { tradeSchema } from '../engines/portfolio';
export const noteSchema = z.object({ id: z.string(), company: z.string().max(100), thesis: z.string().max(10000), fundamentals: z.string().max(5000), technicals: z.string().max(5000), risks: z.string().max(5000), assumptions: z.string().max(5000), sources: z.string().max(5000), invalidation: z.string().max(5000), date: z.string(), conclusion: z.enum(['Watch', 'Buy thesis', 'Hold thesis', 'Sell thesis']), scenarios: z.string().max(5000) });
export type Note = z.infer<typeof noteSchema>;
export const personalSchema = z.object({
  version: z.literal(1), onboarded: z.boolean(), profile: z.object({ name: z.string().min(1).max(60), level: z.string().max(40), objective: z.string().max(200), path: z.string().max(60) }),
  theme: z.enum(['light', 'dark', 'system']), completed: z.array(z.string()).max(1000), bookmarks: z.array(z.string()).max(1000),
  quiz: z.record(z.number().min(0).max(100)), lastLesson: z.string(), watchlist: z.array(z.string().max(30)).max(500),
  notes: z.array(noteSchema).max(1000), capital: z.number().positive().finite(), trades: z.array(tradeSchema).max(10000),
  checklist: z.record(z.boolean()), widgets: z.boolean(), chartPeriod: z.number().int().min(2).max(200),
});
export type Personal = z.infer<typeof personalSchema>;
export const freshPersonal = (): Personal => ({ version: 1, onboarded: false, profile: { name: 'Aswin', level: defaults.level, objective: 'Learn to research independently', path: defaults.path }, theme: defaults.theme, completed: [], bookmarks: [], quiz: {}, lastLesson: defaults.lesson, watchlist: ['RELIANCE', 'TCS', 'INFY'], notes: [], capital: defaults.capital, trades: [], checklist: {}, widgets: true, chartPeriod: 20 });
export function readPersonal(): Personal {
  try { const parsed = personalSchema.safeParse(JSON.parse(localStorage.getItem('market-lab:personal') ?? 'null')); return parsed.success ? parsed.data : freshPersonal(); }
  catch { return freshPersonal(); }
}
type Store = { state: Personal; setState: React.Dispatch<React.SetStateAction<Personal>>; storageError: string; dark: boolean; token: string; setToken: (token: string) => void };
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readPersonal), [storageError, setError] = useState(''), [token, setToken] = useState('');
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const dark = state.theme === 'dark' || (state.theme === 'system' && systemDark);
  useEffect(() => { const m = window.matchMedia('(prefers-color-scheme: dark)'), listener = () => setSystemDark(m.matches); m.addEventListener('change', listener); return () => m.removeEventListener('change', listener); }, []);
  useEffect(() => { try { localStorage.setItem('market-lab:personal', JSON.stringify(personalSchema.parse(state))); setError(''); } catch { setError('Your browser could not save changes. Export your workspace before closing.'); } }, [state]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  return <Context.Provider value={{ state, setState, storageError, dark, token, setToken }}>{children}</Context.Provider>;
}
export function useStore() { const c = useContext(Context); if (!c) throw new Error('Missing application store'); return c; }
export const scoreQuiz = (answers: number[], correct: number[]) => answers.length === correct.length && correct.length > 0 ? Math.round(answers.filter((a, i) => a === correct[i]).length / correct.length * 100) : 0;
