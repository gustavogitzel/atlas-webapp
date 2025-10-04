import React, { useState, useRef } from 'react';
import sat from "../../assets/sat.png";
import Sat from "../../components/sat/Sat";
import './SatelitePage.css';

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
  const [activeInstrument, setActiveInstrument] = useState<any>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const hotspotCenter = useRef<{ x: number; y: number } | null>(null);

  const FOLLOW_RADIUS = 220; // px

  const handleShowModal = (instrument: any, e?: React.MouseEvent) => {
    setActiveInstrument(instrument);
    
    if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      hotspotCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  const computeModalPos = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const modalW = 480;
    const modalH = 180;

    // base centered position
    const centerLeft = Math.max((vw - modalW) / 2, 12);
    const centerTop = Math.max((vh - modalH) / 2, 12);

    if (activeInstrument && hotspotCenter.current) {
      const dx = mouse.x - hotspotCenter.current.x;
      const dy = mouse.y - hotspotCenter.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // only follow if mouse is reasonably close to the hotspot
      if (dist <= FOLLOW_RADIUS) {
        const MAX_OFFSET = 10; // px maximum shift from center
        // proportional scale based on distance (closer -> smaller proportion but still limited)
        const t = Math.min(dist / FOLLOW_RADIUS, 1);
        const scale = t * MAX_OFFSET;
        // direction from hotspot to mouse
        const nx = dist === 0 ? 0 : dx / dist;
        const ny = dist === 0 ? 0 : dy / dist;
        const ox = nx * scale;
        const oy = ny * scale;

        const left = Math.min(Math.max(centerLeft + ox, 12), vw - modalW - 12);
        const top = Math.min(Math.max(centerTop + oy, 12), vh - modalH - 12);
        return { left, top };
      }
    }

    return { left: centerLeft, top: centerTop };
  };

  const modalPos = activeInstrument ? computeModalPos() : null;

  return (
    <div className="satelite-page" onMouseMove={handleMouseMove}>
      <div className="page-title">
        <h1>NASA's Terra Satellite</h1>
        <p>Click the glowing hotspots to learn about the instruments.</p>
      </div>

      <div className="sat-wrapper">
        <div className="sat-area">
          <img src={sat} alt="Terra Satellite" className="satelite-image" />

          {instruments.map((instrument) => (
            <div
              key={instrument.id}
              className="hotspot"
              style={{ top: instrument.position.top, left: instrument.position.left }}
              onClick={(e) => handleShowModal(instrument, e)}
            >
              <div className="hotspot-dot">
                <div className="hotspot-core" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeInstrument && (
        <div className="overlay" onClick={() => { setActiveInstrument(null); }}>
          <div
            className="modal-card"
            style={{ left: modalPos?.left, top: modalPos?.top }}
            onMouseEnter={() => {/* keep modal open while hovering */}}
            onMouseLeave={() => {/* nothing - modal stays until closed */}}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">{activeInstrument.name}</h2>
            <p className="modal-body">{activeInstrument.description}</p>
          </div>
        </div>
      )}

      <div className="sat-widget">
        <Sat text="Select a bubble and explore TERRA's instruments!" avatarSize={150} />
      </div>
    </div>
  );
};
