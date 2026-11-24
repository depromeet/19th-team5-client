import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@/components/common/avatar/Avatar';

const SAMPLE_IMAGE_URL = '/images/kim-daeri-profile.png';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  args: {
    imageUrl: SAMPLE_IMAGE_URL,
    alt: '김대리 프로필',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {};

export const Empty: Story = {
  args: { imageUrl: undefined, alt: undefined },
};

export const All: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} />
      <Avatar />
    </div>
  ),
};
