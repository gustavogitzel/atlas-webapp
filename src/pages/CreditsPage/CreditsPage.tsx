import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { BackgroundMusic } from '@molecules/BackgroundMusic';
import backgroundHome from '../../assets/images/background_home.jpg';
import musicFile from '../../assets/audios/music.mp3';

export const CreditsPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen text-white overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.3)), url(${backgroundHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Music */}
      <BackgroundMusic audioSrc={musicFile} shouldPlay={true} initialVolume={0.2} />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-spartan font-bold mb-4 tracking-wider">🌍 CREDITS & DATA SOURCES</h1>
          <p className="text-xl font-poppins text-blue-200">
            Built with data from NASA's Earth Observing System
          </p>
        </div>

        {/* Data Sources */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <h2 className="text-2xl font-spartan font-bold mb-6 flex items-center gap-2 tracking-wide">
            🛰️ DATA SOURCES
          </h2>
          <div className="space-y-4 text-gray-200 font-poppins">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-white mb-2">NASA GIBS (Global Imagery Browse Services)</h3>
              <p className="text-sm">Satellite imagery and data layers from MODIS, MOPITT and ASTER</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-semibold text-white mb-2">NASA FIRMS (Fire Information for Resource Management System)</h3>
              <p className="text-sm">Near real-time active fire data from MODIS</p>
            </div>
            <div className="border-l-4 border-cyan-500 pl-4 py-2">
              <h3 className="font-semibold text-white mb-2">NASA Worldview</h3>
              <p className="text-sm">Satellite imagery and stories about Earth</p>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
          <h2 className="text-2xl font-spartan font-bold mb-6 flex items-center gap-2 tracking-wide">
            ⚙️ TECHNOLOGIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-200 font-poppins">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-blue-500/50 transition-all">React + TypeScript</div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-blue-500/50 transition-all">Globe.gl</div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-blue-500/50 transition-all">Tailwind CSS</div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-blue-500/50 transition-all">Framer Motion</div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-blue-500/50 transition-all">Vite</div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-blue-500/50 transition-all">React Router</div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
          <h2 className="text-2xl font-spartan font-bold mb-6 flex items-center gap-2 tracking-wide">
            👥 TEAM
          </h2>
          <p className="text-gray-200 font-poppins text-lg mb-6">
            <ul>
              <li>Antônio Hideto Borges Kotsubo - Developer</li>
              <li>Gabriel Freitas Pinheiro - Data Scientist</li>
              <li>Guilherme Leite Bruzão - Data Scientist</li>
              <li>Gustavo Ferreira Gitzel - Developer</li>
              <li>Lucas Gabriel Monteiro da Costa - Developer</li>
              <li>Pietro Grazzioli Golfeto - Project Manager</li>
            </ul>
          </p>
          <p className="text-gray-200 font-poppins text-lg">
            Created for the NASA Space Apps Challenge 2025
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-300 hover:scale-105 font-spartan font-bold tracking-wide shadow-lg hover:shadow-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
            GO BACK
          </button>
          <button
            onClick={() => navigate('/interactive-globe')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl border-2 border-blue-400 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/50 font-spartan font-bold tracking-wide"
          >
            <Globe className="h-5 w-5" />
            EXPLORE INTERACTIVE GLOBE
          </button>
        </div>
      </div>
    </div>
  );
};
