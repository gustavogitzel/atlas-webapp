# CacheIndicator

A loading indicator atom component that displays cache update status.

## Features

- ✅ **Centered Overlay** - Appears in the center of the screen
- ✅ **Animated** - Smooth entry/exit animations with Framer Motion
- ✅ **Responsive** - Adapts to mobile, tablet, and desktop
- ✅ **shadcn/ui** - Uses theme colors (primary)
- ✅ **Customizable** - Configurable title and subtitle
- ✅ **Accessible** - Proper contrast and readable text

## Usage

```tsx
import { CacheIndicator } from '@atoms/CacheIndicator';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <CacheIndicator isVisible={isLoading} />
      {/* Your content */}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | - | Controls visibility of the indicator |
| `title` | `string` | `'Updating Cache'` | Main title text |
| `subtitle` | `string` | `'Fetching latest data...'` | Subtitle text |
| `className` | `string` | - | Additional CSS classes |

## Examples

### Default

```tsx
<CacheIndicator isVisible={true} />
```

### Custom Text

```tsx
<CacheIndicator 
  isVisible={true}
  title="Loading Data"
  subtitle="Please wait..."
/>
```

### With State

```tsx
const { isFetching } = useQuery();

<CacheIndicator isVisible={isFetching} />
```

## Styling

The component uses shadcn/ui theme colors:

- Background: `bg-primary/95`
- Text: `text-primary-foreground`
- Border: `border-primary`
- Icon: Animated pulse effect

## Responsive Behavior

- **Mobile** (`< 768px`): Smaller padding and icon
- **Desktop** (`>= 768px`): Larger padding and icon

## Animation

- **Entry**: Fade in + scale up (0.9 → 1)
- **Exit**: Fade out + scale down (1 → 0.9)
- **Duration**: Smooth transition

## Accessibility

- High contrast text on primary background
- Animated icon for visual feedback
- Centered positioning for visibility
- Non-blocking overlay (z-50)

## Storybook

View all variants in Storybook:

```bash
npm run storybook
```

Navigate to: `Atoms > CacheIndicator`

## Related Components

- **IconButton** - For action buttons
- **InsightCard** - For data display
- **RegionSelector** - For region selection
