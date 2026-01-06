import { useEffect, useCallback } from 'react';
import { audioService } from '../services/audio';

export function useAudio(enabled: boolean = true) {
  useEffect(() => {
    if (enabled) {
      audioService.initialize();
    }
  }, [enabled]);

  const playClick = useCallback(async () => {
    if (enabled) {
      await audioService.playClickSound();
    }
  }, [enabled]);

  const playSuccess = useCallback(async () => {
    if (enabled) {
      await audioService.playSuccessSound();
    }
  }, [enabled]);

  const playError = useCallback(async () => {
    if (enabled) {
      await audioService.playErrorSound();
    }
  }, [enabled]);

  return { playClick, playSuccess, playError };
}
