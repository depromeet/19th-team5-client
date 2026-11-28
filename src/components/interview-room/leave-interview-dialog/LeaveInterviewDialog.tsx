import { Button, Dialog } from '@/components/common';
import * as styles from './leaveInterviewDialog.css';

type LeaveInterviewDialogProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/** 면접 도중 하단 독의 나가기 버튼을 누르면 정말 나갈지 묻는다. 확인하면 상위에서 로비로 보낸다. */
export function LeaveInterviewDialog({
  isOpen,
  onCancel,
  onConfirm,
}: LeaveInterviewDialogProps) {
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header className={styles.centeredText}>
        면접에서 나갈까요?
      </Dialog.Header>
      <Dialog.Description className={styles.centeredText}>
        지금 나가면 진행 중인 면접에 다시 들어올 수 없어요.
      </Dialog.Description>
      <Dialog.Footer className={styles.actions}>
        <Button variant='secondary' size='large' onClick={onCancel}>
          취소
        </Button>
        <Button size='large' onClick={onConfirm}>
          확인
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
