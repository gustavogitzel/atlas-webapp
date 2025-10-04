import { HomePage } from './pages/HomePage/HomePage';
import { Route, Routes } from 'react-router-dom';
import { SatelitePage } from './pages/SatelitePage/SatelitePage';

/**
 * App Component
 * Componente raiz da aplicação
 */

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/satellite" element={<SatelitePage />} />
      </Routes>
    </div>
  );
}

export default App;
