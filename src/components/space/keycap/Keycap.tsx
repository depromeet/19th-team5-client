import type { ComponentPropsWithRef } from 'react';
import { keycap } from './keycap.css';

type KeycapProps = ComponentPropsWithRef<'kbd'>;

/** 단축키 표시. 예) Space, Q */
export function Keycap({ className, ...props }: KeycapProps) {
  return (
    <kbd className={[keycap, className].filter(Boolean).join(' ')} {...props} />
  );
}
