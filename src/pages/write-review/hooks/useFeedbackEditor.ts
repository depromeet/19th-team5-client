import { useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker, useLocation, useNavigate } from 'react-router';
import { useStore } from 'zustand';
import { interviewPaths } from '@/constants/common/paths';
import { saveWriteReviewDrafts } from '@/mocks/review/WriteReviewSession';
import { createFeedbackStore } from '@/store/FeedbackStore';
import type { FeedbackDraft, InterviewFeedback } from '@/types/Interview';
import { getFeedbackCommentError } from '@/utils/FeedbackComment';
import { hasValidFeedbackKeywords } from '@/utils/FeedbackDraft';
import { getSecondsRemaining, useFeedbackClock } from './useFeedbackClock';

type FeedbackNotice = { tone: 'status' | 'error'; text: string };

/**
 * 평가 작성 화면의 렌더링과 사용자 동작을 분리한다.
 * 면접자 선택, 입력 검증과 오류 포커스, 임시 저장, 제출, 이탈 확인을 처리한다.
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
  const [submittedIds, setSubmittedIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  // 제출을 마치고 로비로 갈 때는 이탈 확인 없이 나간다.
  const isLeavingRef = useRef(false);
  const navigate = useNavigate();

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
  const { pathname } = useLocation();
  const blocker = useBlocker(
    ({ currentLocation }) =>
      !isLeavingRef.current &&
      currentLocation.pathname === pathname &&
      sheet.deadline > Date.now(),
  );
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

  /** 지금 면접자의 필수 항목을 검사하고, 통과하면 저장한 뒤 제출 안내를 띄운다. */
  function submit() {
    setNotice(undefined);
    store.getState().markAttempted(id);
    if (invalid || commentError) {
      setFocusInvalid(true);
      return;
    }
    // TODO(API): 평가 제출 API가 생기면 바꾼다. 지금은 이 탭에 저장만 한다.
    if (!persistDrafts()) return;
    setSubmittedIds((ids) => new Set([...ids, id]));
    setIsSubmitDialogOpen(true);
  }

  /** 제출 안내를 닫고, 아직 제출하지 않은 다음 면접자가 있으면 그 탭으로 옮긴다. */
  function continueWriting() {
    setIsSubmitDialogOpen(false);
    const next = sheet.candidates.find(
      (person) => person.id !== id && !submittedIds.has(person.id),
    );
    if (next) select(next.id);
  }

  function leaveToLobby() {
    isLeavingRef.current = true;
    navigate(interviewPaths.lobbyHome, { replace: true });
  }

  /** 작성 내용을 이 탭에 저장한다. 마감이 지났거나 저장하지 못하면 false */
  function persistDrafts() {
    try {
      saveWriteReviewDrafts(sheet.deadline, store.getState().drafts);
      return true;
    } catch {
      const seconds = getSecondsRemaining(sheet.deadline);
      store.getState().setSeconds(seconds);
      if (seconds > 0) {
        setNotice({
          tone: 'error',
          text: '저장하지 못했어요. 다시 시도해주세요.',
        });
      }
      return false;
    }
  }

  function saveDraft(action: 'save' | 'leave') {
    setNotice(undefined);
    if (!persistDrafts()) return;
    if (action === 'leave') {
      blocker.proceed?.();
    } else {
      setNotice({ tone: 'status', text: '임시 저장했어요.' });
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
    submitDisabled: expired || !!commentError || (attempted && invalid),
    notice,
    submittedIds,
    isSubmitDialogOpen,
    select,
    edit,
    submit,
    continueWriting,
    leaveToLobby,
    saveDraft,
    resetExit,
    showDialog: exitRequested || (expired && !expiryAcknowledged),
    acknowledgeExpiry: () => {
      setExpiryAcknowledged(true);
      resetExit?.();
    },
  };
}
