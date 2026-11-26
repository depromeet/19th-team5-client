import { Button, Dialog } from '@/components/common';
import * as styles from './micPermissionDialog.css';

const steps = [
  '주소창 왼쪽 자물쇠 아이콘을 눌러요',
  '마이크를 “허용”으로 바꿔요',
  '아래 버튼으로 다시 확인해요',
];

type MicPermissionDialogProps = {
  isOpen: boolean;
  isChecking: boolean;
  onRetry: () => void;
};

/** 브라우저 마이크 권한이 꺼져 있을 때. 권한을 켠 뒤 다시 확인하면 마이크 테스트로 돌아간다. */
export function MicPermissionDialog({
  isOpen,
  isChecking,
  onRetry,
}: MicPermissionDialogProps) {
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Header className={styles.centeredText}>
        마이크 권한이 꺼져 있어요
      </Dialog.Header>
      <Dialog.Description className={styles.centeredText}>
        면접에 참여하려면 마이크가 꼭 필요해요.
      </Dialog.Description>
      <Dialog.Body>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden='true'>
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          size='large'
          display='block'
          disabled={isChecking}
          onClick={onRetry}
        >
          다시 확인하기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
