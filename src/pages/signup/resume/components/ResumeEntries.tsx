import { IconChevronDownLine } from '@karrotmarket/react-monochrome-icon';
import { AddButton } from '@/components/common/add-button';
import { Button } from '@/components/common/button';
import { TextArea } from '@/components/common/text-area';
import { TextField } from '@/components/common/text-field';
import type { SignupOption } from '@/types/Signup';
import { formatInputChange } from '@/utils/FormatInput';
import {
  type Answer,
  type Entry,
  type Experience,
  emptyExperience,
  hasExperienceInput,
  monthCount,
  newEntry,
  type ResumeEntryUpdate,
  resumeLimits,
  validAnswer,
  validExperience,
  validExperienceDates,
} from '../ResumeDraft';
import * as s from '../ResumeEditorPage.css';

type EntryListProps<T> = {
  entries: Entry<T>[];
  onChange: (update: ResumeEntryUpdate<T>) => void;
};

function actionsFor<T>(
  { onChange }: EntryListProps<T>,
  row: Entry<T>,
  valid: (value: T) => boolean,
) {
  const update = (apply: (entry: Entry<T>) => Entry<T>) =>
    onChange((entries) =>
      entries.map((entry) => (entry.id === row.id ? apply(entry) : entry)),
    );
  const remove = () =>
    onChange((entries) => entries.filter((entry) => entry.id !== row.id));
  return {
    change: (changes: Partial<T>) =>
      update((entry) => ({ ...entry, draft: { ...entry.draft, ...changes } })),
    edit: () => update((entry) => ({ ...entry, editing: true })),
    save: () =>
      update((entry) =>
        valid(entry.draft)
          ? { ...entry, saved: entry.draft, editing: false }
          : entry,
      ),
    cancel: () =>
      onChange((entries) =>
        entries.flatMap((entry) => {
          if (entry.id !== row.id) return [entry];
          return entry.saved
            ? [{ ...entry, draft: entry.saved, editing: false }]
            : [];
        }),
      ),
    remove,
  };
}

export function ExperienceEntries(props: EntryListProps<Experience>) {
  const { entries, onChange } = props;
  return (
    <div className={s.entries}>
      {entries.map((row, index) => {
        const { draft, saved } = row;
        const actions = actionsFor(props, row, validExperience);
        if (!row.editing && saved)
          return (
            <article key={row.id} className={s.summary}>
              <div className={s.itemHeading}>
                <h3>{saved.title}</h3>
                <Button variant='text' onClick={actions.edit}>
                  수정
                </Button>
              </div>
              <p className={s.meta}>
                <strong>{saved.role}</strong> · {saved.start} – {saved.end}　(
                {monthCount(saved.start, saved.end)}개월)
              </p>
              <p className={s.savedText}>{saved.description}</p>
            </article>
          );
        const dates = validExperienceDates(draft);
        const badStart = Boolean(draft.start) && !dates.start;
        const badEnd = Boolean(draft.end) && !dates.end;
        return (
          <div className={s.experience} key={row.id}>
            <div className={s.itemHeading}>
              <span>경험 {index + 1}</span>
              <Button variant='text' onClick={actions.cancel}>
                취소
              </Button>
            </div>
            <TextField
              label='경험 제목'
              required
              value={draft.title}
              placeholder='예) 프로젝트 · 인턴 · 동아리 활동'
              onChange={(e) => actions.change({ title: e.target.value })}
            />
            <div className={s.threeFields}>
              <TextField
                label='시작'
                required
                value={draft.start}
                placeholder='YYYY.MM'
                inputMode='numeric'
                error={badStart}
                onChange={(e) =>
                  actions.change({ start: formatInputChange(e, 'month') })
                }
              />
              <TextField
                label='종료'
                required
                value={draft.end}
                placeholder='YYYY.MM'
                inputMode='numeric'
                error={badEnd}
                onChange={(e) =>
                  actions.change({ end: formatInputChange(e, 'month') })
                }
              />
              <TextField
                label='역할'
                required
                value={draft.role}
                placeholder='예) 팀장'
                onChange={(e) => actions.change({ role: e.target.value })}
              />
            </div>
            {(badStart || badEnd) && (
              <p className={s.error}>
                기간은 YYYY.MM 형식으로, 종료일은 시작일 이후로 입력해주세요.
              </p>
            )}
            <TextArea
              label='내용'
              required
              maxLength={resumeLimits.textLength}
              value={draft.description}
              placeholder='무엇을 했고, 어떤 결과가 있었는지 적어 주세요'
              onChange={(e) => actions.change({ description: e.target.value })}
            />
            <div className={s.rowActions}>
              <Button
                variant='outline'
                disabled={!hasExperienceInput(row)}
                onClick={actions.remove}
              >
                삭제
              </Button>
              <Button disabled={!validExperience(draft)} onClick={actions.save}>
                저장
              </Button>
            </div>
          </div>
        );
      })}
      <AddButton
        className={s.add}
        onClick={() =>
          onChange((current) => [...current, newEntry(emptyExperience)])
        }
      >
        + 경험 추가
      </AddButton>
    </div>
  );
}

export function AnswerEntries(
  props: EntryListProps<Answer> & { questions: readonly SignupOption[] },
) {
  const { entries, onChange, questions } = props;
  const findNextQuestion = (current: Entry<Answer>[]) =>
    questions.find(
      ({ id }) => !current.some((row) => row.draft.questionId === id),
    );
  const nextQuestion = findNextQuestion(entries);
  return (
    <div className={s.entries}>
      {entries.map((row, index) => {
        const actions = actionsFor(props, row, validAnswer);
        const questionIndex = questions.findIndex(
          ({ id }) => id === row.draft.questionId,
        );
        const questionNumber = questionIndex + 1;
        const valid = validAnswer(row.draft);
        if (!row.editing && row.saved)
          return (
            <article key={row.id} className={s.summary}>
              <div className={s.itemHeading}>
                <h3>
                  문항 {questionNumber} · {questions[questionIndex]?.label}
                </h3>
                <Button variant='text' onClick={actions.edit}>
                  수정
                </Button>
              </div>
              <p className={s.savedText}>{row.saved.text}</p>
            </article>
          );
        return (
          <div key={row.id} className={s.answer}>
            <div className={s.selectWrap}>
              <select
                aria-label={`자기소개서 ${index + 1}번째 문항 선택`}
                value={row.draft.questionId}
                onChange={(e) => {
                  actions.change({ questionId: e.currentTarget.value });
                }}
              >
                {questions.map(({ id, label }, index) => (
                  <option
                    key={id}
                    value={id}
                    disabled={entries.some(
                      (other) =>
                        other.id !== row.id && other.draft.questionId === id,
                    )}
                  >
                    문항 {index + 1} · {label}
                  </option>
                ))}
              </select>
              <IconChevronDownLine size={18} aria-hidden='true' />
            </div>
            <TextArea
              aria-label={`문항 ${questionNumber} 답변`}
              value={row.draft.text}
              maxLength={resumeLimits.textLength}
              placeholder='문항을 선택하고 답변을 입력해 주세요.'
              onChange={(e) => actions.change({ text: e.target.value })}
            />
            {(row.saved || row.draft.text || entries.length > 1) && (
              <div className={s.rowActions}>
                <Button variant='outline' onClick={actions.remove}>
                  삭제
                </Button>
                <Button disabled={!valid} onClick={actions.save}>
                  저장
                </Button>
              </div>
            )}
          </div>
        );
      })}
      <AddButton
        className={s.add}
        disabled={!nextQuestion || entries.length >= resumeLimits.questions}
        onClick={() =>
          onChange((current) => {
            const question = findNextQuestion(current);
            if (!question || current.length >= resumeLimits.questions)
              return current;
            return [
              ...current,
              newEntry({ questionId: question.id, text: '' }),
            ];
          })
        }
      >
        + 문항 추가
      </AddButton>
    </div>
  );
}
