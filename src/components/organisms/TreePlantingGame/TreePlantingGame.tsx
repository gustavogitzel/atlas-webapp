import { useEffect } from 'react';
import { Card } from '@atoms/Card';
import { Button } from '@atoms/Button';
import { Badge } from '@atoms/Badge';
import { useTreePlantingGame } from '@hooks/useGameState';
import type { BrazilRegion } from '@/types/nasa.types';

/**
 * TreePlantingGame Organism Component
 * Mini-jogo de reflorestamento interativo com Tailwind
 */

export interface TreePlantingGameProps {
  region: BrazilRegion;
  onComplete?: (score: number) => void;
}

export const TreePlantingGame = ({ region, onComplete }: TreePlantingGameProps) => {
  const targetTrees = getTargetByRegion(region);
  const timeLimit = 60;

  const {
    gameState,
    isPlaying,
    isGameOver,
    hasWon,
    plantTree,
    startGame,
    resetGame,
  } = useTreePlantingGame({
    region,
    targetTrees,
    timeLimit,
    onGameEnd: (state) => {
      if (onComplete) {
        onComplete(state.score);
      }
    },
  });

  // Atalho de teclado (ESPAÇO)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPlaying && !isGameOver) {
        e.preventDefault();
        plantTree();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isGameOver, plantTree]);

  const progress = (gameState.treesPlanted / gameState.targetTrees) * 100;

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          🌳 Reflorestamento - {getRegionName(region)}
        </h2>
        <Badge variant={isPlaying ? 'success' : 'neutral'}>
          {isPlaying ? 'Jogando' : isGameOver ? 'Finalizado' : 'Aguardando'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Árvores Plantadas
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {gameState.treesPlanted} / {gameState.targetTrees}
          </span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Tempo Restante
          </span>
          <span className="text-2xl font-bold text-red-500 font-mono">
            {formatTime(gameState.timeRemaining)}
          </span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Pontuação
          </span>
          <span className="text-2xl font-bold text-gray-900">{gameState.score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${progress}%`,
            background: progress === 100 ? '#10b981' : '#3b82f6',
          }}
        />
      </div>

      {/* Game Area */}
      <div className="min-h-[300px] flex flex-col justify-center">
        {/* Start Screen */}
        {!isPlaying && !isGameOver && (
          <div className="text-center space-y-4">
            <p className="text-base text-gray-600 leading-relaxed">
              🎯 <strong>Objetivo:</strong> Plante {targetTrees} árvores em {timeLimit} segundos!
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              💡 <strong>Como jogar:</strong> Clique no botão ou pressione ESPAÇO para plantar
            </p>
            <Button variant="success" size="lg" onClick={startGame}>
              Iniciar Jogo
            </Button>
          </div>
        )}

        {/* Playing */}
        {isPlaying && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: gameState.targetTrees }).map((_, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center text-3xl rounded-lg transition-all ${
                    index < gameState.treesPlanted
                      ? 'bg-green-100 animate-fade-in'
                      : 'bg-gray-100'
                  }`}
                >
                  {index < gameState.treesPlanted ? '🌳' : '🟫'}
                </div>
              ))}
            </div>

            <Button
              variant="success"
              size="lg"
              fullWidth
              onClick={plantTree}
              className="animate-pulse-slow"
            >
              🌱 Plantar Árvore (ESPAÇO)
            </Button>
          </div>
        )}

        {/* Game Over */}
        {isGameOver && (
          <div className="text-center space-y-6">
            <div>
              <span className="text-6xl block mb-4">{hasWon ? '🎉' : '😢'}</span>
              <h3
                className={`text-3xl font-bold mb-2 ${
                  hasWon ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {hasWon ? 'Parabéns!' : 'Tempo Esgotado!'}
              </h3>
              <p className="text-base text-gray-600">
                {hasWon
                  ? 'Você reflorestou a região com sucesso!'
                  : `Você plantou ${gameState.treesPlanted} de ${gameState.targetTrees} árvores.`}
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h4 className="text-base font-semibold text-green-800 mb-4 text-center">
                Impacto Ambiental:
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <div className="text-xl font-bold text-green-800">
                      {gameState.carbonOffset.toFixed(1)} kg
                    </div>
                    <div className="text-xs text-gray-600">CO₂ Compensado/ano</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <span className="text-3xl">📏</span>
                  <div>
                    <div className="text-xl font-bold text-green-800">
                      {gameState.areaRestored.toFixed(2)} ha
                    </div>
                    <div className="text-xs text-gray-600">Área Restaurada</div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={resetGame}>
              Jogar Novamente
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// Helper Functions
function getTargetByRegion(region: BrazilRegion): number {
  const targets = {
    'amazonia': 15,
    'cerrado': 12,
    'rio-grande-sul': 10,
    'sao-paulo': 10,
  };
  return targets[region] || 10;
}

function getRegionName(region: BrazilRegion): string {
  const names = {
    'amazonia': 'Amazônia',
    'cerrado': 'Cerrado',
    'rio-grande-sul': 'Rio Grande do Sul',
    'sao-paulo': 'São Paulo',
  };
  return names[region] || region;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
