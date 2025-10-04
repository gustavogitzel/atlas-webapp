import { useState } from 'react';
import { TerraGlobe } from '@organisms/TerraGlobe';
import { TreePlantingGame } from '@organisms/TreePlantingGame';
import { InstrumentCard } from '@molecules/InstrumentCard';
import { RegionCard } from '@molecules/RegionCard';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { NASA_CONFIG } from '@config/nasa.config';
import type { BrazilRegion, TerraInstrument } from '@/types/nasa.types';

/**
 * HomePage - Página principal com Tailwind
 * Storytelling: Terra como "médico" examinando a saúde do planeta
 */

type ViewMode = 'story' | 'globe' | 'instruments' | 'regions' | 'game';

export const HomePage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('story');
  const [selectedRegion, setSelectedRegion] = useState<BrazilRegion | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<TerraInstrument | null>(null);

  const instruments = Object.values(NASA_CONFIG.instruments);
  const regions = Object.values(NASA_CONFIG.regions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
            🛰️ Terra Health Monitor
          </h1>
          <p className="text-xl text-white/90">
            25 anos monitorando a saúde do planeta Terra
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 my-8 flex gap-4 flex-wrap justify-center">
        <Button
          variant={viewMode === 'story' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('story')}
        >
          📖 História
        </Button>
        <Button
          variant={viewMode === 'globe' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('globe')}
        >
          🌍 Globo 3D
        </Button>
        <Button
          variant={viewMode === 'instruments' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('instruments')}
        >
          🔬 Instrumentos
        </Button>
        <Button
          variant={viewMode === 'regions' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('regions')}
        >
          📍 Regiões
        </Button>
        <Button
          variant={viewMode === 'game' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('game')}
        >
          🎮 Mini-Jogo
        </Button>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Storytelling */}
        {viewMode === 'story' && (
          <div className="animate-fade-in">
            <Card variant="elevated" padding="lg">
              <div className="text-center mb-12 pb-8 border-b-2 border-gray-200">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                  🩺 Terra: O Médico do Planeta
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Há 25 anos, o satélite Terra da NASA realiza o check-up mais importante
                  da história: examinar a saúde do nosso planeta.
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">🚀 A Missão</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Lançado em 18 de dezembro de 1999, o satélite Terra é como um médico
                    espacial equipado com 5 instrumentos de última geração. Cada um deles
                    examina um aspecto vital da saúde da Terra.
                  </p>
                </section>

                <section>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">🔬 Os Instrumentos Médicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {instruments.slice(0, 3).map((instrument) => (
                      <div
                        key={instrument.id}
                        className="text-center p-6 bg-gray-50 rounded-xl"
                      >
                        <span className="text-5xl block mb-2">{instrument.icon}</span>
                        <strong className="block text-lg text-gray-900 mb-2">
                          {instrument.name}
                        </strong>
                        <p className="text-sm text-gray-600">{instrument.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="primary" onClick={() => setViewMode('instruments')}>
                      Ver Todos os Instrumentos
                    </Button>
                  </div>
                </section>

                <section>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">🇧🇷 O Diagnóstico do Brasil</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Nos últimos 25 anos, o Terra identificou sintomas preocupantes no Brasil:
                    desmatamento na Amazônia, queimadas no Cerrado, enchentes no Rio Grande
                    do Sul e poluição em São Paulo.
                  </p>
                  <Button variant="primary" onClick={() => setViewMode('regions')}>
                    Explorar Regiões Afetadas
                  </Button>
                </section>

                <section>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">💚 O Tratamento: Você Pode Ajudar!</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    Assim como um médico prescreve tratamentos, o Terra nos mostra onde
                    precisamos agir. Participe do mini-jogo de reflorestamento e veja
                    o impacto real de cada árvore plantada!
                  </p>
                  <Button variant="success" onClick={() => setViewMode('game')}>
                    🌱 Começar a Reflorestar
                  </Button>
                </section>
              </div>
            </Card>
          </div>
        )}

        {/* Globo 3D */}
        {viewMode === 'globe' && (
          <div className="animate-fade-in">
            <Card variant="elevated" padding="lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🌍 Visualização Global</h2>
              <p className="text-base text-gray-600 mb-6">
                Explore o planeta Terra em 3D e veja as regiões monitoradas pelo satélite.
                Clique nos pontos para mais informações.
              </p>
              <div className="h-[700px]">
                <TerraGlobe
                  selectedRegion={selectedRegion}
                  onRegionClick={(region) => {
                    setSelectedRegion(region);
                    setViewMode('regions');
                  }}
                  showHealthIndicators
                  autoRotate
                />
              </div>
            </Card>
          </div>
        )}

        {/* Instrumentos */}
        {viewMode === 'instruments' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                🔬 Instrumentos do Satélite Terra
              </h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Conheça os 5 instrumentos científicos que permitem ao Terra examinar
                a saúde do planeta em detalhes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instruments.map((instrument) => (
                <InstrumentCard
                  key={instrument.id}
                  instrument={instrument}
                  isSelected={selectedInstrument === instrument.id}
                  onClick={() => setSelectedInstrument(instrument.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regiões */}
        {viewMode === 'regions' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                📍 Regiões Monitoradas no Brasil
              </h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Explore as principais regiões brasileiras monitoradas pelo Terra e
                entenda os desafios ambientais de cada uma.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regions.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  isSelected={selectedRegion === region.id}
                  onClick={() => setSelectedRegion(region.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mini-Jogo */}
        {viewMode === 'game' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                🎮 Reflorestamento Interativo
              </h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Ajude a restaurar as regiões afetadas! Plante árvores e veja o impacto
                ambiental real de suas ações.
              </p>
            </div>

            {!selectedRegion && (
              <Card variant="elevated" padding="lg">
                <h3 className="text-center text-2xl font-bold text-gray-900 mb-6">
                  Escolha uma região para começar:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {regions.map((region) => (
                    <Button
                      key={region.id}
                      variant="primary"
                      size="lg"
                      onClick={() => setSelectedRegion(region.id)}
                    >
                      {region.name}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {selectedRegion && (
              <div className="space-y-4">
                <TreePlantingGame
                  region={selectedRegion}
                  onComplete={(score) => {
                    console.log('Jogo completo! Pontuação:', score);
                  }}
                />
                <div className="text-center">
                  <Button variant="ghost" onClick={() => setSelectedRegion(null)}>
                    ← Escolher Outra Região
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md px-4 py-8 text-center text-white/80 text-sm">
        <p>
          🛰️ Dados do Satélite Terra da NASA | 
          NASA Space Apps Challenge 2024 | 
          25 Anos Monitorando a Terra
        </p>
      </footer>
    </div>
  );
};
