import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection';

/**
 * HeroSection is a complete hero section with title, subtitle, and scroll button.
 * Designed for landing page hero areas with full-screen height.
 */
const meta = {
  title: 'Organisms/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main hero title',
    },
    subtitle: {
      control: 'text',
      description: 'Hero subtitle/description',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        backgroundImage: 'linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.3)), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ATLAS hero section
 */
export const Default: Story = {
  args: {
    title: 'A.T.L.A.S.',
    subtitle: "Assessment of Terra's Legacy & Atmospheric Signs",
    onScrollClick: () => alert('Scroll clicked!'),
  },
};

/**
 * Fire Globe hero section
 */
export const FireGlobe: Story = {
  args: {
    title: 'FIRE GLOBE',
    subtitle: 'Real-time visualization of global fire detection data from NASA satellites',
    onScrollClick: () => alert('Scroll to content'),
  },
};

/**
 * Short content
 */
export const Short: Story = {
  args: {
    title: 'EXPLORE',
    subtitle: 'Discover Earth from space',
    onScrollClick: () => {},
  },
};

/**
 * Long content
 */
export const LongContent: Story = {
  args: {
    title: 'EARTH OBSERVATION',
    subtitle: 'A comprehensive platform for monitoring environmental changes, tracking climate patterns, and analyzing satellite data from multiple sources across the globe',
    onScrollClick: () => {},
  },
};

/**
 * Custom styling
 */
export const CustomStyle: Story = {
  args: {
    title: 'MISSION CONTROL',
    subtitle: 'Monitor and analyze Earth observation data in real-time',
    onScrollClick: () => {},
    className: 'custom-hero',
  },
};
