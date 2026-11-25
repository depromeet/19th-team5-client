import { IconILowercaseSerifCircleLine } from '@karrotmarket/react-monochrome-icon';
import { type ReactNode, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Avatar } from '@/components/common/avatar';
import { Button } from '@/components/common/button';
import { Checkbox } from '@/components/common/checkbox';
import { Dialog } from '@/components/common/dialog';
import { Radio } from '@/components/common/radio';
import { Tag } from '@/components/common/tag';
import { isComplete } from '../AvatarDraft';
import { useAvatarDraft, useResumeStore } from '../SignupLayout';
import * as signup from '../Signup.css';
import { PortfolioAttachments } from './PortfolioAttachments';
import { AnswerEntries, ExperienceEntries } from './ResumeEntries';
import * as s from './Resume.css';
import {
  careerOptions,
  hasAnswerInput,
  hasExperienceInput,
  questions,
  resumeLimits,
} from './ResumeDraft';
import { canRegisterResume } from './ResumeStore';

function Section({
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

export function ResumeEditorPage() {
  const [avatar] = useAvatarDraft();
  const resume = useResumeStore((state) => state.draft);
  const pendingFiles = useResumeStore((state) => state.pendingFiles);
  const setCareer = useResumeStore((state) => state.setCareer);
  const setExperiences = useResumeStore((state) => state.setExperiences);
  const setAnswers = useResumeStore((state) => state.setAnswers);
  const registerResume = useResumeStore((state) => state.register);
  const ready = useResumeStore(canRegisterResume);
  const [isSkipDialogOpen, setSkipDialogOpen] = useState(false);
  const navigate = useNavigate();
  if (!isComplete(avatar)) return <Navigate to='/signup/avatar' replace />;
  const experienceCount = resume.experiences.filter((e) => e.saved).length;
  const answerCount = resume.answers.filter((a) => a.saved).length;
  const fileCount = resume.files.length;
  const score = Math.min(
    5,
    experienceCount + answerCount + Math.min(1, fileCount),
  );
  const complete = () =>
    navigate('/signup/pass', { state: { ...avatar, issuedAt: Date.now() } });
  function register() {
    if (registerResume()) complete();
  }
  const checks = [
    ['지원 정보', '완료', true],
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
          <Section
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
          </Section>
          <Section
            title='자기소개서'
            count={`문항 ${resume.answers.filter(hasAnswerInput).length}개`}
          >
            <p className={s.help}>
              기본 문항 {questions.length}개 중 최대 {resumeLimits.questions}
              개를 골라 답을 적어요.
            </p>
            <AnswerEntries entries={resume.answers} onChange={setAnswers} />
          </Section>
          <Section
            title='포트폴리오 · 첨부파일'
            count={`${fileCount + pendingFiles} / ${resumeLimits.attachments}`}
            optional
          >
            <PortfolioAttachments />
          </Section>
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
              {careerOptions.map((career) => (
                <Radio
                  key={career}
                  name='career'
                  value={career}
                  checked={resume.career === career}
                  onChange={() => setCareer(career)}
                >
                  {career}
                </Radio>
              ))}
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
            <Button
              size='large'
              display='block'
              disabled={!ready}
              onClick={register}
            >
              등록하고 시작하기
            </Button>
            <Button
              size='large'
              display='block'
              variant='outline'
              onClick={() => setSkipDialogOpen(true)}
            >
              건너뛰기
            </Button>
          </div>
        </aside>
      </div>
      <Dialog
        isOpen={isSkipDialogOpen}
        className={s.skipDialog}
        closedby='closerequest'
        onCancel={() => setSkipDialogOpen(false)}
      >
        <Dialog.Header>여기까지만 작성할까요?</Dialog.Header>
        <Dialog.Description>
          자소서를 채울수록 면접관은 더 심화된 질문을 할 수 있어요.
          <br />
          자소서는 마이페이지에서 언제든 등록할 수 있어요.
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            size='large'
            display='block'
            variant='secondary'
            onClick={() => setSkipDialogOpen(false)}
          >
            좀 더 쓸게요
          </Button>
          <Button size='large' display='block' onClick={complete}>
            완료
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
