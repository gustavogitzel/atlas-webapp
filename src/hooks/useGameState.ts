import { useState, useEffect, useCallback, useRef } from 'react';
import type { TreePlantingGameState, BrazilRegion } from '@/types/nasa.types';

/**
 * Hook para gerenciar estado do mini-jogo de reflorestamento
 */

interface UseTreePlantingGameOptions {
  region: BrazilRegion;
  targetTrees: number;
  timeLimit: number; // segundos
  onGameEnd?: (state: TreePlantingGameState) => void;
}

interface UseTreePlantingGameReturn {
  gameState: TreePlantingGameState;
  isPlaying: boolean;
  isGameOver: boolean;
  hasWon: boolean;
  plantTree: () => void;
  startGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
}

export const useTreePlantingGame = ({
  region,
  targetTrees,
  timeLimit,
  onGameEnd,
}: UseTreePlantingGameOptions): UseTreePlantingGameReturn => {
  const [gameState, setGameState] = useState<TreePlantingGameState>({
    region,
    treesPlanted: 0,
    targetTrees,
    timeRemaining: timeLimit,
    score: 0,
    carbonOffset: 0,
    areaRestored: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Constantes para cálculos
  const CO2_PER_TREE = 21.77; // kg CO2 por árvore/ano
  const AREA_PER_TREE = 0.01; // hectares por árvore

  // Timer do jogo
  useEffect(() => {
    if (isPlaying && gameState.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1),
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0 && isPlaying) {
      endGame();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, gameState.timeRemaining]);

  // Plantar árvore
  const plantTree = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    setGameState((prev) => {
      const newTreesPlanted = prev.treesPlanted + 1;
      const newScore = prev.score + 10;
      const newCarbonOffset = newTreesPlanted * CO2_PER_TREE;
      const newAreaRestored = newTreesPlanted * AREA_PER_TREE;

      const newState = {
        ...prev,
        treesPlanted: newTreesPlanted,
        score: newScore,
        carbonOffset: newCarbonOffset,
        areaRestored: newAreaRestored,
      };

      // Verifica vitória
      if (newTreesPlanted >= targetTrees) {
        setTimeout(() => endGame(newState), 100);
      }

      return newState;
    });
  }, [isPlaying, isGameOver, targetTrees]);

  // Iniciar jogo
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setGameState((prev) => ({
      ...prev,
      timeRemaining: timeLimit,
    }));
  }, [timeLimit]);

  // Resetar jogo
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(false);
    setGameState({
      region,
      treesPlanted: 0,
      targetTrees,
      timeRemaining: timeLimit,
      score: 0,
      carbonOffset: 0,
      areaRestored: 0,
    });
  }, [region, targetTrees, timeLimit]);

  // Pausar jogo
  const pauseGame = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Finalizar jogo
  const endGame = useCallback(
    (finalState?: TreePlantingGameState) => {
      setIsPlaying(false);
      setIsGameOver(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (onGameEnd) {
        onGameEnd(finalState || gameState);
      }
    },
    [gameState, onGameEnd]
  );

  const hasWon = gameState.treesPlanted >= targetTrees;

  return {
    gameState,
    isPlaying,
    isGameOver,
    hasWon,
    plantTree,
    startGame,
    resetGame,
    pauseGame,
  };
};
