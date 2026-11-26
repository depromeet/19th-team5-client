import { useState } from 'react';
import { Button, Dialog, Timer } from '@/components/common';
import { useCountdown } from '@/hooks/common/useCountdown';
import * as styles from './connectionLostDialog.css';

type ConnectionLostDialogProps = {
  /** 연결이 끊긴 뒤 다시 들어올 수 있는 시간(초) */
  rejoinSeconds: number;
  onLeave: () => void;
  onReconnect: () => void;
};

/**
 * 대기실 연결이 끊겼을 때. 열릴 때마다 다시 들어올 수 있는 시간을 처음부터 센다.
 * 연결이 돌아오면 상위에서 닫는다.
 */
export function ConnectionLostDialog({
  rejoinSeconds,
  onLeave,
  onReconnect,
}: ConnectionLostDialogProps) {
  const [openedAt] = useState(Date.now);
  const remainingSeconds = useCountdown(rejoinSeconds, openedAt);

  return (
    <Dialog isOpen>
      <Dialog.Header className={styles.centeredText}>
        앗, 연결이 끊겼어요
      </Dialog.Header>
      <Dialog.Description className={styles.centeredText}>
        연결되면 대기실로 다시 돌아가요.
      </Dialog.Description>
      <Dialog.Body>
        <div className={styles.rejoin}>
          <span>다시 들어올 수 있는 시간</span>
          <Timer tone='live' seconds={remainingSeconds} />
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          variant='secondary'
          size='large'
          className={styles.leaveButton}
          onClick={onLeave}
        >
          대기실 나가기
        </Button>
        <Button size='large' display='block' onClick={onReconnect}>
          다시 연결하기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
