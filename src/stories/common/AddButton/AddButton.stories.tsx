import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { AddButton } from '@/components/common/add-button/AddButton';

const meta = {
  title: 'Components/AddButton',
  component: AddButton,
  args: {
    children: '+ 질문 추가하기',
    limited: false,
    description: '질문은 3개까지 만들 수 있어요.',
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 430 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Limited: Story = {
  args: { limited: true },
};

const MAX_QUESTIONS = 3;

export const Playground: Story = {
  render: (args) => {
    const [count, setCount] = useState(0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: count }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 데모용 고정 목록
          <div key={index}>질문 {index + 1}</div>
        ))}
        <AddButton
          {...args}
          limited={count >= MAX_QUESTIONS}
          onClick={(event) => {
            setCount((prev) => prev + 1);
            args.onClick?.(event);
          }}
        />
      </div>
    );
  },
};
