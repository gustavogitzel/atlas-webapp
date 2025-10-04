import { useState, useEffect, useCallback } from 'react';
import { nasaGIBSService } from '@services/nasaGIBS.service';
import type { GIBSLayer, TemporalComparison, APIResponse } from '@/types/nasa.types';

/**
 * Hook para gerenciar imagens da NASA GIBS API
 */

interface UseNASAImageryOptions {
  layer: GIBSLayer;
  date: Date;
  autoLoad?: boolean;
}

interface UseNASAImageryReturn {
  tileUrl: string;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  updateDate: (newDate: Date) => void;
}

export const useNASAImagery = ({
  layer,
  date,
  autoLoad = true,
}: UseNASAImageryOptions): UseNASAImageryReturn => {
  const [tileUrl, setTileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(date);

  const loadImagery = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Valida se a data está disponível
      if (!nasaGIBSService.isDateAvailable(layer, currentDate)) {
        throw new Error('Data não disponível para esta camada');
      }

      // Gera URL do tile
      const url = nasaGIBSService.getTileUrlTemplate(layer, currentDate);
      setTileUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imagem');
    } finally {
      setIsLoading(false);
    }
  }, [layer, currentDate]);

  useEffect(() => {
    if (autoLoad) {
      loadImagery();
    }
  }, [autoLoad, loadImagery]);

  const updateDate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  return {
    tileUrl,
    isLoading,
    error,
    refresh: loadImagery,
    updateDate,
  };
};

// =============================================================================
// HOOK PARA COMPARAÇÃO TEMPORAL
// =============================================================================

interface UseTemporalComparisonOptions {
  layer: GIBSLayer;
  currentDate: Date;
  previousDate: Date;
}

interface UseTemporalComparisonReturn {
  comparison: TemporalComparison | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useTemporalComparison = ({
  layer,
  currentDate,
  previousDate,
}: UseTemporalComparisonOptions): UseTemporalComparisonReturn => {
  const [comparison, setComparison] = useState<TemporalComparison | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadComparison = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: APIResponse<TemporalComparison> =
        await nasaGIBSService.createTemporalComparison(layer, currentDate, previousDate);

      if (response.success && response.data) {
        setComparison(response.data);
      } else {
        throw new Error(response.error?.message || 'Erro ao criar comparação');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [layer, currentDate, previousDate]);

  useEffect(() => {
    loadComparison();
  }, [loadComparison]);

  return {
    comparison,
    isLoading,
    error,
    refresh: loadComparison,
  };
};
