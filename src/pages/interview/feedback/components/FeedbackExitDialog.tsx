import { useStore } from 'zustand';
import { Button } from '@/components/common/button';
import { Dialog } from '@/components/common/dialog';
import type { FeedbackStore } from '@/store/FeedbackStore';
import { formatTime } from '@/utils/formatTime';
import * as styles from '../../Interview.css';
export function FeedbackExitDialog({
  expired,
  store,
  durationMinutes,
  completed,
  total,
  pending,
  error,
  onAcknowledge,
  onLeave,
  onContinue,
}: {
  expired: boolean;
  store: FeedbackStore;
  durationMinutes: number;
  completed: number;
  total: number;
  pending: boolean;
  error?: string;
  onAcknowledge: () => void;
  onLeave: () => void;
  onContinue?: () => void;
}) {
  return (
    <Dialog
      className={styles.dialog}
      isOpen
      onCancel={() => {
        if (!expired && !pending) onContinue?.();
      }}
    >
      {expired ? (
        <>
          <Dialog.Header>피드백 작성 시간이 종료됐어요.</Dialog.Header>
          <Dialog.Description>
            면접 종료 후 {durationMinutes}분의 작성 시간이 지났어요.
          </Dialog.Description>
          <Dialog.Footer>
            <Button size='large' display='block' onClick={onAcknowledge}>
              확인
            </Button>
          </Dialog.Footer>
        </>
      ) : (
        <>
          <Dialog.Header>피드백은 꼭 남겨야해요</Dialog.Header>
          <Dialog.Description>
            모든 면접자에게 피드백을 남겨야 면접이 마무리돼요.
            <br />
            지금 나가도 작성 중인 내용은 임시 저장돼요.
          </Dialog.Description>
          <Dialog.Body className={styles.inset}>
            <div className={styles.row}>
              <span>평가 마감</span>
              <FeedbackExitTime store={store} />
            </div>
            <div className={styles.row}>
              <span>평가 완료</span>
              <strong>
                {completed} / {total}명
              </strong>
            </div>
          </Dialog.Body>
          {error && (
            <p role='alert' className={styles.error}>
              {error}
            </p>
          )}
          <Dialog.Footer className={styles.dialogActions}>
            <Button
              variant='secondary'
              size='large'
              disabled={pending}
              onClick={onLeave}
            >
              나가기
            </Button>
            <Button size='large' disabled={pending} onClick={onContinue}>
              계속 작성하기
            </Button>
          </Dialog.Footer>
        </>
      )}
    </Dialog>
  );
}

function FeedbackExitTime({ store }: { store: FeedbackStore }) {
  const seconds = useStore(store, (state) => state.seconds);
  return <strong className={styles.error}>{formatTime(seconds)}</strong>;
}
