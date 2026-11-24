import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Timer } from '@/components/common/timer/Timer';

const meta = {
  title: 'Components/Timer',
  component: Timer,
  argTypes: {
    seconds: { control: 'number', description: '표시할 시간(초)' },
    tone: {
      control: 'inline-radio',
      options: ['live', 'default', 'dark'],
      table: { defaultValue: { summary: 'live' } },
    },
  },
  args: {
    seconds: 0,
    tone: 'live',
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 8, alignItems: 'center' } as const;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={row}>
      <Timer {...args} tone='live' />
      <Timer {...args} tone='default' />
      <Timer {...args} tone='dark' />
    </div>
  ),
};

export const Running: Story = {
  render: (args) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
      const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
      return () => clearInterval(id);
    }, []);

    return <Timer {...args} seconds={elapsed} />;
  },
};
