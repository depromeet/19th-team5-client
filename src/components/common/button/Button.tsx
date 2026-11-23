import type { ComponentPropsWithRef } from 'react';
import { type ButtonVariants, button } from './button.css';

export type ButtonProps = ComponentPropsWithRef<'button'> & ButtonVariants;

export const Button = ({
  type = 'button',
  variant,
  size,
  display,
  className,
  children,
  ...props
}: ButtonProps) => {
  const classNames = [button({ variant, size, display }), className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  );
};
