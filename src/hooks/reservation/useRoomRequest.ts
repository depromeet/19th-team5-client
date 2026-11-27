import { useState } from 'react';
import { useNow } from '@/hooks/common/useNow';
import { useReservationStore } from '@/stores/reservation/reservationStore';
import type { RoomRequestDraft } from '@/types/reservation';
import {
  nextRequestWeek,
  remainingRequests,
  validRoomRequest,
} from '@/utils/reservation';

type RequestResult = 'submitted' | 'limit' | 'error' | null;

const emptyDraft: RoomRequestDraft = {
  title: '',
  job: '',
  hour: null,
  reason: '',
};

export function useRoomRequest() {
  const now = useNow();
  const requests = useReservationStore((state) => state.requests);
  const requestRoom = useReservationStore((state) => state.requestRoom);
  const [draft, setDraft] = useState(emptyDraft);
  const [result, setResult] = useState<RequestResult>(null);
  const [pending, setPending] = useState(false);
  const remaining = remainingRequests(requests, now);

  function updateDraft(changes: Partial<RoomRequestDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  async function submit() {
    if (pending) return;
    setPending(true);
    const response = await requestRoom(draft);
    setPending(false);
    if (response !== 'invalid') setResult(response);
  }

  function closeResult() {
    if (result === 'submitted') setDraft(emptyDraft);
    setResult(null);
  }

  return {
    draft,
    updateDraft,
    pending,
    result,
    remaining,
    nextRequestAt: nextRequestWeek(now),
    canSubmit: !pending && validRoomRequest(draft),
    submit,
    showLimit: () => setResult('limit'),
    closeResult,
  };
}
