import { useStore } from 'zustand';
import { Button } from '@/components/common/button';
import { Dialog } from '@/components/common/dialog';
import * as styles from '@/components/review/Review.css';
import type { FeedbackStore } from '@/store/FeedbackStore';
import { formatTime } from '@/utils/formatTime';
export function FeedbackExitDialog({
  expired,
  store,
  durationMinutes,
  error,
  onAcknowledge,
  onLeave,
  onContinue,
}: {
  expired: boolean;
  store: FeedbackStore;
  durationMinutes: number;
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
        if (!expired) onContinue?.();
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
          <Dialog.Header>평가 작성을 나갈까요?</Dialog.Header>
          <Dialog.Description>
            나가기를 선택하면 작성 중인 내용이 이 브라우저 탭에 임시 저장돼요.
          </Dialog.Description>
          <Dialog.Body className={styles.inset}>
            <div className={styles.row}>
              <span>평가 마감</span>
              <FeedbackExitTime store={store} />
            </div>
          </Dialog.Body>
          {error && (
            <p role='alert' className={styles.error}>
              {error}
            </p>
          )}
          <Dialog.Footer className={styles.dialogActions}>
            <Button variant='secondary' size='large' onClick={onLeave}>
              나가기
            </Button>
            <Button size='large' onClick={onContinue}>
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
