import { Button } from '@/components/common/button';
import { Dialog } from '@/components/common/dialog';
import * as styles from './ResumeSkipDialog.css';

type ResumeSkipDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ResumeSkipDialog({
  isOpen,
  onClose,
  onConfirm,
}: ResumeSkipDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      className={styles.dialog}
      closedby='closerequest'
      onCancel={onClose}
    >
      <Dialog.Header>여기까지만 작성할까요?</Dialog.Header>
      <Dialog.Description>
        자소서를 채울수록 면접관은 더 심화된 질문을 할 수 있어요.
        <br />
        자소서는 마이페이지에서 언제든 등록할 수 있어요.
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          size='large'
          display='block'
          variant='secondary'
          onClick={onClose}
        >
          좀 더 쓸게요
        </Button>
        <Button size='large' display='block' onClick={onConfirm}>
          완료
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
