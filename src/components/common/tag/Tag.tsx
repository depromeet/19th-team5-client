import type { ComponentPropsWithRef } from 'react';
import { type TagVariants, tag } from './tag.css';

export type TagProps = ComponentPropsWithRef<'span'> & TagVariants;

export const Tag = ({ tone, className, children, ...props }: TagProps) => {
  const classNames = [tag({ tone }), className].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};
