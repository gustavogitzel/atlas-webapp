import { HomePage } from './pages/HomePage/HomePage';
import { Route, Routes } from 'react-router-dom';
import { SatellitePage } from './pages/SatelitePage/SatellitePage';
import { FireGlobePage } from './pages/FireGlobePage';

/**
 * App Component
 * Componente raiz da aplicação
 */

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/satellite" element={<SatellitePage />} />
        <Route path="/fire-globe" element={<FireGlobePage />} />
      </Routes>
    </div>
  );
}

export default App;
