import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';

export const CreditsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">🌍 Credits & Data Sources</h1>
          <p className="text-xl text-gray-300">
            Built with data from NASA's Earth Observing System
          </p>
        </div>

        {/* Data Sources */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🛰️ Data Sources
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">NASA GIBS (Global Imagery Browse Services)</h3>
              <p className="text-sm">Satellite imagery and data layers from MODIS, VIIRS, and other instruments</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">NASA FIRMS (Fire Information for Resource Management System)</h3>
              <p className="text-sm">Near real-time active fire data from MODIS and VIIRS</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">NASA Earth Observatory</h3>
              <p className="text-sm">Satellite imagery and stories about Earth</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">MOPITT (Measurements of Pollution in the Troposphere)</h3>
              <p className="text-sm">Carbon monoxide measurements from Terra satellite</p>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            ⚙️ Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
            <div>React + TypeScript</div>
            <div>Globe.gl</div>
            <div>Tailwind CSS</div>
            <div>Framer Motion</div>
            <div>Vite</div>
            <div>React Router</div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            👥 Team
          </h2>
          <p className="text-gray-300">
            Created for the NASA Space Apps Challenge 2024
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/interactive-globe')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg border border-blue-400 transition-all hover:scale-105 shadow-lg"
          >
            <Globe className="h-5 w-5" />
            Explore Interactive Globe
          </button>
        </div>
      </div>
    </div>
  );
};
