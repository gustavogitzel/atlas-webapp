import type { Meta, StoryObj } from '@storybook/react';
import { MediaCard } from './MediaCard';

/**
 * MediaCard displays a media item (image/gif) with animation support.
 * 
 * ## Features
 * - Responsive aspect ratio (16:9)
 * - Smooth fade-in animations
 * - Hover scale effect
 * - Lazy loading support
 * - Rounded corners with shadow
 * - Customizable animation delay
 */
const meta = {
  title: 'Atoms/MediaCard',
  component: MediaCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'A media card component for displaying images and GIFs with smooth animations. Perfect for galleries and content showcases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'URL of the media to display',
      table: {
        type: { summary: 'string' },
      },
    },
    alt: {
      control: 'text',
      description: 'Alternative text for accessibility',
      table: {
        type: { summary: 'string' },
      },
    },
    isVisible: {
      control: 'boolean',
      description: 'Controls visibility animation',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    delay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Animation delay in milliseconds',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
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
} satisfies Meta<typeof MediaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default media card with space-themed GIF
 */
export const Default: Story = {
  args: {
    src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2F2dWF1OXE4MHBxOWF1dWx4NXN0Z2RmOWF1bDV0YnB1aXpmaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3978y5HqiEtqupiM/giphy.gif',
    alt: 'Space Adventure',
    isVisible: true,
    delay: 0,
  },
};

/**
 * Media card with 500ms animation delay
 */
export const WithDelay: Story = {
  args: {
    src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHpmM2RqbWN2ZjB1Y2wzOHYyb2VpN2VoOXBhMzF0ZmZ0bG0xdWx6aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xezQGU5xCDxyEi4/giphy.gif',
    alt: 'Earth from Space',
    isVisible: true,
    delay: 500,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card appears after 500ms delay. Useful for staggered grid animations.',
      },
    },
  },
};

/**
 * Hidden state - card is not visible
 */
export const Hidden: Story = {
  args: {
    src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRxY2kydDVpbjRtdXU1bDgxNmxqZm1yc2ZnYzZ5M2Z5OHR6cWRkeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RHIKETUlUINYvV7CAO/giphy.gif',
    alt: 'Satellite View',
    isVisible: false,
    delay: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle the "isVisible" control to see the fade-in animation.',
      },
    },
  },
};

/**
 * Static image instead of GIF
 */
export const StaticImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    alt: 'Earth from Space',
    isVisible: true,
    delay: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'MediaCard also works with static images, not just GIFs.',
      },
    },
  },
};

/**
 * Long animation delay
 */
export const LongDelay: Story = {
  args: {
    src: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRxY2kydDVpbjRtdXU1bDgxNmxqZm1yc2ZnYzZ5M2Z5OHR6cWRkeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RHIKETUlUINYvV7CAO/giphy.gif',
    alt: 'Satellite View',
    isVisible: true,
    delay: 1500,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card appears after 1.5 seconds. Useful for sequential animations.',
      },
    },
  },
};

/**
 * Multiple cards in a responsive grid
 */
export const GridLayout: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl">
        <MediaCard
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2F2dWF1OXE4MHBxOWF1dWx4NXN0Z2RmOWF1bDV0YnB1aXpmaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3978y5HqiEtqupiM/giphy.gif"
          alt="Space 1"
          isVisible={true}
          delay={0}
        />
        <MediaCard
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHpmM2RqbWN2ZjB1Y2wzOHYyb2VpN2VoOXBhMzF0ZmZ0bG0xdWx6aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xezQGU5xCDxyEi4/giphy.gif"
          alt="Space 2"
          isVisible={true}
          delay={200}
        />
        <MediaCard
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzRxY2kydDVpbjRtdXU1bDgxNmxqZm1yc2ZnYzZ5M2Z5OHR6cWRkeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RHIKETUlUINYvV7CAO/giphy.gif"
          alt="Space 3"
          isVisible={true}
          delay={400}
        />
      </div>
    </div>
  ),
  args: {
    src: '',
    alt: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple cards in a responsive grid with staggered animations. Grid adjusts from 1 column (mobile) to 3 columns (desktop).',
      },
    },
  },
};
