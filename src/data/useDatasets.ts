import { useCallback, useEffect, useState } from 'react';
import { listDatasets } from './database';
import type { Dataset } from './schema';
export function useDatasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]), [error, setError] = useState(''), [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { setLoading(true); try { setDatasets(await listDatasets()); setError(''); } catch { setError('Dataset storage is unavailable. Check browser privacy settings.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]); return { datasets, error, loading, refresh };
}
