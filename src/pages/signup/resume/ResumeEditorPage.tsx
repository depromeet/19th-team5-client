import { IconILowercaseSerifCircleLine } from '@karrotmarket/react-monochrome-icon';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Avatar } from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import { Radio } from '@/components/common/radio';
import { signupPaths } from '@/constants/common/paths';
import { useSignupCompletion } from '@/hooks/signup/useSignupCompletion';
import { canRegisterResume } from '@/stores/ResumeStore';
import { isComplete } from '../AvatarDraft';
import * as signup from '../Signup.css';
import {
  useAvatarDraft,
  useResumeStore,
  useSignupOptions,
  useSyncResumeDraft,
} from '../SignupLayout';
import { PortfolioAttachments } from './components/PortfolioAttachments';
import { ResumeConfirmationDialog } from './components/ResumeConfirmationDialog';
import { AnswerEntries, ExperienceEntries } from './components/ResumeEntries';
import { ResumeSection } from './components/ResumeSection';
import {
  getResumeLimitError,
  getSubmittableEntry,
  hasAnswerInput,
  hasExperienceInput,
  resumeLimits,
  validAnswer,
  validExperience,
} from './ResumeDraft';
import * as s from './ResumeEditorPage.css';

export function ResumeEditorPage() {
  const [avatar] = useAvatarDraft();
  const { careers, questions } = useSignupOptions();
  const resume = useResumeStore((state) => state.draft);
  const pendingFiles = useResumeStore((state) => state.pendingFiles);
  const setCareer = useResumeStore((state) => state.setCareer);
  const setExperiences = useResumeStore((state) => state.setExperiences);
  const setAnswers = useResumeStore((state) => state.setAnswers);
  const prepareRegistration = useResumeStore(
    (state) => state.prepareRegistration,
  );
  const ready = useResumeStore(canRegisterResume);
  const [confirmation, setConfirmation] = useState<'register' | 'skip' | null>(
    null,
  );
  const completion = useSignupCompletion();
  const syncResumeDraft = useSyncResumeDraft();
  const registrationSync = useMutation({ mutationFn: syncResumeDraft });
  const pending = registrationSync.isPending || completion.isPending;
  const { state } = useLocation();
  if (!isComplete(avatar))
    return <Navigate to={signupPaths.avatar} state={state} replace />;
  const experienceCount = resume.experiences.filter((entry) =>
    getSubmittableEntry(entry, validExperience),
  ).length;
  const answers = resume.answers.flatMap(
    (entry) => getSubmittableEntry(entry, validAnswer) ?? [],
  );
  const answerCount = answers.length;
  const limitError = getResumeLimitError(resume, answers);
  const fileCount = resume.files.length;
  const score = Math.min(
    5,
    experienceCount + answerCount + Math.min(1, fileCount),
  );
  function confirm() {
    if (!isComplete(avatar) || !confirmation || pending) return;
    if (confirmation === 'skip') {
      completion.complete(avatar);
      return;
    }
    registrationSync.mutate(undefined, {
      onSuccess: () => {
        const registration = prepareRegistration();
        if (!registration) {
          setConfirmation(null);
          return;
        }
        completion.complete(
          { ...avatar, resume: registration.submission },
          registration.commit,
        );
      },
    });
  }
  function closeConfirmation() {
    if (pending) return;
    registrationSync.reset();
    completion.reset();
    setConfirmation(null);
  }
  const checks = [
    [
      '지원 정보',
      resume.hasSelectedCareer ? '완료' : '미작성',
      resume.hasSelectedCareer,
    ],
    ['경험 · 경력', `${experienceCount}개`, experienceCount > 0],
    ['자기소개서', `${answerCount}개`, answerCount > 0],
    ['포트폴리오 · 첨부', `선택 · ${fileCount}개`, fileCount > 0],
  ] as const;
  return (
    <div className={s.background}>
      <div className={s.layout}>
        <div className={s.paper}>
          <h1 className={signup.title}>경험을 쓸수록 질문이 날카로워져요</h1>
          <p className={signup.notice}>
            <IconILowercaseSerifCircleLine
              className={signup.noticeIcon}
              size={20}
              aria-hidden='true'
            />
            면접관이 이 내용을 보고 2부 질문을 만들어요. 안 채워도 면접은 볼 수
            있어요.
          </p>
          <ResumeSection
            title='경험 · 경력'
            count={`${resume.experiences.filter(hasExperienceInput).length}개`}
          >
            <p className={s.help}>
              프로젝트 · 인턴 · 동아리 활동 등을 하나씩 추가해요. 추가할수록
              아래로 늘어나요.
            </p>
            <ExperienceEntries
              entries={resume.experiences}
              onChange={setExperiences}
            />
          </ResumeSection>
          <ResumeSection
            title='자기소개서'
            count={`문항 ${resume.answers.filter(hasAnswerInput).length}개`}
          >
            <p className={s.help}>
              기본 문항 {questions.length}개 중 최대 {resumeLimits.questions}
              개를 골라 답을 적어요.
            </p>
            <AnswerEntries
              entries={resume.answers}
              onChange={setAnswers}
              questions={questions}
            />
          </ResumeSection>
          <ResumeSection
            title='포트폴리오 · 첨부파일'
            count={`${fileCount + pendingFiles} / ${resumeLimits.attachments}`}
            optional
          >
            <PortfolioAttachments />
          </ResumeSection>
        </div>
        <aside className={s.sidebar} aria-label='이력서 작성 현황'>
          <div className={s.sideCard}>
            <div className={s.profile}>
              <Avatar
                imageUrl={`/images/signup/${avatar.avatar}-profile.png`}
              />
              {avatar.nickname}
            </div>
            <fieldset className={s.radios}>
              <legend>
                경력 구분{' '}
                <span className={s.star} aria-hidden='true'>
                  *
                </span>
              </legend>
              {careers.map(({ id, label }) => {
                const checked = resume.careerId === id;
                const confirmCareer = () => {
                  if (checked && !resume.hasSelectedCareer) setCareer(id);
                };
                return (
                  <Radio
                    key={id}
                    name='career'
                    value={id}
                    checked={checked}
                    onChange={() => setCareer(id)}
                    onClick={confirmCareer}
                    onKeyUp={(event) => {
                      if (event.key === ' ') confirmCareer();
                    }}
                  >
                    {label}
                  </Radio>
                );
              })}
            </fieldset>
          </div>
          <div className={s.sideCard}>
            <div className={s.qualityHeader}>
              예상 질문 퀄리티
              <strong>
                {score === 0 ? '낮음' : score < 3 ? '보통' : '좋음'}
              </strong>
            </div>
            <meter
              className={signup.visuallyHidden}
              aria-label='예상 질문 퀄리티'
              min={0}
              max={5}
              value={score}
            />
            <div className={s.meter} aria-hidden='true'>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} data-on={n <= score} />
              ))}
            </div>
            <div className={s.meterLegend}>
              <span>공통 질문 위주</span>
              <span>내 경험 맞춤 질문</span>
            </div>
            <div className={s.hint}>
              <strong>자소서가 왜 필요하나요?</strong>경험과 자기소개서를 채우면
              맞춤 질문이 준비돼요
            </div>
            <ul className={s.checklist}>
              {checks.map(([name, detail, checked]) => (
                <li key={name}>
                  <Checkbox
                    disabled
                    checked={checked}
                    aria-label={`${name} 작성 여부`}
                  />
                  {name}
                  <small>{detail}</small>
                </li>
              ))}
            </ul>
            {limitError && (
              <p className={s.error} role='alert'>
                {limitError}
              </p>
            )}
            <Button
              size='large'
              display='block'
              disabled={!ready}
              onClick={() => setConfirmation('register')}
            >
              등록하고 시작하기
            </Button>
            <Button
              size='large'
              display='block'
              variant='outline'
              onClick={() => setConfirmation('skip')}
            >
              건너뛰기
            </Button>
          </div>
        </aside>
      </div>
      <ResumeConfirmationDialog
        isOpen={confirmation !== null}
        pending={pending}
        failed={registrationSync.isError || completion.isError}
        onClose={closeConfirmation}
        onConfirm={confirm}
      />
    </div>
  );
}
