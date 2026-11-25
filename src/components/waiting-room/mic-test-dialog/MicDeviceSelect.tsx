import {
  IconCheckmarkLine,
  IconChevronRightLine,
} from '@karrotmarket/react-monochrome-icon';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import {
  type MicDevice,
  systemDefaultDeviceId,
} from '@/hooks/waiting-room/useRoomMicrophone';
import * as styles from './micDeviceSelect.css';

type MicDeviceSelectProps = {
  devices: readonly MicDevice[];
  selectedId: string;
  /** 실제로 입력 중인 장치 이름 */
  inputLabel: string;
  /** 연결된 마이크가 없으면 목록 대신 다시 찾기를 한다. */
  isMissing: boolean;
  onSelect: (deviceId: string) => void;
  onRetry: () => void;
};

/** 마이크 테스트의 입력 장치 줄. 누르면 장치 목록이 열린다. */
export function MicDeviceSelect({
  devices,
  selectedId,
  inputLabel,
  isMissing,
  onSelect,
  onRetry,
}: MicDeviceSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const canOpen = !isMissing && devices.length > 0;
  // 시스템 기본값이면 지금 실제로 쓰는 마이크 이름을 보여준다.
  const selectedName =
    selectedId === systemDefaultDeviceId && inputLabel
      ? inputLabel
      : (devices.find(({ id }) => id === selectedId)?.label ?? '시스템 기본값');

  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector<HTMLButtonElement>('[aria-selected="true"]')
      ?.focus();

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        rootRef.current?.contains(event.target)
      ) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      // 마이크 테스트 다이얼로그까지 닫히지 않게 막는다.
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === 'Tab') {
      setIsOpen(false);
      return;
    }

    const options = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        [],
    );
    const active = document.activeElement;
    const current =
      active instanceof HTMLButtonElement ? options.indexOf(active) : -1;
    const next = {
      ArrowDown: Math.min(current + 1, options.length - 1),
      ArrowUp: Math.max(current - 1, 0),
      Home: 0,
      End: options.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    options[next]?.focus();
  }

  return (
    <div ref={rootRef} className={styles.deviceSelect}>
      <button
        ref={triggerRef}
        type='button'
        className={styles.deviceRow}
        aria-haspopup={canOpen ? 'listbox' : undefined}
        aria-expanded={canOpen ? isOpen : undefined}
        aria-controls={isOpen ? listId : undefined}
        onClick={() => (canOpen ? setIsOpen(!isOpen) : onRetry())}
      >
        <span className={styles.deviceTexts}>
          <span className={styles.deviceName} data-missing={isMissing}>
            {isMissing ? '연결된 마이크가 없어요' : selectedName}
          </span>
          <span className={styles.deviceHint}>
            {isMissing ? '마이크를 연결하고 다시 선택해 주세요' : '입력 장치'}
          </span>
        </span>
        <IconChevronRightLine size={16} aria-hidden='true' />
      </button>
      {isOpen && (
        <div
          ref={listRef}
          id={listId}
          className={styles.deviceList}
          role='listbox'
          aria-label='입력 장치'
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {devices.map(({ id, label }) => {
            const isSelected = id === selectedId;
            return (
              <button
                key={id}
                type='button'
                role='option'
                className={styles.deviceOption}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  onSelect(id);
                  close();
                }}
              >
                <span className={styles.deviceOptionLabel}>{label}</span>
                {isSelected && (
                  <IconCheckmarkLine size={16} aria-hidden='true' />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
