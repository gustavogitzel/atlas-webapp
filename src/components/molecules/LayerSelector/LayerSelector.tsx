import { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { GLOBE_LAYERS, LAYER_CATEGORIES } from '@/config/globeLayers';

/**
 * LayerSelector Molecule Component
 * Allows users to switch between different NASA GIBS imagery layers
 */

export interface LayerSelectorProps {
  selectedLayerId: string;
  onLayerChange: (layerId: string) => void;
  className?: string;
}

export const LayerSelector = ({ 
  selectedLayerId, 
  onLayerChange,
  className = '' 
}: LayerSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedLayer = GLOBE_LAYERS.find(l => l.id === selectedLayerId);

  const getCategoryLayers = (category: string) => {
    return GLOBE_LAYERS.filter(l => l.category === category);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Collapsed State - Show current layer */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="layer-selector-button bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white hover:bg-white/10 transition-colors w-full text-left flex items-center justify-between gap-2"
          title="Change base layer"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-xs font-bold">Base Layer</span>
              <span className="text-[10px] text-white/70">{selectedLayer?.icon} {selectedLayer?.name}</span>
            </div>
          </div>
          <ChevronDown className="h-3 w-3" />
        </button>
      )}

      {/* Expanded State - Show all layers */}
      {isExpanded && (
        <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold">Select Base Layer</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            {Object.entries(LAYER_CATEGORIES).map(([categoryKey, categoryInfo]) => {
              const categoryLayers = getCategoryLayers(categoryKey);
              const isOpen = selectedCategory === categoryKey || selectedCategory === null;

              return (
                <div key={categoryKey} className="border border-white/10 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => setSelectedCategory(isOpen && selectedCategory === categoryKey ? null : categoryKey)}
                    className="w-full p-2 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{categoryInfo.icon}</span>
                      <div>
                        <div className="text-xs font-semibold">{categoryInfo.name}</div>
                        <div className="text-[10px] text-white/60">{categoryInfo.description}</div>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>

                  {/* Category Layers */}
                  {isOpen && (
                    <div className="p-2 space-y-1">
                      {categoryLayers.map((layer) => (
                        <button
                          key={layer.id}
                          onClick={() => {
                            onLayerChange(layer.id);
                            setIsExpanded(false);
                            setSelectedCategory(null);
                          }}
                          className={`w-full p-2 rounded text-left transition-colors ${
                            selectedLayerId === layer.id
                              ? 'bg-blue-500/30 border border-blue-400/50'
                              : 'bg-white/5 hover:bg-white/10 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-sm mt-0.5">{layer.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold flex items-center gap-1">
                                {layer.name}
                                {selectedLayerId === layer.id && (
                                  <span className="text-[8px] bg-blue-500 px-1 py-0.5 rounded">ACTIVE</span>
                                )}
                              </div>
                              <div className="text-[10px] text-white/60 line-clamp-2">{layer.description}</div>
                              <div className="text-[9px] text-white/40 mt-0.5">Resolution: {layer.resolution}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Footer */}
          <div className="mt-3 pt-2 border-t border-white/10 text-[9px] text-white/50 text-center">
            Powered by NASA GIBS • {GLOBE_LAYERS.length} layers available
          </div>
        </div>
      )}
    </div>
  );
};
