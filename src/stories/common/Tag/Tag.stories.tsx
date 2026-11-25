import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '@/components/common/tag/Tag';
import { tag } from '@/components/common/tag/tag.css';
import { recipeArgTypes } from '@/utils/recipeArgTypes';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  argTypes: recipeArgTypes(tag),
  args: {
    children: '태그',
    tone: 'dark',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

function optionNames<Option extends string>(options: Record<Option, string>) {
  return Object.keys(options) as Option[];
}

export const Dark: Story = {
  args: { tone: 'dark' },
};

export const Gray: Story = {
  args: { tone: 'gray' },
};

export const Red: Story = {
  args: { tone: 'red' },
};

export const Green: Story = {
  args: { tone: 'green' },
};

export const Outline: Story = {
  args: { tone: 'outline' },
};

export const AllTones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {optionNames(tag.classNames.variants.tone).map((tone) => (
        <Tag key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};
