import { writeFileSync } from 'node:fs';
import { lessons, levels } from '../src/content/curriculum.ts';
let text = '# Learning Academy inventory\n\n36 original lessons across twelve progressive levels. Each includes meaning, purpose, analogy, worked example, formula/process, visual explanation, editable demonstration, practical exercise, common mistake, research application, knowledge check and an external authoritative reference. Quizzes and bookmarks persist locally; completion requires a correct answer.\n\nThis is a complete introductory survey rather than an exhaustive course on every subtopic. Advanced strategy backtesting, detailed derivatives models and tax computations are documented roadmap items. All numeric company examples are synthetic.\n\n';
for (let i = 0; i < levels.length; i++) {
  text += `## Level ${i + 1} — ${levels[i]}\n\n`;
  for (const l of lessons.filter(l => l.level === i + 1)) text += `- **${l.title}** — [lesson](https://aswinjose-web.github.io/StockTradingRampUp/#/academy/${l.id}); lab: \`${l.tool}\`.\n`;
  text += '\n';
}
text += '## Accuracy conventions\n\nFormulas are tested in tests/engines.test.ts. SIP uses month-end contributions and effective annual-to-monthly conversion. Financial imports use unscaled rupees and share counts. Average-equity ROE and weighted-average EPS conventions are explained; workbench simplifications are explicitly labelled. Indicators use past/current data only, warm-up suppression and documented smoothing. Time-sensitive rates and settlement/contract details are directed to current official sources; reference review date is 10 October 2026.\n';
writeFileSync(new URL('../docs/curriculum.md', import.meta.url), text);
console.log(`Documented ${lessons.length} lessons across ${levels.length} levels.`);
