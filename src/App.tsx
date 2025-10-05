import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage/HomePage';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { SatellitePage } from './pages/SatelitePage/SatellitePage';
import { FireGlobePage } from './pages/FireGlobePage';
import { FloodGlobePage } from './pages/FloodGlobePage';
import { BackgroundMusic } from './components/molecules/BackgroundMusic';
import musicFile from './assets/audios/music.mp3';
import {InteractiveGlobePage} from "@pages/InteractiveGlobePage";
import {CreditsPage} from "@pages/CreditsPage";

/**
 * App Component
 * Componente raiz da aplicação com roteamento
 */

function App() {
  const [musicStarted, setMusicStarted] = useState(false);
  const location = useLocation();

  // Auto-start music on other pages
  useEffect(() => {
    if (location.pathname !== '/') {
      setMusicStarted(true);
    }
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage onStartExperience={() => setMusicStarted(true)} />} />
        <Route path="/satellite" element={<SatellitePage />} />
        <Route path="/fire-globe" element={<FireGlobePage />} />
        <Route path="/flood-globe" element={<FloodGlobePage />} />
        <Route path="/interactive-globe" element={<InteractiveGlobePage />} />
        <Route path="/credits" element={<CreditsPage />} />
        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Background Music - Controlled by user */}
      <BackgroundMusic audioSrc={musicFile} shouldPlay={musicStarted} />
    </div>
  );
}

export default App;
