import type { Meta, StoryObj } from '@storybook/react';
import { FireStats } from './FireStats';

const meta = {
  title: 'Molecules/FireStats',
  component: FireStats,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FireStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Critical: Story = {
  args: {
    data: {
      totalDetections: 100,
      radius: 0.05,
      riskLevel: 'Critical',
      criticalFires: 11,
      avgFRP: 44.1,
      maxFRP: 380.9,
      avgConfidence: 72,
      highConfidenceCount: 47,
    },
  },
};

export const High: Story = {
  args: {
    data: {
      totalDetections: 50,
      radius: 0.05,
      riskLevel: 'High',
      criticalFires: 0,
      avgFRP: 65.3,
      maxFRP: 250.0,
      avgConfidence: 85,
      highConfidenceCount: 42,
    },
  },
};

export const Medium: Story = {
  args: {
    data: {
      totalDetections: 25,
      radius: 0.05,
      riskLevel: 'Medium',
      criticalFires: 0,
      avgFRP: 35.2,
      maxFRP: 120.5,
      avgConfidence: 78,
      highConfidenceCount: 18,
    },
  },
};

export const Low: Story = {
  args: {
    data: {
      totalDetections: 10,
      radius: 0.05,
      riskLevel: 'Low',
      criticalFires: 0,
      avgFRP: 15.8,
      maxFRP: 45.3,
      avgConfidence: 68,
      highConfidenceCount: 5,
    },
  },
};

export const Mobile: Story = {
  args: {
    data: {
      totalDetections: 100,
      radius: 0.05,
      riskLevel: 'Critical',
      criticalFires: 11,
      avgFRP: 44.1,
      maxFRP: 380.9,
      avgConfidence: 72,
      highConfidenceCount: 47,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
