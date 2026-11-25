import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '@/components/common/button/Button';
import { CountDown } from '@/components/common/count-down/CountDown';
import { color } from '@/styles/token';

const meta = {
  title: 'Components/CountDown',
  component: CountDown,
  argTypes: {
    seconds: {
      control: { type: 'number', min: 1 },
      description: '카운트다운을 시작할 초',
      table: { defaultValue: { summary: '3' } },
    },
  },
  args: {
    seconds: 3,
    onComplete: fn(),
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ padding: 40, background: color.neutral[900] }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CountDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TenSeconds: Story = {
  args: { seconds: 10 },
};

export const CustomDescription: Story = {
  args: {
    seconds: 5,
    description: (remaining) =>
      remaining === 1 ? '녹음을 시작합니다.' : `${remaining}초 후 녹음 시작`,
  },
};

export const Restart: Story = {
  render: function Render(args) {
    const [round, setRound] = useState(0);
    const [done, setDone] = useState(false);

    return (
      <div style={{ display: 'grid', gap: 24, justifyItems: 'center' }}>
        <CountDown
          key={round}
          {...args}
          onComplete={() => {
            args.onComplete?.();
            setDone(true);
          }}
        />
        <Button
          disabled={!done}
          onClick={() => {
            setDone(false);
            setRound((prev) => prev + 1);
          }}
        >
          다시 시작
        </Button>
      </div>
    );
  },
};
