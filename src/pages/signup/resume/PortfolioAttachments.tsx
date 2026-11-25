import {
  IconPaperclipLine,
  IconXmarkLine,
} from '@karrotmarket/react-monochrome-icon';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/common/button';
import { Tag } from '@/components/common/tag';
import { useResumeStore } from '../SignupLayout';
import * as s from './Resume.css';
import {
  bytesPerKb,
  bytesPerMb,
  hasPdfHeader,
  resumeLimits,
} from './ResumeDraft';

function formatFileSize(bytes: number) {
  if (bytes < bytesPerKb) return `${bytes}B`;
  if (bytes < bytesPerMb) return `${Number((bytes / bytesPerKb).toFixed(1))}KB`;
  return `${Number((bytes / bytesPerMb).toFixed(1))}MB`;
}
type Reading = { file: File; loaded: number };

export function PortfolioAttachments() {
  const files = useResumeStore((state) => state.draft.files);
  const beginAttachments = useResumeStore((state) => state.beginAttachments);
  const finishAttachment = useResumeStore((state) => state.finishAttachment);
  const clearPendingAttachments = useResumeStore(
    (state) => state.clearPendingAttachments,
  );
  const removeAttachment = useResumeStore((state) => state.removeAttachment);
  const input = useRef<HTMLInputElement>(null);
  const readers = useRef(new Map<File, FileReader>());
  const [reading, setReading] = useState<Reading[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const active = readers.current;
    return () => {
      for (const reader of active.values()) {
        reader.onload =
          reader.onprogress =
          reader.onabort =
          reader.onerror =
            null;
        reader.abort();
      }
      active.clear();
      clearPendingAttachments();
    };
  }, [clearPendingAttachments]);
  function attach(incoming: FileList | null) {
    if (!incoming?.length) return;
    const selected = Array.from(incoming);
    const batch = beginAttachments(selected);
    setError(batch.error);
    if (!batch.started) return;
    setReading(selected.map((file) => ({ file, loaded: 0 })));
    for (const file of selected) {
      const reader = new FileReader();
      readers.current.set(file, reader);
      const finish = (attached?: File) => {
        if (!readers.current.delete(file)) return;
        setReading((list) => list.filter((item) => item.file !== file));
        finishAttachment(attached);
      };
      reader.onprogress = (e) =>
        setReading((list) =>
          list.map((item) =>
            item.file === file ? { ...item, loaded: e.loaded } : item,
          ),
        );
      reader.onload = () => {
        if (hasPdfHeader(reader.result)) {
          finish(file);
          return;
        }
        setError('읽을 수 있는 PDF 파일을 선택해주세요.');
        finish();
      };
      const fail = () => {
        setError('파일을 읽지 못했어요. 다시 선택해주세요.');
        finish();
      };
      reader.onerror = fail;
      reader.onabort = () => finish();
      try {
        reader.readAsArrayBuffer(file);
      } catch {
        fail();
      }
    }
  }
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
          <Button
            variant='outline'
            onClick={() => readers.current.get(file)?.abort()}
          >
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
            onClick={() => {
              removeAttachment(file);
              setError('');
            }}
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
