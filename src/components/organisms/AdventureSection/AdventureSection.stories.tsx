import type { Meta, StoryObj } from '@storybook/react';
import { AdventureSection } from './AdventureSection';

/**
 * AdventureSection is a complete section with title, description, media grid, and action buttons.
 * Designed for showcasing content with call-to-action buttons.
 */
const meta = {
  title: 'Organisms/AdventureSection',
  component: AdventureSection,
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
      description: 'Section title',
    },
    description: {
      control: 'text',
      description: 'Section description',
    },
    isVisible: {
      control: 'boolean',
      description: 'Controls visibility animations',
    },
    primaryActionLabel: {
      control: 'text',
      description: 'Label for primary action button',
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
} satisfies Meta<typeof AdventureSection>;

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
 * Default adventure section
 */
export const Default: Story = {
  args: {
    title: 'PREPARE TO EXPERIENCE',
    description: 'A journey throughout 25 years of Earth observation',
    mediaItems: defaultMediaItems,
    isVisible: true,
    onScrollToTop: () => alert('Scroll to top!'),
    onPrimaryAction: () => alert('Primary action clicked!'),
    primaryActionLabel: "LET'S GO",
  },
};

/**
 * Fire Globe section
 */
export const FireGlobe: Story = {
  args: {
    title: 'EXPLORE FIRE DATA',
    description: 'Interactive visualization of real-time fire detection from NASA satellites',
    mediaItems: defaultMediaItems,
    isVisible: true,
    onScrollToTop: () => {},
    onPrimaryAction: () => {},
    primaryActionLabel: 'VIEW GLOBE',
  },
};

/**
 * Hidden state
 */
export const Hidden: Story = {
  args: {
    title: 'HIDDEN SECTION',
    description: 'This section is hidden and will animate in when visible',
    mediaItems: defaultMediaItems,
    isVisible: false,
    onScrollToTop: () => {},
    onPrimaryAction: () => {},
    primaryActionLabel: 'START',
  },
};

/**
 * Custom action label
 */
export const CustomAction: Story = {
  args: {
    title: 'DISCOVER MORE',
    description: 'Explore our collection of Earth observation data and satellite imagery',
    mediaItems: defaultMediaItems,
    isVisible: true,
    onScrollToTop: () => {},
    onPrimaryAction: () => {},
    primaryActionLabel: 'EXPLORE NOW',
  },
};

/**
 * Short content
 */
export const ShortContent: Story = {
  args: {
    title: 'EXPLORE',
    description: 'Discover Earth from space',
    mediaItems: defaultMediaItems.slice(0, 2),
    isVisible: true,
    onScrollToTop: () => {},
    onPrimaryAction: () => {},
    primaryActionLabel: 'GO',
  },
};

/**
 * Six media items
 */
export const SixItems: Story = {
  args: {
    title: 'GALLERY',
    description: 'Browse our extensive collection of space imagery',
    mediaItems: [...defaultMediaItems, ...defaultMediaItems],
    isVisible: true,
    onScrollToTop: () => {},
    onPrimaryAction: () => {},
    primaryActionLabel: 'VIEW ALL',
  },
};
