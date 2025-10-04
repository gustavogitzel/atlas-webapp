/**
 * FireGlobe Configuration
 * Centralized configuration for globe animations and appearance
 */

export const FIRE_GLOBE_CONFIG = {
  // Animation settings
  animation: {
    pointTransitionDuration: 1500, // ms - Duration for point transitions
    fadeOutDuration: 1500, // ms - Duration for fade out effect
    showPreviousDay: true, // Show previous day with fade effect
  },

  // Point appearance for current day
  currentDay: {
    radius: 0.15,
    altitudeMultiplier: 1.0,
    opacityMultiplier: 1.0,
  },

  // Point appearance for fade stages (very gradual fade out)
  fadeStages: [
    // Stage 0: Current day (no fade)
    {
      radius: 0.15,
      altitudeMultiplier: 1.0,
      colorDarken: 1.0, // No darkening
    },
    // Stage 1: 1 day ago (very slight fade - almost full visibility)
    {
      radius: 0.14,
      altitudeMultiplier: 0.85, // 85% height (very gentle sinking)
      colorDarken: 0.9, // 10% darker (very subtle)
    },
    // Stage 2: 2 days ago (moderate fade - noticeably fading)
    {
      radius: 0.12,
      altitudeMultiplier: 0.6, // 60% height (sinking)
      colorDarken: 0.7, // 30% darker
    },
    // Stage 3: 3 days ago (heavy fade - almost gone)
    {
      radius: 0.09,
      altitudeMultiplier: 0.3, // 30% height (deep sinking)
      colorDarken: 0.45, // 55% darker
    },
  ],

  // Color thresholds
  colors: {
    critical: { threshold: { confidence: 80, frp: 100 }, color: '#ff0000' },
    high: { threshold: { confidence: 80, frp: 0 }, color: '#ff3300' },
    medium: { threshold: { confidence: 50, frp: 0 }, color: '#ff6600' },
    low: { threshold: { confidence: 0, frp: 0 }, color: '#ffaa00' },
  },
};

/**
 * Get color based on confidence, FRP, and fade stage
 */
export function getPointColor(confidence: number, frp: number, fadeStage: number = 0): string {
  const { colors, fadeStages } = FIRE_GLOBE_CONFIG;

  // Determine base color
  let color = colors.low.color;
  if (confidence >= colors.critical.threshold.confidence && frp > colors.critical.threshold.frp) {
    color = colors.critical.color;
  } else if (confidence >= colors.high.threshold.confidence) {
    color = colors.high.color;
  } else if (confidence >= colors.medium.threshold.confidence) {
    color = colors.medium.color;
  }

  // Apply fade effect based on stage
  if (fadeStage > 0 && fadeStage < fadeStages.length) {
    const stage = fadeStages[fadeStage];
    
    // Darken the color by reducing RGB values
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darkenFactor = stage.colorDarken;
    const newR = Math.floor(r * darkenFactor);
    const newG = Math.floor(g * darkenFactor);
    const newB = Math.floor(b * darkenFactor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  return color;
}

/**
 * Get point altitude based on FRP and fade stage
 */
export function getPointAltitude(frp: number, fadeStage: number = 0): number {
  const { fadeStages } = FIRE_GLOBE_CONFIG;
  const baseAltitude = Math.min(frp / 300, 0.5);

  if (fadeStage >= 0 && fadeStage < fadeStages.length) {
    return baseAltitude * fadeStages[fadeStage].altitudeMultiplier;
  }

  return baseAltitude;
}

/**
 * Get point radius based on fade stage
 */
export function getPointRadius(fadeStage: number = 0): number {
  const { fadeStages } = FIRE_GLOBE_CONFIG;
  
  if (fadeStage >= 0 && fadeStage < fadeStages.length) {
    return fadeStages[fadeStage].radius;
  }

  return fadeStages[0].radius;
}
