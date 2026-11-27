import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from '@/components/common/tabs/Tabs';

type Story = StoryObj<typeof meta>;

const tabs = ['면접방', '개설 요청'] as const;

const meta = {
  title: 'Components/Tabs',
  component: Tabs.Item,
  argTypes: {
    children: { control: 'text', description: '탭 라벨' },
    selected: { control: 'boolean' },
  },
  args: {
    children: '개설 요청',
    selected: true,
  },
  render: (args) => (
    <Tabs aria-label='탭'>
      <Tabs.Item {...args} />
    </Tabs>
  ),
} satisfies Meta<typeof Tabs.Item>;

export default meta;

export const Selected: Story = {};

export const Unselected: Story = {
  args: { selected: false },
};

export const Group: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<(typeof tabs)[number]>(tabs[0]);

    return (
      <div style={{ display: 'grid', gap: 12, width: 279 }}>
        <Tabs aria-label='면접 예약'>
          {tabs.map((tab) => (
            <Tabs.Item
              key={tab}
              selected={selected === tab}
              onClick={() => setSelected(tab)}
            >
              {tab}
            </Tabs.Item>
          ))}
        </Tabs>
        <p style={{ margin: 0 }}>선택: {selected}</p>
      </div>
    );
  },
};
