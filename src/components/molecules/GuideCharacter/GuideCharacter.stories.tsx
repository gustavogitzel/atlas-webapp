import type { Meta, StoryObj } from '@storybook/react';
import { GuideCharacter } from './GuideCharacter';

const meta = {
  title: 'Molecules/GuideCharacter',
  component: GuideCharacter,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    avatarSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof GuideCharacter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    message: 'Welcome! Let me guide you through this experience.',
    isActive: true,
    showMessage: true,
    avatarSize: 'lg',
  },
};

export const WithoutMessage: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    isActive: true,
    showMessage: false,
    avatarSize: 'lg',
  },
};

export const SmallSize: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    message: 'Small guide character',
    isActive: true,
    showMessage: true,
    avatarSize: 'sm',
  },
};

export const LongMessage: Story = {
  args: {
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guide',
    message: 'This is a longer message that demonstrates how the character handles extended dialogue. The speech bubble should expand to accommodate the text while maintaining good visual balance.',
    isActive: true,
    showMessage: true,
    avatarSize: 'lg',
  },
};
