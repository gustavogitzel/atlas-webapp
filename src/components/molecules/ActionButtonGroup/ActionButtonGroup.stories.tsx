import type { Meta, StoryObj } from '@storybook/react';
import { ActionButtonGroup } from './ActionButtonGroup';
import { ActionButton } from '@atoms/ActionButton';
import { ChevronUp, ArrowRight, Rocket, Globe } from 'lucide-react';

/**
 * ActionButtonGroup groups action buttons with responsive layout.
 * Stacks vertically on mobile, horizontally on tablet and desktop.
 */
const meta = {
  title: 'Molecules/ActionButtonGroup',
  component: ActionButtonGroup,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ActionButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button group with icon and primary button
 */
export const Default: Story = {
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton
        variant="icon"
        icon={<ChevronUp className="w-5 h-5 text-white mx-auto" />}
        onClick={() => alert('Back to top')}
        isVisible={true}
        delay={1200}
        title="Back to top"
      >
        <span className="sr-only">Back to top</span>
      </ActionButton>
      <ActionButton
        variant="primary"
        icon={<ArrowRight className="w-5 h-5 text-white" />}
        onClick={() => alert('Go!')}
        isVisible={true}
        delay={1200}
      >
        <span className="text-white font-spartan font-bold tracking-wider">LET'S GO</span>
      </ActionButton>
    </ActionButtonGroup>
  ),
  args: {
    isVisible: true,
  },
};

/**
 * Three buttons
 */
export const ThreeButtons: Story = {
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton
        variant="icon"
        icon={<ChevronUp className="w-5 h-5 text-white mx-auto" />}
        onClick={() => {}}
        isVisible={true}
        title="Up"
      >
        <span className="sr-only">Up</span>
      </ActionButton>
      <ActionButton
        variant="primary"
        icon={<Rocket className="w-5 h-5 text-white" />}
        onClick={() => {}}
        isVisible={true}
      >
        <span className="text-white font-spartan font-bold tracking-wider">EXPLORE</span>
      </ActionButton>
      <ActionButton
        variant="primary"
        icon={<Globe className="w-5 h-5 text-white" />}
        onClick={() => {}}
        isVisible={true}
      >
        <span className="text-white font-spartan font-bold tracking-wider">DISCOVER</span>
      </ActionButton>
    </ActionButtonGroup>
  ),
  args: {
    isVisible: true,
  },
};

/**
 * Only primary buttons
 */
export const PrimaryOnly: Story = {
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton
        variant="primary"
        icon={<Rocket className="w-5 h-5 text-white" />}
        onClick={() => {}}
        isVisible={true}
      >
        <span className="text-white font-spartan font-bold tracking-wider">START</span>
      </ActionButton>
      <ActionButton
        variant="primary"
        icon={<Globe className="w-5 h-5 text-white" />}
        onClick={() => {}}
        isVisible={true}
      >
        <span className="text-white font-spartan font-bold tracking-wider">EXPLORE</span>
      </ActionButton>
    </ActionButtonGroup>
  ),
  args: {
    isVisible: true,
  },
};

/**
 * Hidden state
 */
export const Hidden: Story = {
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton
        variant="icon"
        icon={<ChevronUp className="w-5 h-5 text-white mx-auto" />}
        onClick={() => {}}
        isVisible={true}
      >
        <span className="sr-only">Up</span>
      </ActionButton>
      <ActionButton
        variant="primary"
        icon={<ArrowRight className="w-5 h-5 text-white" />}
        onClick={() => {}}
        isVisible={true}
      >
        <span className="text-white font-spartan font-bold tracking-wider">GO</span>
      </ActionButton>
    </ActionButtonGroup>
  ),
  args: {
    isVisible: false,
  },
};
