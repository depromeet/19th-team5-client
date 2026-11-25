import type { ComponentPropsWithRef } from 'react';
import { avatar, image } from './avatar.css';

export type AvatarProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  imageUrl?: string | null;
  alt?: string;
};

export const Avatar = ({
  imageUrl,
  alt = '',
  className,
  ...props
}: AvatarProps) => {
  const src = imageUrl?.trim();
  const classNames = [avatar({ empty: !src }), className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...props}>
      {src && <img className={image} src={src} alt={alt} />}
    </span>
  );
};
