import { Button } from '@/components/common/button';
import { Dialog } from '@/components/common/dialog';
import { helper } from '../../Signup.css';
import * as styles from './ResumeConfirmationDialog.css';

type ResumeConfirmationDialogProps = {
  isOpen: boolean;
  pending: boolean;
  failed: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ResumeConfirmationDialog({
  isOpen,
  pending,
  failed,
  onClose,
  onConfirm,
}: ResumeConfirmationDialogProps) {
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
      {failed && (
        <Dialog.Body className={helper} role='alert'>
          출입증을 발급하지 못했어요. 다시 시도해 주세요.
        </Dialog.Body>
      )}
      <Dialog.Footer>
        <Button
          size='large'
          display='block'
          variant='secondary'
          disabled={pending}
          onClick={onClose}
        >
          좀 더 쓸게요
        </Button>
        <Button
          size='large'
          display='block'
          disabled={pending}
          onClick={onConfirm}
        >
          {pending ? '출입증 발급 중…' : '완료'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
