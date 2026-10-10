import { openDB } from 'idb';
import { datasetSchema, type Dataset } from './schema';
const db = () => openDB('aswin-market-datasets', 1, { upgrade(db) { db.createObjectStore('datasets', { keyPath: 'id' }); } });
export async function listDatasets(): Promise<Dataset[]> { const rows = await (await db()).getAll('datasets'); return rows.flatMap(r => { const result = datasetSchema.safeParse(r); return result.success ? [result.data] : []; }); }
export async function saveDataset(d: Dataset) { await (await db()).put('datasets', datasetSchema.parse(d)); }
export async function deleteDataset(id: string) { await (await db()).delete('datasets', id); }
export async function clearDatasets() { await (await db()).clear('datasets'); }
export function download(name: string, data: unknown, mime = 'application/json') {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type: mime });
  const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
