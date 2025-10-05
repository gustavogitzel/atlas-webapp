import type { Meta, StoryObj } from '@storybook/react';
import { Flame, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatBadge } from './StatBadge';

const meta = {
  title: 'Atoms/StatBadge',
  component: StatBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'destructive', 'secondary', 'glass'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    helpText: {
      control: 'text',
      description: 'Help text shown in tooltip',
    },
  },
} satisfies Meta<typeof StatBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total Fires',
    value: 1234,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Avg FRP',
    value: '44.1 MW',
    icon: <Zap />,
    variant: 'destructive',
  },
};

export const Primary: Story = {
  args: {
    label: 'Confidence',
    value: '72%',
    icon: <Flame />,
    variant: 'primary',
  },
};

export const Small: Story = {
  args: {
    label: 'Count',
    value: 100,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Max FRP',
    value: '380.9 MW',
    icon: <TrendingUp />,
    variant: 'destructive',
    size: 'lg',
  },
};

export const AllVariants: Story = {
  args: {
    label: 'Example',
    value: 123,
  },
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <StatBadge label="Default" value={123} />
      <StatBadge label="Primary" value={456} variant="primary" />
      <StatBadge label="Destructive" value={789} variant="destructive" />
      <StatBadge label="Secondary" value={101} variant="secondary" />
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    label: 'Example',
    value: 123,
  },
  render: () => (
    <div className="flex gap-4 items-end">
      <StatBadge label="Small" value={123} size="sm" icon={<AlertTriangle />} />
      <StatBadge label="Medium" value={456} size="md" icon={<AlertTriangle />} />
      <StatBadge label="Large" value={789} size="lg" icon={<AlertTriangle />} />
    </div>
  ),
};

export const WithHelpText: Story = {
  args: {
    label: 'Avg FRP',
    value: '44.1 MW',
    icon: <Zap />,
    helpText: 'Fire Radiative Power: Average thermal energy released by fires',
    variant: 'glass',
    size: 'sm',
  },
};

export const GlassVariant: Story = {
  args: {
    label: 'Confidence',
    value: '72%',
    helpText: 'Average detection confidence level',
    variant: 'glass',
    size: 'sm',
  },
};
