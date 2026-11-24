import type { ComponentPropsWithRef } from 'react';
import * as styles from './floatingCard.css';

export type FloatingCardProps = ComponentPropsWithRef<'aside'>;

function FloatingCardRoot({ className, ...props }: FloatingCardProps) {
  return (
    <aside
      {...props}
      className={[styles.card, className].filter(Boolean).join(' ')}
    />
  );
}

function FloatingCardBody({
  children,
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={[styles.body, className].filter(Boolean).join(' ')}
    >
      <div className={styles.bodyContent}>{children}</div>
    </div>
  );
}

function FloatingCardFooter({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={[styles.footer, className].filter(Boolean).join(' ')}
    />
  );
}

export const FloatingCard = Object.assign(FloatingCardRoot, {
  Body: FloatingCardBody,
  Footer: FloatingCardFooter,
});
