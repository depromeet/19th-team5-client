import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio } from '@/components/common/radio/Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  argTypes: {
    children: { control: 'text', description: '라디오 라벨' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: '칩',
    defaultChecked: false,
    disabled: false,
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 8, alignItems: 'center' } as const;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const AllStates: Story = {
  render: ({ disabled }) => (
    <div style={row}>
      <Radio name='all-states' disabled={disabled} defaultChecked>
        칩
      </Radio>
      <Radio name='all-states' disabled={disabled}>
        칩
      </Radio>
    </div>
  ),
};

const OPTIONS = ['프론트엔드', '백엔드', '디자인', '기획'];

export const Group: Story = {
  render: function Render({ disabled }) {
    const [selected, setSelected] = useState(OPTIONS[0]);

    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div role='radiogroup' aria-label='직군' style={row}>
          {OPTIONS.map((option) => (
            <Radio
              key={option}
              name='job'
              value={option}
              disabled={disabled}
              checked={selected === option}
              onChange={() => setSelected(option)}
            >
              {option}
            </Radio>
          ))}
        </div>
        <p style={{ margin: 0 }}>선택: {selected}</p>
      </div>
    );
  },
};
