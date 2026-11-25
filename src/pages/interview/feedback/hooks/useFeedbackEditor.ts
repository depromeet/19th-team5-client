import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker } from 'react-router';
import { useStore } from 'zustand';
import { interviewApi } from '@/apis/InterviewApi';
import { feedbackQuery } from '@/queries/InterviewQueries';
import { createFeedbackStore } from '@/store/FeedbackStore';
import type { FeedbackDraft, InterviewFeedback } from '@/types/Interview';
import { getFeedbackCommentError } from '@/utils/FeedbackComment';
import {
  emptyFeedback,
  findPendingCandidate,
  hasValidFeedbackKeywords,
  mergeFeedbackDrafts,
} from '@/utils/FeedbackDraft';
import { getSecondsRemaining, useFeedbackClock } from './useFeedbackClock';

const emptyDraft = emptyFeedback();
type FocusTarget = 'invalid' | 'tab';
type FeedbackNotice = { tone: 'status' | 'error'; text: string };
type WriteRequest = {
  drafts: Record<string, FeedbackDraft>;
  candidateId?: string;
};

export function useFeedbackEditor(sheet: InterviewFeedback) {
  const client = useQueryClient();
  const [store] = useState(() =>
    createFeedbackStore(getSecondsRemaining(sheet.deadline)),
  );
  const activeId = useStore(store, (state) => state.activeId);
  const nextCandidate = findPendingCandidate(sheet);
  const candidate =
    sheet.candidates.find(({ id }) => id === activeId) ??
    nextCandidate ??
    sheet.candidates[0];
  const id = candidate.id;
  const feedback =
    useStore(store, (state) => state.edits[id]) ??
    sheet.drafts[id] ??
    emptyDraft;
  const attempted = useStore(store, (state) => state.attemptedIds.has(id));
  const expired = useStore(store, (state) => state.seconds === 0);
  const complete = !nextCandidate;
  const submitted = sheet.submittedIds.includes(id);
  const [notice, setNotice] = useState<FeedbackNotice>();
  const [acknowledgedDeadline, setAcknowledgedDeadline] = useState<number>();
  const [focusTarget, setFocusTarget] = useState<FocusTarget>();
  const sheetRef = useRef<HTMLElement>(null);
  const writing = useRef(false);

  useFeedbackClock(store, sheet.deadline, complete);
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
  const blocker = useBlocker(() => {
    const current = client.getQueryData(feedbackQuery.queryKey);
    return (
      !!current &&
      current.deadline > Date.now() &&
      !!findPendingCandidate(current)
    );
  });

  const write = useMutation({
    onMutate: () => client.cancelQueries({ queryKey: feedbackQuery.queryKey }),
    mutationFn: async ({ drafts, candidateId }: WriteRequest) => {
      if (candidateId !== undefined) {
        return interviewApi.submitFeedback({ candidateId, drafts });
      }
      await interviewApi.saveFeedback(drafts);
    },
    onSuccess: (saved, { drafts }) => {
      client.setQueryData(
        feedbackQuery.queryKey,
        (current) => saved ?? (current && { ...current, drafts }),
      );
    },
  });
  const pending = write.isPending;
  const locked = pending || expired || submitted;
  const exitRequested = blocker.state === 'blocked';
  const resetExit = blocker.reset;

  useEffect(() => {
    if (complete && resetExit) resetExit();
  }, [complete, resetExit]);

  useEffect(() => {
    if (pending || !focusTarget) return;
    const selector =
      focusTarget === 'invalid'
        ? '[aria-invalid="true"]:not(:disabled)'
        : '[role="tab"][aria-selected="true"]';
    sheetRef.current?.querySelector<HTMLElement>(selector)?.focus();
    setFocusTarget(undefined);
  }, [pending, focusTarget]);

  function select(id: string) {
    store.getState().selectCandidate(id);
    setNotice(undefined);
  }

  function edit(draft: FeedbackDraft) {
    store.getState().editDraft(id, draft);
    setNotice(undefined);
  }

  async function saveOrSubmit(action: 'save' | 'leave' | 'submit') {
    if (writing.current) return;
    const current = client.getQueryData(feedbackQuery.queryKey) ?? sheet;
    if (Date.now() >= current.deadline) {
      store.getState().setSeconds(0);
      return;
    }
    if (!findPendingCandidate(current)) return;
    if (action !== 'leave' && current.submittedIds.includes(id)) return;
    if (action === 'submit') {
      store.getState().markAttempted(id);
      if (invalid || commentError) {
        setFocusTarget('invalid');
        return;
      }
    }
    writing.current = true;
    setNotice(undefined);
    try {
      const saved = await write.mutateAsync({
        drafts: mergeFeedbackDrafts(current, store.getState().edits),
        candidateId: action === 'submit' ? id : undefined,
      });
      store.getState().clearEdits();
      if (action === 'leave') {
        blocker.proceed?.();
      } else if (saved) {
        const next = findPendingCandidate(saved);
        if (next) {
          select(next.id);
          setNotice({
            tone: 'status',
            text: `${candidate.label} 평가를 제출했어요.`,
          });
          setFocusTarget('tab');
        }
      } else {
        setNotice({ tone: 'status', text: '임시 저장했어요.' });
      }
    } catch {
      store.getState().setSeconds(getSecondsRemaining(current.deadline));
      setNotice({
        tone: 'error',
        text:
          action === 'submit'
            ? '평가를 제출하지 못했어요. 다시 시도해주세요.'
            : '임시 저장하지 못했어요. 다시 시도해주세요.',
      });
    } finally {
      writing.current = false;
    }
  }

  return {
    store,
    sheetRef,
    candidate,
    feedback,
    attempted,
    expired,
    complete,
    submitted,
    pending,
    locked,
    commentError,
    needsStrengths,
    needsImprovements,
    submitDisabled: locked || !!commentError || (attempted && invalid),
    notice,
    select,
    edit,
    saveOrSubmit,
    resetExit,
    showDialog:
      !complete &&
      (exitRequested || (expired && acknowledgedDeadline !== sheet.deadline)),
    acknowledgeExpiry: () => {
      setAcknowledgedDeadline(sheet.deadline);
      resetExit?.();
    },
  };
}
