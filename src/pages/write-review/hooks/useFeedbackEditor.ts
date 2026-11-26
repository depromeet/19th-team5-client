import { useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker } from 'react-router';
import { useStore } from 'zustand';
import { saveWriteReviewDrafts } from '@/mocks/review/WriteReviewSession';
import { createFeedbackStore } from '@/store/FeedbackStore';
import type { FeedbackDraft, InterviewFeedback } from '@/types/Interview';
import { getFeedbackCommentError } from '@/utils/FeedbackComment';
import { hasValidFeedbackKeywords } from '@/utils/FeedbackDraft';
import { getSecondsRemaining, useFeedbackClock } from './useFeedbackClock';

type FeedbackNotice = { tone: 'status' | 'error'; text: string };

/**
 * 평가 작성 화면의 렌더링과 사용자 동작을 분리한다.
 * 면접자 선택, 입력 검증과 오류 포커스, 임시 저장, 이탈 확인을 처리한다.
 */
export function useFeedbackEditor(sheet: InterviewFeedback) {
  const [store] = useState(() =>
    createFeedbackStore(sheet.drafts, getSecondsRemaining(sheet.deadline)),
  );
  const activeId = useStore(store, (state) => state.activeId);
  const candidate =
    sheet.candidates.find(({ id }) => id === activeId) ?? sheet.candidates[0];
  const id = candidate.id;
  const feedback = useStore(store, (state) => state.drafts[id]);
  const attempted = useStore(store, (state) => state.attemptedIds.has(id));
  const expired = useStore(store, (state) => state.seconds === 0);
  const [notice, setNotice] = useState<FeedbackNotice>();
  const [expiryAcknowledged, setExpiryAcknowledged] = useState(false);
  const [focusInvalid, setFocusInvalid] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);

  useFeedbackClock(store, sheet.deadline);
  const comment = feedback.comment;
  const commentError = useMemo(
    () => getFeedbackCommentError(comment),
    [comment],
  );
  const needsStrengths = !hasValidFeedbackKeywords(
    feedback.strengths,
    sheet.keywords.strengths,
  );
  const needsImprovements = !hasValidFeedbackKeywords(
    feedback.improvements,
    sheet.keywords.improvements,
  );
  const invalid = needsStrengths || needsImprovements;
  const blocker = useBlocker(() => sheet.deadline > Date.now());
  const exitRequested = blocker.state === 'blocked';
  const resetExit = blocker.reset;

  useEffect(() => {
    if (!focusInvalid) return;
    sheetRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]:not(:disabled)')
      ?.focus();
    setFocusInvalid(false);
  }, [focusInvalid]);

  function select(id: string) {
    store.getState().selectCandidate(id);
    setNotice(undefined);
  }

  function edit(draft: FeedbackDraft) {
    store.getState().editDraft(id, draft);
    setNotice(undefined);
  }

  function checkInput() {
    setNotice(undefined);
    store.getState().markAttempted(id);
    if (invalid || commentError) {
      setFocusInvalid(true);
      return;
    }
    setNotice({
      tone: 'status',
      text: '입력 내용을 확인했어요. 임시 저장할 수 있어요.',
    });
  }

  function saveDraft(action: 'save' | 'leave') {
    setNotice(undefined);
    try {
      saveWriteReviewDrafts(sheet.deadline, store.getState().drafts);
      if (action === 'leave') {
        blocker.proceed?.();
      } else {
        setNotice({ tone: 'status', text: '임시 저장했어요.' });
      }
    } catch {
      const seconds = getSecondsRemaining(sheet.deadline);
      store.getState().setSeconds(seconds);
      if (seconds > 0) {
        setNotice({
          tone: 'error',
          text: '임시 저장하지 못했어요. 다시 시도해주세요.',
        });
      }
    }
  }

  return {
    store,
    sheetRef,
    candidate,
    feedback,
    attempted,
    expired,
    commentError,
    needsStrengths,
    needsImprovements,
    checkDisabled: expired || !!commentError || (attempted && invalid),
    notice,
    select,
    edit,
    checkInput,
    saveDraft,
    resetExit,
    showDialog: exitRequested || (expired && !expiryAcknowledged),
    acknowledgeExpiry: () => {
      setExpiryAcknowledged(true);
      resetExit?.();
    },
  };
}
