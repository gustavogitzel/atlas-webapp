import React, { useState } from 'react';
import sat from "../../assets/sat.png";

// Data for Terra's five main instruments
const instruments = [
  {
    id: 'MODIS',
    name: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    description: 'MODIS views the entire Earth\'s surface every 1 to 2 days, acquiring data in 36 spectral bands. Its data improves our understanding of global dynamics and processes occurring on the land, in the oceans, and in the lower atmosphere.',
    position: { top: '15%', left: '48%' },
  },
  {
    id: 'ASTER',
    name: 'ASTER (Advanced Spaceborne Thermal Emission and Reflection Radiometer)',
    description: 'A cooperative effort between NASA and Japan, ASTER creates high-resolution maps of land surface temperature, reflectance, and elevation. It is used for monitoring glaciers, volcanoes, and coral reefs.',
    position: { top: '55%', left: '75%' },
  },
  {
    id: 'MISR',
    name: 'MISR (Multi-angle Imaging SpectroRadiometer)',
    description: 'MISR has nine cameras that view Earth at different angles simultaneously. It provides unique data on atmospheric particles (aerosols), cloud properties, and land surface characteristics.',
    position: { top: '70%', left: '40%' },
  },
  {
    id: 'MOPITT',
    name: 'MOPITT (Measurements of Pollution in the Troposphere)',
    description: 'MOPITT measures the distribution and transport of carbon monoxide and methane in the troposphere. This data helps scientists track the sources and movement of air pollution on a global scale.',
    position: { top: '40%', left: '10%' },
  },
  {
    id: 'CERES',
    name: 'CERES (Clouds and the Earth\'s Radiant Energy System)',
    description: 'CERES measures the total reflected solar radiation and emitted thermal radiation from the Earth. It helps scientists understand the planet\'s energy balance, which is crucial for climate studies.',
    position: { top: '25%', left: '70%' },
  },
];

// The main component for the page
export const SatelitePage = () => {
  const [activeInstrument, setActiveInstrument] = useState(null);

  // Function to show the modal with instrument info
  const handleShowModal = (instrument) => {
    setActiveInstrument(instrument);
  };

  // Function to hide the modal
  const handleHideModal = () => {
    setActiveInstrument(null);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col justify-center items-center p-8 text-white font-sans overflow-hidden">
      
      {/* --- Main Title --- */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300">NASA's Terra Satellite</h1>
        <p className="text-lg text-gray-300 mt-2">Hover over the glowing hotspots to learn about the instruments.</p>
      </div>
      
      {/* --- Satellite and Hotspots Container --- */}
      <div className="relative w-full max-w-3xl aspect-video">
        
        {/* Replace this src with the path to your satellite image */}
        
        <img 
          src={sat} 
          alt="Terra Satellite" 
          className="w-full h-full object-contain"
        />

        {/* --- Instrument Hotspots --- */}
        {instruments.map((instrument) => (
          <div
            key={instrument.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: instrument.position.top, left: instrument.position.left }}
            onMouseEnter={() => handleShowModal(instrument)}
            onMouseLeave={handleHideModal}
          >
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-cyan-400/60 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-125">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Modal Window --- */}
      {/* This section will only be visible when an instrument is active */}
      {activeInstrument && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-gray-800 border border-cyan-400/50 rounded-lg shadow-2xl max-w-lg w-full p-6 mx-auto">
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">{activeInstrument.name}</h2>
            <p className="text-gray-200 text-base leading-relaxed">
              {activeInstrument.description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
