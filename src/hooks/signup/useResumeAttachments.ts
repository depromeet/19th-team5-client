import { useEffect, useRef, useState } from 'react';
import { hasPdfHeader } from '@/utils/signup/resumeDraft';
import { useResumeStore } from './useSignupContext';

type Reading = { file: File; loaded: number };

export function useResumeAttachments() {
  const files = useResumeStore((state) => state.draft.files);
  const beginAttachments = useResumeStore((state) => state.beginAttachments);
  const finishAttachment = useResumeStore((state) => state.finishAttachment);
  const clearPendingAttachments = useResumeStore(
    (state) => state.clearPendingAttachments,
  );
  const removeAttachment = useResumeStore((state) => state.removeAttachment);
  const readers = useRef(new Map<File, FileReader>());
  const [reading, setReading] = useState<Reading[]>([]);
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
      reader.onprogress = (event) =>
        setReading((list) =>
          list.map((item) =>
            item.file === file ? { ...item, loaded: event.loaded } : item,
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

  function cancelRead(file: File) {
    readers.current.get(file)?.abort();
  }

  function removeFile(file: File) {
    removeAttachment(file);
    setError('');
  }

  return { files, reading, error, attach, cancelRead, removeFile };
}
