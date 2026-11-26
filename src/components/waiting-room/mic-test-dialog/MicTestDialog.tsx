import { Button, Dialog, Pulse } from '@/components/common';
import { AvatarPortrait } from '@/components/interview';
import { useNow } from '@/hooks/common/useNow';
import type { RoomMicrophone } from '@/hooks/waiting-room/useRoomMicrophone';
import { formatTime } from '@/utils/formatTime';
import { secondsBetween } from '@/utils/time';
import { MicDeviceSelect } from './MicDeviceSelect';
import * as styles from './micTestDialog.css';

type MicTestDialogProps = {
  isOpen: boolean;
  microphone: RoomMicrophone;
  onComplete: () => void;
};

/**
 * 대기실에 들어오면 처음 보는 마이크 테스트.
 * 프로토타입에서는 답변 녹음 동의와 "내 목소리 들어보기"를 뺐다.
 */
export function MicTestDialog({
  isOpen,
  microphone,
  onComplete,
}: MicTestDialogProps) {
  const { status, stream, liveSince, devices, deviceId, inputLabel } =
    microphone;
  const isLive = status === 'live';
  const isMissing = status === 'no-device';
  const now = useNow(isOpen && isLive);
  const elapsedSeconds =
    liveSince === null ? 0 : secondsBetween(liveSince, now);

  return (
    <Dialog isOpen={isOpen} className={styles.dialog}>
      <Dialog.Header className={styles.centeredText}>
        아-아, 마이크 테스트
      </Dialog.Header>
      <Dialog.Description className={styles.centeredText}>
        “안녕하세요, 잘 부탁드립니다”라고 말해 보세요.
      </Dialog.Description>
      <Dialog.Body className={styles.body}>
        <div className={styles.micBox}>
          <AvatarPortrait size='stage' className={styles.avatar} />
          <p className={styles.status} aria-live='polite'>
            <span
              className={styles.statusDot}
              data-on={isLive}
              aria-hidden='true'
            />
            {isLive ? '듣고 있어요' : '마이크 연결 대기 중'}
            {isLive && (
              <span className={styles.elapsed} aria-hidden='true'>
                {formatTime(elapsedSeconds)}
              </span>
            )}
          </p>
          <div className={styles.waveGroup}>
            <div className={styles.wave}>
              <Pulse variant='waveform' stream={stream} />
            </div>
            {isMissing && (
              <p className={styles.helper}>
                마이크를 연결하면 자동으로 인식돼요
              </p>
            )}
          </div>
        </div>
        <MicDeviceSelect
          devices={devices}
          selectedId={deviceId}
          inputLabel={inputLabel}
          isMissing={isMissing}
          onSelect={microphone.selectDevice}
          onRetry={microphone.retry}
        />
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          size='large'
          display='block'
          disabled={!isLive}
          onClick={onComplete}
        >
          완료
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
