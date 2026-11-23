import { useCallback, useState } from 'react';

/**
 * 열림·닫힘 상태를 관리한다. Dialog, Popover 등 요소 종류와 관계없이 쓴다.
 */
export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
