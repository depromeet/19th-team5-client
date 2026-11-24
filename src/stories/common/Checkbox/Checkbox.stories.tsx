import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from '@/components/common/checkbox/Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'chip'],
      description: '체크박스 형태. `chip`이면 `children`(라벨)이 필수예요.',
      table: { defaultValue: { summary: 'default' } },
    },
    children: {
      control: 'text',
      description: '`chip`의 라벨. `default`에서는 쓰지 않아요.',
      if: { arg: 'variant', eq: 'chip' },
    },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    'aria-label': '체크박스',
    defaultChecked: false,
    disabled: false,
  },
  // Controls에서 variant를 바꿔도 깨지지 않도록 variant별로 나눠 그린다.
  render: ({ variant, children, ...args }) =>
    variant === 'chip' ? (
      <Checkbox {...args} variant='chip'>
        {children ?? '칩'}
      </Checkbox>
    ) : (
      <Checkbox {...args} />
    ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const;

export const Default: Story = {
  args: { variant: 'default' },
};

export const DefaultChecked: Story = {
  args: { variant: 'default', defaultChecked: true },
};

export const Chip: Story = {
  args: { variant: 'chip', children: '칩' },
};

export const ChipChecked: Story = {
  args: { variant: 'chip', children: '칩', defaultChecked: true },
};

export const AllVariants: Story = {
  render: ({ disabled }) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={row}>
        <Checkbox aria-label='체크됨' disabled={disabled} defaultChecked />
        <Checkbox aria-label='체크 안 됨' disabled={disabled} />
      </div>
      <div style={row}>
        <Checkbox variant='chip' disabled={disabled} defaultChecked>
          칩
        </Checkbox>
        <Checkbox variant='chip' disabled={disabled}>
          칩
        </Checkbox>
      </div>
    </div>
  ),
};

const CHIP_OPTIONS = ['프론트엔드', '백엔드', '디자인', '기획'];

export const ChipGroup: Story = {
  render: function Render({ disabled }) {
    const [selected, setSelected] = useState<string[]>(['프론트엔드']);

    const toggle = (option: string) =>
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option],
      );

    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ ...row, gap: 8 }}>
          {CHIP_OPTIONS.map((option) => (
            <Checkbox
              key={option}
              variant='chip'
              name='job'
              value={option}
              disabled={disabled}
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
            >
              {option}
            </Checkbox>
          ))}
        </div>
        <p style={{ margin: 0 }}>선택: {selected.join(', ') || '없음'}</p>
      </div>
    );
  },
};
