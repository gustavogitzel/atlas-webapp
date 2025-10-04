import type { Meta, StoryObj } from '@storybook/react';
import { CacheIndicator } from './CacheIndicator';

/**
 * CacheIndicator displays a loading state when cache is being updated.
 * 
 * ## Features
 * - Centered overlay with backdrop
 * - Animated entry/exit
 * - Responsive design
 * - shadcn/ui styling
 * - Customizable text
 */
const meta = {
  title: 'Atoms/CacheIndicator',
  component: CacheIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A loading indicator that appears when cache is being updated. Uses primary theme colors for visibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Controls visibility of the indicator',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: 'text',
      description: 'Main title text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Updating Cache' },
      },
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Fetching latest data...' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof CacheIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing the cache indicator
 */
export const Default: Story = {
  args: {
    isVisible: true,
    title: 'Updating Cache',
    subtitle: 'Fetching latest data...',
  },
};

/**
 * Hidden state - indicator is not visible
 */
export const Hidden: Story = {
  args: {
    isVisible: false,
    title: 'Updating Cache',
    subtitle: 'Fetching latest data...',
  },
};

/**
 * Custom text example
 */
export const CustomText: Story = {
  args: {
    isVisible: true,
    title: 'Loading Data',
    subtitle: 'Please wait...',
  },
};

/**
 * Short text example
 */
export const ShortText: Story = {
  args: {
    isVisible: true,
    title: 'Loading',
    subtitle: 'Wait...',
  },
};

/**
 * Long text example to test responsiveness
 */
export const LongText: Story = {
  args: {
    isVisible: true,
    title: 'Updating Cache Database',
    subtitle: 'Fetching latest fire detection data from NASA...',
  },
};

/**
 * Syncing state
 */
export const Syncing: Story = {
  args: {
    isVisible: true,
    title: 'Syncing',
    subtitle: 'Synchronizing with server...',
  },
};

/**
 * Processing state
 */
export const Processing: Story = {
  args: {
    isVisible: true,
    title: 'Processing',
    subtitle: 'Analyzing fire data...',
  },
};

/**
 * Interactive example - toggle visibility
 */
export const Interactive: Story = {
  args: {
    isVisible: true,
    title: 'Updating Cache',
    subtitle: 'Fetching latest data...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle the "isVisible" control to see the animation.',
      },
    },
  },
};

/**
 * Mobile viewport example
 */
export const Mobile: Story = {
  args: {
    isVisible: true,
    title: 'Updating Cache',
    subtitle: 'Fetching latest data...',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet viewport example
 */
export const Tablet: Story = {
  args: {
    isVisible: true,
    title: 'Updating Cache',
    subtitle: 'Fetching latest data...',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
