import { create } from 'zustand';
import type { InterviewMemo } from '@/types/interview-room/memo';

/** 면접자 한 명의 메모. 키는 getMemoKey로 만든다. */
export type CandidateMemos = Readonly<Record<string, InterviewMemo>>;

/** 면접 하나에 면접자별 메모를 둔다. */
type MemoBook = Record<string, Record<string, CandidateMemos>>;

type InterviewMemoState = {
  memos: MemoBook;
  /** 메모를 저장한다. 내용을 비우고 저장하면 그 메모를 지운다. */
  saveMemo: (
    interviewId: string,
    candidateId: string,
    memo: InterviewMemo,
  ) => void;
};

export function getMemoKey({
  part,
  questionNumber,
}: Pick<InterviewMemo, 'part' | 'questionNumber'>) {
  return `${part}-${questionNumber}`;
}

/**
 * 면접관이 면접 중에 남기는 메모. 3부에서 1·2부 메모를 다시 보는 데 쓴다.
 * API가 생기면 저장할 때 서버로 보내고, 평가표에서 다시 불러온다.
 */
export const useInterviewMemoStore = create<InterviewMemoState>()((set) => ({
  memos: {},
  saveMemo: (interviewId, candidateId, memo) =>
    set(({ memos }) => {
      const interview = memos[interviewId] ?? {};
      const key = getMemoKey(memo);
      const text = memo.text.trim();
      const others = Object.fromEntries(
        Object.entries(interview[candidateId] ?? {}).filter(
          ([memoKey]) => memoKey !== key,
        ),
      );
      return {
        memos: {
          ...memos,
          [interviewId]: {
            ...interview,
            [candidateId]: text
              ? { ...others, [key]: { ...memo, text } }
              : others,
          },
        },
      };
    }),
}));
