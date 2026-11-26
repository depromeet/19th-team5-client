import { useEffect, useId, useRef } from 'react';
import {
  QuestionSheet,
  type QuestionSheetProps,
} from '../question-sheet/QuestionSheet';
import * as styles from './questionSheetOverlay.css';

type QuestionSheetOverlayProps = Omit<
  QuestionSheetProps,
  'titleId' | 'onExit'
> & {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 면접관이 로비와 대기실에서 여는 2부 질문지. 페이지를 옮기지 않고 공간 위에 띄워
 * 3D 씬과 대기실 연결을 유지한다. 앞서 써 둔 질문을 그대로 불러온다.
 */
export function QuestionSheetOverlay({
  isOpen,
  onClose,
  ...sheetProps
}: QuestionSheetOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.overlay}
      aria-labelledby={titleId}
      closedby='none'
      // closedby를 모르는 브라우저에서도 Esc로 닫히지 않게 한다. 나갈 때는 저장 버튼을 쓴다.
      onCancel={(event) => event.preventDefault()}
    >
      {isOpen && (
        <QuestionSheet {...sheetProps} titleId={titleId} onExit={onClose} />
      )}
    </dialog>
  );
}
