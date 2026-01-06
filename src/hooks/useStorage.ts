import { useState, useCallback } from 'react';
import { storageService } from '../services/storage';

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await storageService.getEntries();
      setValue(data as any);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(async (newValue: T) => {
    try {
      setValue(newValue);
      await storageService.saveEntries(newValue as any);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }, []);

  return { value, setValue, load, save, isLoading, error };
}
