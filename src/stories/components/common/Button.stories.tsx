import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/common/button/Button';
import { button } from '@/components/common/button/button.css';
import { recipeArgTypes } from '@/utils/recipeArgTypes';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: recipeArgTypes(button),
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'medium',
    display: 'inline',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

function optionNames<Option extends string>(options: Record<Option, string>) {
  return Object.keys(options) as Option[];
}

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Text: Story = {
  args: { variant: 'text' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Large: Story = {
  args: { size: 'large' },
};

export const Medium: Story = {
  args: { size: 'medium' },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {optionNames(button.classNames.variants.variant).map((variant) => (
        <Button key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {optionNames(button.classNames.variants.size).map((size) => (
        <Button key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
