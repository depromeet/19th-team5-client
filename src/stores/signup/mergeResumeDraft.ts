import {
  type Entry,
  type ResumeDraft,
  sameAttachment,
} from '@/pages/signup/resume/ResumeDraft';

export type ResumeDraftChange = { before: ResumeDraft; after: ResumeDraft };

function mergeEntry<T extends Record<string, string>>(
  stored: Entry<T>,
  before: Entry<T>,
  after: Entry<T>,
) {
  if (before === after) return stored;
  const draft = { ...stored.draft };
  const saved = after.saved === before.saved ? stored.saved : after.saved;
  let editing =
    after.editing === before.editing ? stored.editing : after.editing;
  for (const field in after.draft) {
    if (after.draft[field] !== before.draft[field])
      draft[field] = after.draft[field];
    if (saved && draft[field] !== saved[field]) editing = true;
  }
  return {
    ...stored,
    draft,
    saved,
    editing,
  };
}

function mergeEntries<T extends Record<string, string>>(
  stored: Entry<T>[],
  before: Entry<T>[],
  after: Entry<T>[],
) {
  if (before === after) return stored;
  const beforeById = new Map(before.map((entry) => [entry.id, entry]));
  const afterById = new Map(after.map((entry) => [entry.id, entry]));
  const storedIds = new Set(stored.map((entry) => entry.id));
  const merged = stored.flatMap((entry) => {
    const previous = beforeById.get(entry.id);
    if (!previous) return [entry];
    const changed = afterById.get(entry.id);
    return changed ? [mergeEntry(entry, previous, changed)] : [];
  });
  return [
    ...merged,
    ...after.filter(({ id }) => !beforeById.has(id) && !storedIds.has(id)),
  ];
}

function mergeAttachments(stored: File[], before: File[], after: File[]) {
  if (before === after) return stored;
  const removed = before.filter(
    (file) => !after.some((item) => sameAttachment(item, file)),
  );
  const added = after.filter(
    (file) => !before.some((item) => sameAttachment(item, file)),
  );
  return [
    ...stored.filter(
      (file) => !removed.some((item) => sameAttachment(item, file)),
    ),
    ...added.filter(
      (file) => !stored.some((item) => sameAttachment(item, file)),
    ),
  ];
}

export function mergeResumeDraft(
  stored: ResumeDraft,
  { before, after }: ResumeDraftChange,
): ResumeDraft {
  const changedCareer =
    before.careerId !== after.careerId ||
    before.hasSelectedCareer !== after.hasSelectedCareer;
  return {
    careerId: changedCareer ? after.careerId : stored.careerId,
    hasSelectedCareer: changedCareer
      ? after.hasSelectedCareer
      : stored.hasSelectedCareer,
    experiences: mergeEntries(
      stored.experiences,
      before.experiences,
      after.experiences,
    ),
    answers: mergeEntries(stored.answers, before.answers, after.answers),
    files: mergeAttachments(stored.files, before.files, after.files),
  };
}
