import { IconILowercaseSerifCircleLine } from '@karrotmarket/react-monochrome-icon';
import type { ReactNode } from 'react';
import * as styles from '../Signup.css';

type SignupStepProps = {
  title: string;
  notice: string;
  preview: ReactNode;
  previewClassName?: string;
  children: ReactNode;
};

export function SignupStep({
  title,
  notice,
  preview,
  previewClassName,
  children,
}: SignupStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.notice}>
          <IconILowercaseSerifCircleLine
            className={styles.noticeIcon}
            size={20}
            aria-hidden='true'
          />
          {notice}
        </p>
      </div>
      <div className={previewClassName ?? styles.preview}>{preview}</div>
      {children}
    </div>
  );
}
