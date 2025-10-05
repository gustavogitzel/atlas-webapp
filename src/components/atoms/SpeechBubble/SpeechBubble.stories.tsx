import type { Meta, StoryObj } from '@storybook/react';
import { SpeechBubble } from './SpeechBubble';

const meta = {
  title: 'Atoms/SpeechBubble',
  component: SpeechBubble,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SpeechBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Hello! I\'m your guide. Let me show you around!',
    isVisible: true,
  },
};

export const LongText: Story = {
  args: {
    text: 'This is a longer message that demonstrates how the speech bubble handles multiple lines of text. It should wrap nicely and maintain good readability.',
    isVisible: true,
  },
};

export const ShortText: Story = {
  args: {
    text: 'Quick tip!',
    isVisible: true,
  },
};
