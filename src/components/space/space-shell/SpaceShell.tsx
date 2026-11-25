import type { ReactNode } from 'react';
import * as styles from './spaceShell.css';

type SpaceShellProps = {
  /** 화면 위쪽 GNB */
  header: ReactNode;
  /** 3D 씬 자리. 지금은 placeholder이고, 시안이 나오면 React Three Fiber 씬을 넣는다. */
  scene: ReactNode;
  /** 씬 위에 겹치는 HUD(참가자, 상태, 상호작용 안내, 하단 독 등) */
  children: ReactNode;
};

/**
 * 로비·대기실처럼 3D 공간 위에 HUD를 올리는 화면의 틀.
 * 씬 레이어와 HUD 레이어를 나눠 두어, 씬을 3D로 바꿔도 HUD 코드는 그대로 쓴다.
 */
export function SpaceShell({ header, scene, children }: SpaceShellProps) {
  return (
    <div className={styles.root}>
      {header}
      <main className={styles.stage}>
        <div className={styles.sceneLayer}>{scene}</div>
        <div className={styles.hudLayer}>{children}</div>
      </main>
    </div>
  );
}
