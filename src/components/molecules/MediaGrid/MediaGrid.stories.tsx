import type { Meta, StoryObj } from '@storybook/react';
import { MediaGrid } from './MediaGrid';

/**
 * MediaGrid displays a responsive grid of media items with staggered animations.
 * Automatically adjusts from 1 column (mobile) to 3 columns (desktop).
 */
const meta = {
  title: 'Molecules/MediaGrid',
  component: MediaGrid,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Controls visibility of all items',
    },
    baseDelay: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Base delay before first item animates (ms)',
    },
    staggerDelay: {
      control: { type: 'number', min: 0, max: 500, step: 50 },
      description: 'Delay between each item animation (ms)',
    },
  },
} satisfies Meta<typeof MediaGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultMediaItems = [
  {
    src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2F2dWF1OXE4MHBxOWF1dWx4NXN0Z2RmOWF1bDV0YnB1aXpmaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3978y5HqiEtqupiM/giphy.gif',
    alt: 'Space Adventure 1',
  },
  {
    src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHpmM2RqbWN2ZjB1Y2wzOHYyb2VpN2VoOXBhMzF0ZmZ0bG0xdWx6aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xezQGU5xCDxyEi4/giphy.gif',
    alt: 'Space Adventure 2',
  },
  {
    src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRxY2kydDVpbjRtdXU1bDgxNmxqZm1yc2ZnYzZ5M2Z5OHR6cWRkeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RHIKETUlUINYvV7CAO/giphy.gif',
    alt: 'Space Adventure 3',
  },
];

/**
 * Default grid with 3 items
 */
export const Default: Story = {
  args: {
    items: defaultMediaItems,
    isVisible: true,
    baseDelay: 300,
    staggerDelay: 200,
  },
};

/**
 * Grid with faster animations
 */
export const FastAnimation: Story = {
  args: {
    items: defaultMediaItems,
    isVisible: true,
    baseDelay: 0,
    staggerDelay: 100,
  },
};

/**
 * Grid with slower animations
 */
export const SlowAnimation: Story = {
  args: {
    items: defaultMediaItems,
    isVisible: true,
    baseDelay: 500,
    staggerDelay: 400,
  },
};

/**
 * Hidden state
 */
export const Hidden: Story = {
  args: {
    items: defaultMediaItems,
    isVisible: false,
    baseDelay: 300,
    staggerDelay: 200,
  },
};

/**
 * Grid with 6 items
 */
export const SixItems: Story = {
  args: {
    items: [
      ...defaultMediaItems,
      ...defaultMediaItems,
    ],
    isVisible: true,
    baseDelay: 300,
    staggerDelay: 150,
  },
};

/**
 * Single item
 */
export const SingleItem: Story = {
  args: {
    items: [defaultMediaItems[0]],
    isVisible: true,
    baseDelay: 300,
    staggerDelay: 200,
  },
};
