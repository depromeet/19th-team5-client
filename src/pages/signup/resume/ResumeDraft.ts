import type {
  ResumeAnswer,
  ResumeExperience,
  SignupOptions,
} from '@/types/Signup';

export type Experience = ResumeExperience;
export type Answer = ResumeAnswer;
export const resumeLimits = {
  textLength: 700,
  questions: 3,
  attachments: 2,
  attachmentSizeMb: 20,
} as const;
export const bytesPerKb = 1024;
export const bytesPerMb = bytesPerKb * 1024;

export const emptyExperience: Experience = {
  title: '',
  start: '',
  end: '',
  role: '',
  description: '',
};
export type Entry<T> = {
  id: string;
  saved: T | null;
  draft: T;
  editing: boolean;
};

export function newEntry<T>(value: T): Entry<T> {
  return { id: crypto.randomUUID(), saved: null, draft: value, editing: true };
}

function validMonth(value: string) {
  return /^\d{4}\.(0[1-9]|1[0-2])$/.test(value);
}

export function monthCount(start: string, end: string) {
  const asMonths = (date: string) =>
    Number(date.slice(0, 4)) * 12 + Number(date.slice(5));
  return asMonths(end) - asMonths(start) + 1;
}

export function validExperienceDates({ start, end }: Experience) {
  const startValid = validMonth(start);
  return {
    start: startValid,
    end: validMonth(end) && (!startValid || end >= start),
  };
}

export function validExperience(e: Experience) {
  const dates = validExperienceDates(e);
  return Boolean(
    e.title.trim() &&
      e.role.trim() &&
      validResumeText(e.description) &&
      dates.start &&
      dates.end,
  );
}

function validResumeText(text: string) {
  return text.trim().length > 0 && text.length <= resumeLimits.textLength;
}

export function validAnswer(answer: Answer) {
  return validResumeText(answer.text);
}

export function hasExperienceInput(row: Entry<Experience>) {
  return row.saved !== null || Object.values(row.draft).some(Boolean);
}

export function hasAnswerInput(row: Entry<Answer>) {
  return row.saved !== null || row.draft.text.length > 0;
}

function sameAttachment(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  );
}

export function validateAttachments(files: File[], selected: File[]) {
  if (files.length + selected.length > resumeLimits.attachments)
    return `PDF는 최대 ${resumeLimits.attachments}개까지 첨부할 수 있어요.`;
  if (selected.some((file) => !/\.pdf$/i.test(file.name)))
    return 'PDF 파일만 첨부할 수 있어요.';
  if (
    selected.some(
      (file) => file.size > resumeLimits.attachmentSizeMb * bytesPerMb,
    )
  )
    return `파일당 ${resumeLimits.attachmentSizeMb}MB 이하의 PDF를 선택해주세요.`;
  if (
    selected.some((file, index) =>
      [...files, ...selected.slice(0, index)].some((existing) =>
        sameAttachment(file, existing),
      ),
    )
  )
    return '이미 선택한 파일이에요.';
  return '';
}

export function hasPdfHeader(result: FileReader['result']) {
  return (
    result instanceof ArrayBuffer &&
    new TextDecoder().decode(result.slice(0, 1024)).includes('%PDF-')
  );
}

export type ResumeDraft = {
  careerId: string;
  experiences: Entry<Experience>[];
  answers: Entry<Answer>[];
  files: File[];
};
export function createResumeDraft({
  defaultCareerId,
  questions,
}: SignupOptions): ResumeDraft {
  return {
    careerId: defaultCareerId,
    experiences: [newEntry(emptyExperience)],
    answers: questions.length
      ? [newEntry({ questionId: questions[0].id, text: '' })]
      : [],
    files: [],
  };
}
