import type { ReactNode } from 'react';
import { Tag } from '@/components/common/tag';
import * as s from '../ResumeEditorPage.css';

export function ResumeSection({
  title,
  count,
  optional = false,
  children,
}: {
  title: string;
  count: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={s.section}>
      <div className={s.sectionTitle}>
        <h2>
          {title}{' '}
          {!optional && (
            <span aria-hidden='true' className={s.star}>
              *
            </span>
          )}
        </h2>
        {optional && <Tag tone='outline'>선택</Tag>}
        <span className={s.number}>{count}</span>
      </div>
      {children}
    </section>
  );
}
