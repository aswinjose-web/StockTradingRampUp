import { z } from 'zod';
export const tradeSchema = z.object({ id: z.string(), date: z.string(), symbol: z.string().min(1).max(30), side: z.enum(['buy', 'sell']), quantity: z.number().int().positive(), price: z.number().positive().finite(), costs: z.number().nonnegative().finite(), note: z.string().max(4000), source: z.string().min(1) });
export type Trade = z.infer<typeof tradeSchema>;
export type Holding = { symbol: string; quantity: number; cost: number };
export function portfolio(capital: number, trades: Trade[]) {
  let cash = capital, realized = 0; const holdings: Record<string, Holding> = {};
  for (const t of trades) {
    const h = holdings[t.symbol] ?? { symbol: t.symbol, quantity: 0, cost: 0 };
    if (t.side === 'buy') { const cost = t.quantity * t.price + t.costs; if (cost > cash + 1e-8) throw new Error('Insufficient virtual cash.'); cash -= cost; h.cost += cost; h.quantity += t.quantity; }
    else { if (t.quantity > h.quantity) throw new Error('Cannot sell more shares than held.'); const basis = h.cost / h.quantity * t.quantity, proceeds = t.quantity * t.price - t.costs; cash += proceeds; realized += proceeds - basis; h.cost -= basis; h.quantity -= t.quantity; }
    holdings[t.symbol] = h;
  } return { cash, realized, holdings: Object.values(holdings).filter(h => h.quantity > 0) };
}
