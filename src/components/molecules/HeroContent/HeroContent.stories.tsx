import type { Meta, StoryObj } from '@storybook/react';
import { HeroContent } from './HeroContent';

/**
 * HeroContent displays hero title and subtitle with split text animations.
 * Used for main landing page headers.
 */
const meta = {
  title: 'Molecules/HeroContent',
  component: HeroContent,
  parameters: {
    layout: 'centered',
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
    titleDelay: {
      control: { type: 'number', min: 0, max: 2, step: 0.1 },
      description: 'Title animation delay in seconds',
    },
    subtitleDelay: {
      control: { type: 'number', min: 0, max: 2, step: 0.1 },
      description: 'Subtitle animation delay in seconds',
    },
  },
} satisfies Meta<typeof HeroContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ATLAS hero content
 */
export const Default: Story = {
  args: {
    title: 'A.T.L.A.S.',
    subtitle: "Assessment of Terra's Legacy & Atmospheric Signs",
    titleDelay: 0.2,
    subtitleDelay: 1.2,
  },
};

/**
 * Custom hero content
 */
export const Custom: Story = {
  args: {
    title: 'FIRE GLOBE',
    subtitle: 'Real-time visualization of global fire detection data',
    titleDelay: 0.2,
    subtitleDelay: 1.2,
  },
};

/**
 * Short title and subtitle
 */
export const Short: Story = {
  args: {
    title: 'EXPLORE',
    subtitle: 'Discover Earth from space',
    titleDelay: 0.2,
    subtitleDelay: 1.2,
  },
};

/**
 * No animation delays
 */
export const Instant: Story = {
  args: {
    title: 'INSTANT',
    subtitle: 'No animation delays applied',
    titleDelay: 0,
    subtitleDelay: 0,
  },
};

/**
 * Long content
 */
export const LongContent: Story = {
  args: {
    title: 'EARTH OBSERVATION SYSTEM',
    subtitle: 'A comprehensive platform for monitoring environmental changes, tracking climate patterns, and analyzing satellite data from multiple sources across the globe',
    titleDelay: 0.2,
    subtitleDelay: 1.2,
  },
};
