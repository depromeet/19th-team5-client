import type { Meta, StoryObj } from '@storybook/react-vite';
import { PassCard } from '@/pages/signup/pass/components/PassCard';
import { space } from '@/styles/token';
import employeePortrait from './EmployeePreview.webp';

const meta = {
  title: 'Signup/PassCard',
  component: PassCard,
  parameters: { layout: 'padded' },
  args: {
    data: {
      kind: 'visitor',
      size: 'L',
      name: '차분한 수달',
      portraitUrl: '/images/signup/boy-portrait.png',
      issuedAt: Date.UTC(2026, 10, 20),
      interviews: 2,
      levelLabel: 'Lv.1 지원자',
    },
  },
} satisfies Meta<typeof PassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  name: '방문증 · 사원증 L/M/S',
  render: () => (
    <div style={{ display: 'grid', gap: space[32] }}>
      {(['visitor', 'employee'] as const).map((kind) => (
        <div
          key={kind}
          style={{ display: 'flex', flexWrap: 'wrap', gap: space[32] }}
        >
          {(['L', 'M', 'S'] as const).map((size) => {
            const sample = {
              size,
              name:
                size === 'L' && kind === 'visitor'
                  ? '차분한 수달이'
                  : '차분한 수달',
              issuedAt: Date.UTC(2026, 10, 20),
            };
            return (
              <PassCard
                key={size}
                data={
                  kind === 'visitor'
                    ? {
                        ...sample,
                        kind,
                        portraitUrl: '/images/signup/boy-portrait.png',
                        interviews: 2,
                        levelLabel: 'Lv.1 지원자',
                      }
                    : {
                        ...sample,
                        kind,
                        portraitUrl: employeePortrait,
                        interviews: 120,
                        likes: 120,
                      }
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  ),
};
