/**
 * PointTooltip Atom Component
 * Generates HTML string for data point tooltip (shadcn/ui style, responsive)
 * Can be used for fire, O2, CO2, and other measurements
 */

export interface PointTooltipData {
  title: string;
  icon: string;
  primaryMetric: { label: string; value: string | number; color?: string };
  secondaryMetric?: { label: string; value: string | number; color?: string };
  tertiaryMetric?: { label: string; value: string | number };
  metadata?: { label: string; value: string; icon?: string }[];
}

export const generatePointTooltip = (data: PointTooltipData): string => {
  const { title, icon, primaryMetric, secondaryMetric, tertiaryMetric, metadata } = data;
  
  const primaryColor = primaryMetric.color || '#fb923c';
  const secondaryColor = secondaryMetric?.color || '#60a5fa';
  
  return `
    <div style="
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(8px);
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-width: 200px;
      max-width: 280px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    ">
      <div style="
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        color: ${primaryColor};
      ">
        <span style="font-size: 16px;">${icon}</span>
        ${title}
      </div>
      
      <div style="
        font-size: 13px;
        line-height: 1.8;
        color: #d1d5db;
      ">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #9ca3af;">${primaryMetric.label}:</span>
          <span style="font-weight: 600; color: ${primaryColor};">${primaryMetric.value}</span>
        </div>
        
        ${secondaryMetric ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #9ca3af;">${secondaryMetric.label}:</span>
          <span style="
            font-weight: 600;
            color: ${secondaryColor};
            padding: 2px 6px;
            border-radius: 4px;
            background: ${secondaryColor}33;
            font-size: 12px;
          ">${secondaryMetric.value}</span>
        </div>
        ` : ''}
        
        ${tertiaryMetric ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #9ca3af;">${tertiaryMetric.label}:</span>
          <span style="font-weight: 500; color: white;">${tertiaryMetric.value}</span>
        </div>
        ` : ''}
        
        ${metadata && metadata.length > 0 ? `
        <div style="
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 12px;
        ">
          ${metadata.map(item => `
            <div style="margin-bottom: 3px;">
              ${item.icon ? `<span style="color: #9ca3af;">${item.icon}</span>` : ''}
              <span style="margin-left: ${item.icon ? '4px' : '0'};">${item.label}: ${item.value}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  `;
};
