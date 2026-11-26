import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { fn } from 'storybook/test';
import { GNB } from '@/components/common';
import { gnbLabels } from '@/constants/common/gnbLabels';
import { space, typography } from '@/styles/token';
import { comparison, stickyHeader } from './gnb.stories.css';

type GNBProps = ComponentProps<typeof GNB>;
type MemberProps = Extract<GNBProps, { variant: 'member' }>;
type GuestProps = Extract<GNBProps, { variant: 'guest' }>;
type WaitingProps = Extract<GNBProps, { variant: 'waiting' }>;

const labelsControl = {
  control: 'object',
  description: '상위 화면에서 전달하는 GNB 문구입니다.',
} as const;

function PreviewDestination({ args }: { args: GNBProps }) {
  const { hash } = useLocation();
  const member = args.variant === 'member' ? args.labels : gnbLabels.member;
  const guest = args.variant === 'guest' ? args.labels : gnbLabels.guest;
  const destinations: Record<string, string> = {
    '#lobby': args.variant === 'guest' ? guest.lobby : member.lobby,
    '#my-page': member.myPage,
    '#notifications': member.notifications,
    '#about': guest.about,
    '#login': guest.login,
    '#enter': guest.enter,
    '#book': member.bookInterview,
  };
  const destination = destinations[hash];
  return destination ? (
    <p role='status' style={{ ...typography.bodyM, margin: space[24] }}>
      선택한 메뉴 · {destination}
    </p>
  ) : null;
}

const meta = {
  title: 'Components/GNB',
  component: GNB,
  decorators: [
    (Story, { args }) => (
      <MemoryRouter
        key={args.variant === 'member' ? args.activePage : args.variant}
      >
        <Story />
        <PreviewDestination args={args} />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          '상위 화면에서 `@/constants/common/gnbLabels`를 가져와 상태에 맞는 `gnbLabels.member`, `gnbLabels.guest`, `gnbLabels.waiting`을 `labels`로 전달합니다. 문구 하나만 바꿀 때는 `labels={{ ...gnbLabels.guest, enter: "면접 시작하기" }}`처럼 기본 문구를 펼쳐 사용합니다. 개별 상태 예시는 `className`으로 스크롤 시 상단에 고정합니다.',
      },
    },
  },
} satisfies Meta<typeof GNB>;

export default meta;

const memberArgs: MemberProps = {
  variant: 'member',
  labels: gnbLabels.member,
  lobbyTo: '#lobby',
  myPageTo: '#my-page',
  notificationsTo: '#notifications',
  activePage: 'lobby',
  ticketCount: 2,
  hasUnreadNotifications: true,
  onBookInterview: fn(),
};

const memberPages: Partial<Record<string, MemberProps['activePage']>> = {
  '#lobby': 'lobby',
  '#my-page': 'myPage',
  '#notifications': 'notifications',
};

function MemberPreview(args: MemberProps) {
  const { hash } = useLocation();
  const navigate = useNavigate();
  return (
    <GNB
      {...args}
      activePage={memberPages[hash] ?? args.activePage}
      onBookInterview={() => {
        args.onBookInterview?.();
        navigate('#book');
      }}
    />
  );
}

export const Member: StoryObj<MemberProps> = {
  name: '로그인',
  args: memberArgs,
  argTypes: {
    labels: labelsControl,
    ticketCount: { control: { type: 'number', min: 0, step: 1 } },
    hasUnreadNotifications: { control: 'boolean' },
    activePage: {
      control: 'select',
      options: ['lobby', 'myPage', 'notifications'],
    },
  },
  parameters: {
    controls: {
      disable: false,
      include: [
        'labels',
        'ticketCount',
        'hasUnreadNotifications',
        'activePage',
      ],
    },
  },
  render: (args) => <MemberPreview {...args} className={stickyHeader} />,
};

export const MemberZeroTickets: StoryObj<MemberProps> = {
  ...Member,
  name: '로그인 · 면접권 0장 · 읽지 않은 알림 없음',
  args: { ...memberArgs, ticketCount: 0, hasUnreadNotifications: false },
};

const guestArgs: GuestProps = {
  variant: 'guest',
  labels: gnbLabels.guest,
  lobbyTo: '#lobby',
  aboutTo: '#about',
  onLogin: fn(),
  onEnter: fn(),
};

function GuestPreview(args: GuestProps) {
  const navigate = useNavigate();
  return (
    <GNB
      {...args}
      onLogin={() => {
        args.onLogin();
        navigate('#login');
      }}
      onEnter={() => {
        args.onEnter();
        navigate('#enter');
      }}
    />
  );
}

export const Guest: StoryObj<GuestProps> = {
  name: '비로그인',
  args: guestArgs,
  argTypes: { labels: labelsControl },
  parameters: { controls: { disable: false, include: ['labels'] } },
  render: (args) => <GuestPreview {...args} className={stickyHeader} />,
};

export const Waiting: StoryObj<WaitingProps> = {
  name: '대기실 잠김',
  args: { variant: 'waiting', labels: gnbLabels.waiting },
  argTypes: { labels: labelsControl },
  parameters: { controls: { disable: false, include: ['labels'] } },
  render: (args) => <GNB {...args} className={stickyHeader} />,
};

export const InterviewHidden: StoryObj<typeof GNB> = {
  name: '면접 중',
  args: { variant: 'interview' },
  render: (args) => (
    <>
      <GNB {...args} />
      <p style={{ ...typography.bodyM, margin: space[24] }}>
        면접 진행 중 · GNB 숨김
      </p>
    </>
  ),
};

export const Overview: StoryObj<typeof GNB> = {
  name: '상태별 비교',
  render: () => (
    <div className={comparison}>
      <section aria-label='로그인'>
        <MemberPreview {...memberArgs} />
      </section>
      <section aria-label='비로그인'>
        <GuestPreview {...guestArgs} />
      </section>
      <section aria-label='대기실 잠김'>
        <GNB variant='waiting' labels={gnbLabels.waiting} />
      </section>
    </div>
  ),
};

export const CustomLabels: StoryObj<GuestProps> = {
  name: '상위 화면에서 문구 변경',
  args: {
    ...guestArgs,
    labels: { ...gnbLabels.guest, enter: '면접 시작하기' },
  },
  render: (args) => (
    <div className={comparison}>
      <section aria-label='비로그인'>
        <GuestPreview {...args} />
      </section>
      <section aria-label='대기실 잠김'>
        <GNB
          variant='waiting'
          labels={{
            ...gnbLabels.waiting,
            waitingMessage: '면접이 시작되면 알려드릴게요',
          }}
        />
      </section>
    </div>
  ),
};
