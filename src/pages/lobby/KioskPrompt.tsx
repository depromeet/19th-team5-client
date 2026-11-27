import {
  InteractionPrompt,
  ScreenAnchored,
  type ScreenInset,
} from '@/components/space';
import { shortcuts } from '@/constants/space/shortcuts';
import type { ScreenAnchor } from '@/utils/space/screenAnchor';
import * as styles from './lobbyPage.css';

type KioskPromptProps = {
  /** 3D 씬이 알려주는 키오스크 위 화면 좌표 */
  anchor: ScreenAnchor;
  /** 내 캐릭터가 키오스크 앞에 있는지. 멀리 있으면 흐리게 보여 어디로 가면 되는지만 알려준다. */
  isNear: boolean;
  onUse: () => void;
};

/**
 * 키오스크 안내가 키오스크를 따라 움직일 때 비워 둘 화면 가장자리(px).
 * 아래는 월드 채팅(bottom 32px · 높이 56px)을 피한다.
 */
const kioskPromptInset: ScreenInset = {
  top: 24,
  right: 24,
  bottom: 104,
  left: 24,
};

/** 예약 키오스크 사용 안내. 키오스크를 지나치지 않도록 늘 키오스크 위에 두고, 가까이 가야 누를 수 있다. */
export function KioskPrompt({ anchor, isNear, onUse }: KioskPromptProps) {
  return (
    <ScreenAnchored
      anchor={anchor}
      fallbackClassName={styles.kioskPrompt}
      inset={kioskPromptInset}
    >
      <InteractionPrompt
        shortcut={shortcuts.interact}
        label='예약 키오스크 사용하기'
        disabled={!isNear}
        onClick={onUse}
      />
    </ScreenAnchored>
  );
}
