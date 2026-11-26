import { Button } from '@/components/common/button';
import { Dialog } from '@/components/common/dialog';
import * as styles from '@/components/review/Review.css';
import type { FeedbackCandidate } from '@/types/Interview';

/**
 * 한 면접자의 평가를 제출하면 띄운다. 남은 면접자를 이어서 쓰거나,
 * 평가지 작성을 끝내고 로비로 돌아간다.
 */
export function FeedbackSubmitDialog({
  submitted,
  remaining,
  onContinue,
  onLeave,
}: {
  submitted: FeedbackCandidate;
  remaining: readonly FeedbackCandidate[];
  onContinue: () => void;
  onLeave: () => void;
}) {
  return (
    <Dialog className={styles.dialog} isOpen onCancel={onContinue}>
      <Dialog.Header>{submitted.label} 평가를 제출했어요</Dialog.Header>
      <Dialog.Description>
        {remaining.length > 0
          ? `아직 ${remaining.map(({ label }) => label).join(', ')} 평가가 남았어요. 이어서 작성할까요?`
          : '모든 면접자의 평가를 제출했어요. 마감 전까지는 다시 고칠 수 있어요.'}
      </Dialog.Description>
      <Dialog.Footer className={styles.dialogActions}>
        <Button
          variant='secondary'
          size='large'
          display='block'
          onClick={onLeave}
        >
          로비로 돌아가기
        </Button>
        <Button size='large' display='block' onClick={onContinue}>
          계속 작성하기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
