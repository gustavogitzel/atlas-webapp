import { HomePage } from './pages/HomePage/HomePage';
import { Route, Routes, Navigate } from 'react-router-dom';
import { SatellitePage } from './pages/SatelitePage/SatellitePage';
import { FireGlobePage } from './pages/FireGlobePage';
import { FloodGlobePage } from './pages/FloodGlobePage';

/**
 * App Component
 * Componente raiz da aplicação com roteamento
 */

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/satellite" element={<SatellitePage />} />
        <Route path="/fire-globe" element={<FireGlobePage />} />
        <Route path="/flood-globe" element={<FloodGlobePage />} />
        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
