import { Card } from '@atoms/Card';

/**
 * HomePage - Página principal com Tailwind
 * Storytelling: Terra como "médico" examinando a saúde do planeta
 */

export const HomePage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
            ATLAS
          </h1>
          <p className="text-xl text-white/90">
            Assessment of Terra's Legacy & Atmospheric Signs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
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
              </div>
            </Card>
          </div>ß
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
