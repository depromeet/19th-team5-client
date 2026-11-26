import {
  IconPaperclipLine,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { useRef, useState } from 'react';
import { Button } from '@/components/common/button';
import { Tag } from '@/components/common/tag';
import { useResumeAttachments } from '@/hooks/signup/useResumeAttachments';
import { formatFileSize, resumeLimits } from '@/utils/signup/resumeDraft';
import * as s from '../ResumeEditorPage.css';

export function PortfolioAttachments() {
  const { files, reading, error, attach, cancelRead, removeFile } =
    useResumeAttachments();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div className={s.uploads}>
      <input
        ref={input}
        type='file'
        accept='.pdf,application/pdf'
        multiple
        hidden
        onChange={(e) => {
          attach(e.currentTarget.files);
          e.currentTarget.value = '';
        }}
      />
      {!reading.length && files.length < resumeLimits.attachments && (
        <button
          type='button'
          className={s.drop}
          data-dragging={dragging}
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            attach(e.dataTransfer.files);
          }}
        >
          <span className={s.clip}>
            <IconPaperclipLine size={24} aria-hidden='true' />
          </span>
          이력서 · 포트폴리오 파일을 여기로 끌어다 놓으세요
          <span className={s.muted}>
            PDF · 파일당 {resumeLimits.attachmentSizeMb}MB ·{' '}
            {resumeLimits.attachments}개까지
          </span>
        </button>
      )}
      {reading.map(({ file, loaded }) => (
        <div
          key={file.name + file.lastModified + file.size}
          className={s.progressBox}
        >
          <strong>PDF·{file.name}</strong>
          <span>
            {formatFileSize(loaded)} / {formatFileSize(file.size)} · 첨부 중{' '}
            {file.size ? Math.round((loaded / file.size) * 100) : 0}%
          </span>
          <progress
            className={s.progress}
            value={loaded}
            max={file.size || 1}
            aria-label={`${file.name} 첨부 진행률`}
          />
          <Button variant='outline' onClick={() => cancelRead(file)}>
            첨부 취소
          </Button>
        </div>
      ))}
      {files.map((file) => (
        <div key={file.name + file.lastModified + file.size} className={s.file}>
          <Tag>PDF</Tag>
          <div>
            <p className={s.fileName}>{file.name}</p>
            <p className={s.status}>{formatFileSize(file.size)} · 첨부 완료</p>
          </div>
          <Button
            variant='text'
            className={s.removeFile}
            aria-label={`${file.name} 삭제`}
            onClick={() => removeFile(file)}
          >
            <IconXmarkLine size={20} aria-hidden='true' />
          </Button>
        </div>
      ))}
      {error && (
        <p role='alert' className={s.error}>
          {error}
        </p>
      )}
    </div>
  );
}
