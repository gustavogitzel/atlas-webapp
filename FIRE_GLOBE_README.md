# 🔥 Fire Globe Implementation

## Overview

This implementation provides an interactive 3D globe visualization of NASA fire detection data with advanced features including:

- ✅ **React Query** for data caching and state management
- ✅ **Framer Motion** for smooth animations
- ✅ **Atomic Design** pattern (atoms, molecules, organisms)
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Timeline playback** with controls
- ✅ **Advanced filtering** (satellite, confidence, date)
- ✅ **Interactive globe** with tooltips and click details

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` if you need to change the API URL:

```env
VITE_API_URL=https://atlas-api-apy0.onrender.com
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/                    # Basic building blocks
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── StatCard/            # NEW: Statistics card
│   │   └── IconButton/          # NEW: Icon button with animations
│   ├── molecules/                # Composite components
│   │   ├── TimelineControls/    # NEW: Timeline playback controls
│   │   ├── FilterPanel/         # NEW: Filter panel
│   │   └── FireDetailModal/     # NEW: Fire details modal
│   └── organisms/                # Complex components
│       └── FireGlobe/           # NEW: Main globe component
├── hooks/
│   └── useFireData.ts           # NEW: React Query hooks
├── services/
│   └── fireAPI.ts               # NEW: API service layer
├── types/
│   └── fire.ts                  # NEW: TypeScript types
├── providers/
│   └── QueryProvider.tsx        # NEW: React Query provider
└── pages/
    └── FireGlobePage/           # NEW: Fire globe page
```

## 🎯 Key Features

### 1. Data Caching with React Query + SessionStorage Persistence

The implementation uses React Query with sessionStorage persistence for efficient data fetching and caching:

```typescript
// Automatic caching with 5-minute stale time + sessionStorage persistence
const { data, isLoading, isFetching } = useFirePoints({
  maxPoints: 10000,
  minConfidence: 0
});
```

**Benefits:**
- ✅ **SessionStorage Persistence** - Cache survives page refresh
- ✅ **Automatic background refetching** - Updates stale data
- ✅ **Cache invalidation** - Smart cache management
- ✅ **Loading and error states** - Built-in state handling
- ✅ **Optimistic updates** - Instant UI updates
- ✅ **24-hour retention** - Cache persists for 24 hours
- ✅ **Version busting** - Easy cache invalidation via version bump

**How it works:**
1. **First Load**: Fetches from API → Saves to sessionStorage
2. **Page Refresh**: Loads instantly from sessionStorage → Updates in background if stale
3. **New Tab**: Fresh cache (sessionStorage is tab-specific)
4. **Close Tab**: Cache cleared automatically

### 2. Atomic Design Pattern

**Atoms** (Basic components):
- `StatCard` - Statistics display
- `IconButton` - Animated icon buttons

**Molecules** (Composite components):
- `TimelineControls` - Playback controls
- `FilterPanel` - Filter interface
- `FireDetailModal` - Details modal

**Organisms** (Complex components):
- `FireGlobe` - Complete globe visualization

### 3. Timeline Playback

Features:
- Play/Pause animation
- Skip forward/backward
- Adjustable playback speed
- Date range slider
- Current date display

### 4. Advanced Filtering

- **Satellite Filter**: All, Terra, Aqua
- **Confidence Filter**: 0-100% slider
- **Date Filter**: Timeline-based
- **Real-time Updates**: Filters apply immediately

### 5. Interactive Globe

- **Color Coding**: Based on FRP and confidence
  - Red (#ff0000): High confidence + High FRP
  - Orange (#ff3300): High confidence
  - Light Orange (#ff6600): Medium confidence
  - Yellow (#ffaa00): Low confidence

- **Point Altitude**: Based on FRP (Fire Radiative Power)
- **Tooltips**: Hover for quick info
- **Click Details**: Full fire information modal

## 🎨 Customization

### Adjust Globe Appearance

Edit `src/components/organisms/FireGlobe/FireGlobe.tsx`:

```typescript
// Change point colors
pointColor={(d) => {
  const feature = d as FireFeature;
  const conf = feature.properties.confidence;
  const frp = feature.properties.frp;
  
  // Your custom color logic
  if (conf >= 80 && frp > 100) return '#ff0000';
  // ...
}}

// Change point size
pointRadius={0.15} // Adjust size

// Change point altitude
pointAltitude={(d) => {
  const feature = d as FireFeature;
  return Math.min(feature.properties.frp / 300, 0.5);
}}
```

### Modify Cache Duration

Edit `src/providers/QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Change cache duration
      gcTime: 10 * 60 * 1000,   // Change garbage collection time
    },
  },
});

// Adjust sessionStorage persistence
persistOptions={{
  persister: sessionStoragePersistor,
  maxAge: 1000 * 60 * 60 * 24, // Change max age (24 hours)
  buster: 'v2', // Bump version to invalidate all caches
}}
```

### Clear Cache Manually

```typescript
// In browser console
sessionStorage.removeItem('REACT_QUERY_CACHE');
// Then refresh page
```

### Force Cache Invalidation

Change the `buster` version in `QueryProvider.tsx`:
```typescript
buster: 'v2', // Increment to invalidate all existing caches
```

### Customize Animations

Edit animation parameters in components:

```typescript
// In TimelineControls.tsx
<motion.div
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }} // Adjust timing
>
```

## 🔧 API Endpoints Used

| Endpoint | Purpose | Cache Time |
|----------|---------|------------|
| `/csv/fire-points` | Globe visualization data | 5 minutes |
| `/csv/statistics` | Statistics cards | 5 minutes |
| `/csv/fire-details` | Click detail modal | 2 minutes |

## 🎮 Usage Examples

### Basic Usage

```typescript
import { FireGlobe } from '@organisms/FireGlobe';

function App() {
  return <FireGlobe />;
}
```

### With Custom Options

```typescript
<FireGlobe 
  maxPoints={5000}      // Limit points
  minConfidence={50}    // Filter by confidence
/>
```

### Access Fire Data Programmatically

```typescript
import { useFirePoints, useFireStatistics } from '@hooks/useFireData';

function MyComponent() {
  const { data: fires, isLoading } = useFirePoints({ maxPoints: 1000 });
  const { data: stats } = useFireStatistics();
  
  // Use the data
}
```

## 🧪 Testing

The implementation includes proper TypeScript types for testing:

```typescript
import { render } from '@testing-library/react';
import { QueryProvider } from '@/providers/QueryProvider';
import { FireGlobe } from '@organisms/FireGlobe';

test('renders fire globe', () => {
  render(
    <QueryProvider>
      <FireGlobe />
    </QueryProvider>
  );
});
```

## 🚀 Performance

**Optimizations:**
- React Query caching reduces API calls
- Memoized values prevent unnecessary re-renders
- Filtered data updates only when filters change
- Lazy loading of fire details
- Efficient point rendering on globe

**Recommended Limits:**
- Max points: 10,000 (adjustable)
- Min confidence: 70% for better performance
- Playback speed: 500-1000ms for smooth animation

## 📝 Best Practices

1. **Always wrap with QueryProvider**
   ```typescript
   <QueryProvider>
     <FireGlobe />
   </QueryProvider>
   ```

2. **Handle loading states**
   - Built-in loading indicators
   - Cache status indicators

3. **Error boundaries**
   - Add error boundaries for production
   - API errors are handled gracefully

4. **Type safety**
   - All components are fully typed
   - Use provided TypeScript types

## 🐛 Troubleshooting

### API Not Loading

1. Check `.env` file exists with correct API URL
2. Verify API is accessible: `https://atlas-api-apy0.onrender.com/csv/statistics`
3. Check browser console for CORS errors

### Globe Not Rendering

1. Ensure `react-globe.gl` is installed
2. Check WebGL support in browser
3. Verify `three` version compatibility

### Animations Not Working

1. Ensure `framer-motion` is installed
2. Check for CSS conflicts
3. Verify Tailwind CSS is configured

## 📚 Dependencies

```json
{
  "@tanstack/react-query": "^5.90.2",
  "@tanstack/react-query-persist-client": "^5.90.2",
  "framer-motion": "^12.23.22",
  "lucide-react": "^0.544.0",
  "react-globe.gl": "2.24.0",
  "three": "0.152.0"
}
```

**Key Dependencies:**
- **@tanstack/react-query** - Data fetching and caching
- **@tanstack/react-query-persist-client** - SessionStorage persistence
- **framer-motion** - Smooth animations
- **lucide-react** - Icon library
- **react-globe.gl** - 3D globe visualization
- **three** - 3D rendering engine

## 🎯 Next Steps

Potential enhancements:
- [ ] Add heatmap layer
- [ ] Export data to CSV
- [ ] Save/load filter presets
- [ ] Add date range picker
- [ ] Implement search by location
- [ ] Add comparison mode (multiple dates)
- [ ] Mobile responsive controls

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion**
