import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from './ActionButton';
import { ChevronUp, ArrowRight, Rocket, Globe } from 'lucide-react';

/**
 * ActionButton is a reusable button with glassmorphism design.
 * 
 * ## Features
 * - Glassmorphism design with backdrop blur
 * - Two variants: primary (with text) and icon (icon only)
 * - Customizable icon position
 * - Smooth animations and transitions
 * - Responsive sizing
 * - Hover effects
 */
const meta = {
  title: 'Atoms/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'A reusable button component with glassmorphism design. Supports primary and icon-only variants with smooth animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'icon'],
      description: 'Button style variant',
      table: {
        type: { summary: "'primary' | 'icon'" },
        defaultValue: { summary: 'primary' },
      },
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the icon',
      table: {
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: 'right' },
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
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button with text and icon on the right
 */
export const Primary: Story = {
  args: {
    children: <span className="text-white font-spartan font-bold tracking-wider text-sm sm:text-base">LET'S GO</span>,
    variant: 'primary',
    icon: <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 group-hover:translate-x-1" />,
    iconPosition: 'right',
    onClick: () => console.log('Button clicked!'),
    isVisible: true,
    delay: 0,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Icon-only button for actions like scroll to top
 */
export const IconOnly: Story = {
  args: {
    children: <span className="sr-only">Back to top</span>,
    variant: 'icon',
    icon: <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 group-hover:-translate-y-1 mx-auto" />,
    onClick: () => console.log('Scroll to top!'),
    isVisible: true,
    delay: 0,
    title: 'Back to top',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Primary button with icon on the left side
 */
export const IconLeft: Story = {
  args: {
    children: <span className="text-white font-spartan font-bold tracking-wider text-sm sm:text-base">EXPLORE</span>,
    variant: 'primary',
    icon: <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
    iconPosition: 'left',
    onClick: () => console.log('Explore clicked!'),
    isVisible: true,
    delay: 0,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Button with 1 second animation delay
 */
export const WithDelay: Story = {
  args: {
    children: <span className="text-white font-spartan font-bold tracking-wider text-sm sm:text-base">START</span>,
    variant: 'primary',
    icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
    iconPosition: 'right',
    onClick: () => console.log('Start clicked!'),
    isVisible: true,
    delay: 1000,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Button appears after 1 second delay. Useful for staggered animations.',
      },
    },
  },
};

/**
 * Hidden state - button is not visible
 */
export const Hidden: Story = {
  args: {
    children: <span className="text-white font-spartan font-bold tracking-wider text-sm sm:text-base">HIDDEN</span>,
    variant: 'primary',
    icon: <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
    onClick: () => {},
    isVisible: false,
    delay: 0,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Toggle the "isVisible" control to see the fade animation.',
      },
    },
  },
};

/**
 * Different button variants for comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <ActionButton
          variant="icon"
          icon={<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white mx-auto" />}
          onClick={() => console.log('Up!')}
          isVisible={true}
          title="Back to top"
        >
          <span className="sr-only">Back to top</span>
        </ActionButton>
        <ActionButton
          variant="primary"
          icon={<Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
          iconPosition="left"
          onClick={() => console.log('Explore!')}
          isVisible={true}
        >
          <span className="text-white font-spartan font-bold tracking-wider text-sm sm:text-base">EXPLORE</span>
        </ActionButton>
        <ActionButton
          variant="primary"
          icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
          onClick={() => console.log('Go!')}
          isVisible={true}
        >
          <span className="text-white font-spartan font-bold tracking-wider text-sm sm:text-base">LET'S GO</span>
        </ActionButton>
      </div>
    </div>
  ),
  args: {
    children: <></>,
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of icon-only and primary button variants with different configurations.',
      },
    },
  },
};
