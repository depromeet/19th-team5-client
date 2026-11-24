import {
  IconBracketLeftArrowRightLine,
  IconMicrophoneFill,
  IconMicrophoneSlashFill,
} from '@karrotmarket/react-monochrome-icon';
import { useState } from 'react';
import {
  BottomSheet,
  type BottomSheetCandidate,
  Button,
} from '@/components/common';
import { useDisclosure } from '@/hooks/useDisclosure';
import * as shared from './bottomSheetStory.css';
import * as styles from './interviewQuestionExample.css';
import { QuestionNavigation } from './QuestionNavigation';

type Part = 'common' | 'custom' | 'free';
type Mic = 'speaking' | 'on' | 'off';
type Notes = Partial<Record<string, Record<string, string>>>;

const questions = {
  common: {
    category: '경험 질문',
    total: 12,
    startNumber: 2,
    items: [
      {
        title: '팀 프로젝트에서 맡은 역할과 기여한 성과는 무엇인가요?',
        intent: '본인의 역할과 성과를 구체적으로 설명하는지 봐요.',
      },
      {
        title: '다른 사람에게 도움을 받아 성과를 낸 경험이 있나요?',
        intent: '도움을 요청하고 감사할 줄 아는 협업 태도를 봐요.',
      },
      {
        title: '받은 피드백을 어떻게 다음 작업에 반영했나요?',
        intent: '피드백을 받아들여 개선하는 과정을 봐요.',
      },
    ],
  },
  custom: {
    category: '커스텀 질문',
    total: 3,
    startNumber: 1,
    items: [
      {
        title: '실험을 설계할 때 가설과 지표를 어떻게 정했나요?',
        intent: '검증할 가설과 판단 기준을 구체적으로 세우는지 봐요.',
      },
      {
        title: 'A/B 테스트 결과가 예상과 달랐다면 어떻게 했을까요?',
        intent: '가설을 세우고 결과를 해석하는 방식을 봐요.',
      },
      {
        title: '표본이 충분하지 않을 때 실험 결과를 어떻게 해석하나요?',
        intent: '데이터의 한계를 고려하는지 봐요.',
      },
    ],
  },
};

const pastNotes: Notes = {
  A: {
    '1부 Q2':
      '결론부터 말해서 좋았음. 다만 팀 프로젝트에서 본인이 맡은 역할이 흐릿하게 들림. 3부에서 기여한 부분을 수치로 다시 물어보기.',
    '1부 Q3':
      '선배에게 피드백을 요청한 과정이 구체적이었음. 감사 표현까지 언급해서 협업 태도가 좋아 보임.',
    '2부 Q1':
      '가설 설정은 명확했으나 결과 해석에서 표본 크기 언급이 없었음. 실패 원인을 데이터로 설명하는지 꼬리질문으로 확인 필요.',
  },
};

function MicrophoneControls({
  mic,
  onToggle,
  onExit,
}: {
  mic: Mic;
  onToggle: () => void;
  onExit: () => void;
}) {
  const isOn = mic !== 'off';
  return (
    <div className={styles.microphoneControls}>
      <Button
        className={styles.iconButton}
        variant={isOn ? 'danger' : 'secondary'}
        aria-label='마이크'
        aria-pressed={isOn}
        onClick={onToggle}
      >
        {mic === 'speaking' ? (
          <svg aria-hidden='true' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              d='M3 10v4 M7.5 7v10 M12 3v18 M16.5 7v10 M21 10v4'
            />
          </svg>
        ) : isOn ? (
          <IconMicrophoneFill aria-hidden='true' size={24} />
        ) : (
          <IconMicrophoneSlashFill aria-hidden='true' size={24} />
        )}
      </Button>
      <span className={styles.micStatus} data-on={isOn}>
        마이크 {isOn ? '켜짐' : '꺼짐'}
      </span>
      <Button
        className={styles.iconButton}
        variant='secondary'
        onClick={onExit}
        aria-label='면접관 질문 카드 닫기'
      >
        <IconBracketLeftArrowRightLine aria-hidden='true' size={24} />
      </Button>
    </div>
  );
}

export function InterviewQuestionExample({
  candidates,
  initialPart,
  initialMic,
}: {
  candidates: readonly BottomSheetCandidate[];
  initialPart?: Part;
  initialMic?: Mic;
}) {
  const { isOpen, open, close } = useDisclosure(
    initialPart !== undefined || initialMic !== undefined,
  );
  const [part, setPart] = useState<Part>(initialPart ?? 'common');
  const [mic, setMic] = useState<Mic>(
    initialMic ?? (part === 'common' ? 'speaking' : 'off'),
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    candidates[0]?.id ?? null,
  );
  const [questionIndex, setQuestionIndex] = useState(1);
  const [saved, setSaved] = useState<Notes>(() => {
    if (part !== 'common') return pastNotes;
    return { A: { ...pastNotes.A, '1부 Q3': '' } };
  });
  const [drafts, setDrafts] = useState<Notes>({
    A: { '2부 Q2': '지표 정의가 명확함. 가설을 먼저 말하는지 확인하기' },
  });
  const questionSet = part === 'free' ? undefined : questions[part];
  const question = questionSet?.items[questionIndex];
  const number = (questionSet?.startNumber ?? 0) + questionIndex;
  const noteKey =
    part === 'free' ? '3부 메모' : `${part === 'common' ? 1 : 2}부 Q${number}`;
  const candidateId = candidates.some(({ id }) => id === selectedId)
    ? selectedId
    : (candidates[0]?.id ?? null);
  if (candidateId !== selectedId) setSelectedId(candidateId);

  const candidateNotes = candidateId === null ? undefined : saved[candidateId];
  const savedNote = candidateNotes?.[noteKey] ?? '';
  const draft =
    candidateId === null ? '' : (drafts[candidateId]?.[noteKey] ?? savedNote);
  const canSave = candidateId !== null && draft.trim() !== savedNote;
  const history = Object.entries(candidateNotes ?? {}).filter(
    ([key, text]) => key !== '3부 메모' && text.length > 0,
  );

  function changePart(next: Part) {
    setPart(next);
    setMic(next === 'common' ? 'speaking' : 'off');
  }

  return (
    <>
      <Button onClick={open}>면접관 질문 열기</Button>
      <BottomSheet
        isOpen={isOpen}
        onRequestClose={close}
        aria-label='면접관 질문 카드'
      >
        <BottomSheet.Header>
          <div className={shared.headerRow}>
            <BottomSheet.CandidateTabs
              candidates={candidates}
              selectedId={candidateId}
              onSelect={setSelectedId}
            />
            {part === 'custom' && (
              <Button variant='secondary' onClick={() => changePart('free')}>
                2부 건너뛰기
              </Button>
            )}
            {part === 'free' && (
              <Button variant='danger' onClick={close}>
                면접 마치기
              </Button>
            )}
          </div>
        </BottomSheet.Header>
        <BottomSheet.Body
          sidebar={
            <div className={styles.memoColumn}>
              <div className={styles.memoField}>
                <textarea
                  className={styles.memo}
                  aria-label='면접 메모'
                  placeholder={
                    part === 'free'
                      ? '3부 메모 · 꼬리질문과 답변을 적어 두세요'
                      : `${mic === 'on' ? 'QA2.' : 'Q1.'}\n답변을 들으며 떠오른 점을 적어 두세요`
                  }
                  maxLength={100}
                  disabled={candidateId === null}
                  value={draft}
                  onChange={(event) => {
                    if (candidateId === null) return;
                    const value = event.currentTarget.value;
                    setDrafts((previous) => ({
                      ...previous,
                      [candidateId]: {
                        ...previous[candidateId],
                        [noteKey]: value,
                      },
                    }));
                  }}
                />
                {part !== 'common' && (
                  <span className={styles.counter}>{draft.length} / 100</span>
                )}
              </div>
              <Button
                className={styles.saveButton}
                size='large'
                variant={canSave ? 'primary' : 'secondary'}
                disabled={!canSave}
                onClick={() => {
                  if (candidateId === null) return;
                  setSaved((previous) => ({
                    ...previous,
                    [candidateId]: {
                      ...previous[candidateId],
                      [noteKey]: draft.trim(),
                    },
                  }));
                }}
              >
                저장
              </Button>
            </div>
          }
        >
          <BottomSheet.Panel>
            <div className={styles.questionCard}>
              {question && questionSet ? (
                <>
                  <QuestionNavigation
                    category={questionSet.category}
                    position={`${number} / ${questionSet.total}`}
                    onPrevious={
                      questionIndex > 0
                        ? () => setQuestionIndex(questionIndex - 1)
                        : undefined
                    }
                    onNext={
                      questionIndex < questionSet.items.length - 1
                        ? () => setQuestionIndex(questionIndex + 1)
                        : undefined
                    }
                  />
                  <h3 className={shared.question}>{question.title}</h3>
                  <p className={styles.intent}>
                    {(part === 'custom' || mic === 'on') && '의도 · '}
                    {question.intent}
                  </p>
                </>
              ) : (
                <>
                  <div className={styles.historyHeading}>
                    <h3 className={styles.historyTitle}>지난 메모</h3>
                    <span>1·2부에서 적은 메모예요</span>
                  </div>
                  <div className={styles.historyScroll}>
                    {history.length ? (
                      <ul className={styles.historyList}>
                        {history.map(([label, note]) => (
                          <li key={label} className={styles.historyItem}>
                            <span className={styles.noteLabel}>{label}</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.intent}>저장된 메모가 없습니다.</p>
                    )}
                  </div>
                </>
              )}
              <MicrophoneControls
                mic={mic}
                onToggle={() => setMic(mic === 'off' ? 'on' : 'off')}
                onExit={close}
              />
            </div>
          </BottomSheet.Panel>
        </BottomSheet.Body>
      </BottomSheet>
    </>
  );
}
