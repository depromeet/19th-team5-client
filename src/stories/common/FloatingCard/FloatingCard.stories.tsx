import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { Button, FloatingCard } from '@/components/common';
import * as styles from './floatingCard.stories.css';

type PreviewProps = ComponentProps<typeof FloatingCard> & {
  actionCount?: 0 | 1 | 2;
  singleButtonVariant?: 'primary' | 'secondary';
};

function CardPreview({
  actionCount = 0,
  singleButtonVariant = 'primary',
  children,
  ...cardProps
}: PreviewProps) {
  const [lastAction, setLastAction] = useState('');

  return (
    <FloatingCard {...cardProps}>
      <FloatingCard.Body>
        {children && (
          <>
            <h2 className={styles.heading}>{cardProps['aria-label']}</h2>
            <p className={styles.message}>{children}</p>
          </>
        )}
        {lastAction && (
          <p role='status' className={styles.message}>
            선택한 버튼 · {lastAction}
          </p>
        )}
      </FloatingCard.Body>
      {actionCount > 0 && (
        <FloatingCard.Footer>
          {actionCount === 2 && (
            <Button variant='secondary' onClick={() => setLastAction('나중에')}>
              나중에
            </Button>
          )}
          <Button
            variant={actionCount === 1 ? singleButtonVariant : 'primary'}
            onClick={() => setLastAction('확인')}
          >
            확인
          </Button>
        </FloatingCard.Footer>
      )}
    </FloatingCard>
  );
}

const meta = {
  title: 'Components/FloatingCard',
  component: FloatingCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '320px' },
      description: {
        component:
          '카드 위치는 상위 화면의 레이아웃에서 정합니다. 본문을 FloatingCard.Body에 넣고, 버튼이 필요하면 FloatingCard.Footer 안에 공통 Button을 배치합니다.',
      },
    },
    controls: { include: ['children'] },
  },
  argTypes: {
    children: { description: '상위에서 넣는 카드 본문', control: 'text' },
    singleButtonVariant: {
      description: '버튼이 하나일 때 적용할 variant',
      control: 'inline-radio',
      options: ['primary', 'secondary'],
    },
  },
  render: (args) => (
    <div className={styles.preview}>
      <CardPreview {...args} className={styles.floatingExample} />
    </div>
  ),
} satisfies Meta<PreviewProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: '시안 비교 · 버튼 0개, 1개, 2개',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.comparison}>
      <CardPreview aria-label='콘텐츠만' />
      <CardPreview aria-label='버튼 1개' actionCount={1} />
      <CardPreview aria-label='버튼 2개' actionCount={2} />
    </div>
  ),
};

export const ContentOnly: Story = {
  name: '콘텐츠만',
  args: {
    'aria-label': '면접 일정',
    children: '오늘 오후 3시에 모의면접이 예정되어 있어요.',
  },
};

export const Notification: Story = {
  name: '알림 · 기본 버튼',
  args: {
    'aria-label': '예약 알림',
    children: '모의면접 예약이 확정됐어요.',
    actionCount: 1,
    singleButtonVariant: 'primary',
  },
  parameters: { controls: { include: ['children', 'singleButtonVariant'] } },
};

export const Reservation: Story = {
  name: '예약 · 버튼 2개',
  args: {
    'aria-label': '면접 예약',
    children: '오늘 오후 3시 모의면접에 참여하시겠어요?',
    actionCount: 2,
  },
};

export const SecondaryOnly: Story = {
  ...Notification,
  name: '알림 · 보조 버튼',
  args: {
    ...Notification.args,
    singleButtonVariant: 'secondary',
  },
};
