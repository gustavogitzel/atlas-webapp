import type { Meta, StoryObj } from '@storybook/react';
import { GuideAvatar } from './GuideAvatar';

const meta = {
  title: 'Atoms/GuideAvatar',
  component: GuideAvatar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isActive: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GuideAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    isActive: true,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    isActive: true,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    isActive: true,
    size: 'lg',
  },
};

export const Inactive: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    isActive: false,
    size: 'md',
  },
};

export const AllSizes: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    isActive: true,
    size: 'md',
  },
  render: () => (
    <div className="flex gap-8 items-end">
      <GuideAvatar
        imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=guide"
        size="sm"
        isActive
      />
      <GuideAvatar
        imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=guide"
        size="md"
        isActive
      />
      <GuideAvatar
        imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=guide"
        size="lg"
        isActive
      />
    </div>
  ),
};
