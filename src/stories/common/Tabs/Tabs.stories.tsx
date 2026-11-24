import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from '@/components/common/tabs/Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs.Item,
  argTypes: {
    children: { control: 'text', description: '탭 라벨' },
    selected: { control: 'boolean' },
  },
  args: {
    children: 'Label',
    selected: true,
  },
  render: (args) => (
    <Tabs aria-label='탭'>
      <Tabs.Item {...args} />
    </Tabs>
  ),
} satisfies Meta<typeof Tabs.Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const Unselected: Story = {
  args: { selected: false },
};

const TABS = ['전체', '진행 중', '완료'];

export const Group: Story = {
  render: function Render() {
    const [selected, setSelected] = useState(TABS[0]);

    return (
      <div style={{ display: 'grid', gap: 12, width: 279 }}>
        <Tabs aria-label='면접 상태'>
          {TABS.map((tab) => (
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
