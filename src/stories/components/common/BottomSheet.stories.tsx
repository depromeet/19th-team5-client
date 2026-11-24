import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BottomSheet } from '@/components/common';
import { InterviewQuestionExample } from './InterviewQuestionExample';
import { NpcConversationExample } from './NpcConversationExample';

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: { story: { inline: false, height: '560px' } },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type NpcStory = StoryObj<typeof NpcConversationExample>;
type InterviewStory = StoryObj<typeof InterviewQuestionExample>;

export const NpcConversation: NpcStory = {
  name: 'NPC 대화',
  args: { profileImageUrl: 'icon' },
  argTypes: {
    profileImageUrl: {
      options: ['icon', 'photo'],
      mapping: { icon: null, photo: '/images/kim-daeri-profile.png' },
      control: {
        type: 'select',
        labels: { icon: '기본 아이콘', photo: '프로필 이미지' },
      },
      description: '상위 컴포넌트에서 전달하는 프로필 이미지 URL입니다.',
    },
  },
  parameters: { controls: { disable: false, include: ['profileImageUrl'] } },
  render: (args) => <NpcConversationExample {...args} />,
};

export const NpcPractice: NpcStory = {
  ...NpcConversation,
  name: 'NPC 대화 · 연습 중',
  args: { ...NpcConversation.args, initialState: 'practice' },
};

export const NpcModelAnswer: NpcStory = {
  ...NpcConversation,
  name: 'NPC 대화 · 모범답안',
  args: { ...NpcConversation.args, initialState: 'answer' },
};

export const InterviewQuestion = {
  name: '면접관 질문 카드',
  args: {
    candidates: [
      { id: 'A', name: '면접자 A' },
      { id: 'B', name: '면접자 B' },
    ],
  },
  argTypes: {
    candidates: {
      control: 'object',
      description: '상위 컴포넌트에서 전달하는 면접자 목록입니다.',
    },
  },
  parameters: { controls: { disable: false, include: ['candidates'] } },
  render: (args) => <InterviewQuestionExample {...args} />,
} satisfies InterviewStory;

export const InterviewCommonAsking: InterviewStory = {
  ...InterviewQuestion,
  name: '면접관 질문 카드 · 1부 질문 중',
  args: { ...InterviewQuestion.args, initialPart: 'common', initialMic: 'on' },
};

const memoExamples = [
  {
    id: 'A',
    name: '면접자 A',
    memo: '도움을 요청한 시점을 구체적으로 설명함.',
    saved: true,
  },
  {
    id: 'B',
    name: '면접자 B',
    memo: '동료의 피드백을 적용한 과정을 더 물어보기.',
    saved: false,
  },
  {
    id: 'C',
    name: '면접자 C',
    memo: '협업 전후의 성과를 수치로 비교함.',
    saved: true,
  },
];

export const InterviewThreeCandidates: InterviewStory = {
  ...InterviewQuestion,
  name: '면접관 질문 카드 · 면접자 3명 메모',
  args: {
    initialPart: 'common',
    candidates: memoExamples.map(({ id, name }) => ({ id, name })),
  },
  play: async ({ args, canvasElement, userEvent }) => {
    const dialog = await within(canvasElement.ownerDocument.body).findByRole(
      'dialog',
      { name: '면접관 질문 카드' },
    );
    const sheet = within(dialog);
    const tabs = within(
      sheet.getByRole('group', { name: '면접자 선택' }),
    ).queryAllByRole('button');
    const memo = sheet.getByRole('textbox', { name: '면접 메모' });
    const save = sheet.getByRole('button', { name: '저장' });
    const examples = args.candidates.flatMap(({ id }, index) => {
      const example = memoExamples.find((item) => item.id === id);
      return example ? [{ ...example, tab: tabs[index] }] : [];
    });

    for (const example of examples) {
      await userEvent.click(example.tab);
      await userEvent.clear(memo);
      await userEvent.type(memo, example.memo);
      if (example.saved) await userEvent.click(save);
    }
    for (const example of examples) {
      await userEvent.click(example.tab);
      await expect(memo).toHaveValue(example.memo);
      if (example.saved) await expect(save).toBeDisabled();
      else await expect(save).toBeEnabled();
    }
    if (tabs[0]) await userEvent.click(tabs[0]);
  },
};

export const InterviewCustom: InterviewStory = {
  ...InterviewQuestion,
  name: '면접관 질문 카드 · 2부 커스텀',
  args: { ...InterviewQuestion.args, initialPart: 'custom' },
};

export const InterviewFree: InterviewStory = {
  ...InterviewQuestion,
  name: '면접관 질문 카드 · 3부 자유',
  args: { ...InterviewQuestion.args, initialPart: 'free' },
};

export const InterviewFreeAsking: InterviewStory = {
  ...InterviewQuestion,
  name: '면접관 질문 카드 · 3부 질문 중',
  args: { ...InterviewQuestion.args, initialPart: 'free', initialMic: 'on' },
};
