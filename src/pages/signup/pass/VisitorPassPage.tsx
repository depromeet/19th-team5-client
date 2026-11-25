import { Navigate, useLocation } from 'react-router';
import { Button } from '@/components/common/button';
import { Tag } from '@/components/common/tag';
import type { PassProgress } from '@/types/Signup';
import { initialDraft, isComplete } from '../AvatarDraft';
import * as signup from '../Signup.css';
import { useAvatarDraft, useSignupOptions } from '../SignupLayout';
import { PassPreview } from './components/PassPreview';
import * as s from './Pass.css';

function isPassProgress(value: unknown): value is PassProgress {
  if (!value || typeof value !== 'object') return false;
  const fields = [
    'level',
    'interviewCount',
    'ticketCount',
    'noShowCount',
    'noShowLimit',
  ] as const;
  return fields.every((field) => {
    const number: unknown = Reflect.get(value, field);
    return (
      typeof number === 'number' && Number.isInteger(number) && number >= 0
    );
  });
}

export function VisitorPassPage() {
  const [draft] = useAvatarDraft();
  const { passLevels, initialPassProgress } = useSignupOptions();
  const { state } = useLocation();
  const issued = initialDraft(state);
  if (
    !isComplete(issued) ||
    typeof state?.issuedAt !== 'number' ||
    !Number.isFinite(new Date(state.issuedAt).getTime())
  ) {
    if (!isComplete(draft)) return <Navigate to='/signup/avatar' replace />;
    return <Navigate to='/signup/resume-guide' state={draft} replace />;
  }
  const progress = isPassProgress(state.progress)
    ? state.progress
    : initialPassProgress;
  const currentLevel = passLevels.find(
    (entry) => entry.level === progress.level,
  );
  const levelLabel = currentLevel
    ? `Lv.${progress.level} ${currentLevel.label}`
    : `Lv.${progress.level}`;

  return (
    <div className={s.layout}>
      <PassPreview
        avatar={issued.avatar}
        nickname={issued.nickname}
        issuedAt={state.issuedAt}
        progress={progress}
        levelLabel={levelLabel}
      />
      <section className={s.details}>
        <Tag tone='green'>가입 완료</Tag>
        <h1 className={signup.title}>
          출입증 나왔어요
          <br />
          면접 화이팅이에요!
        </h1>
        <p className={s.description}>
          이제 모잉기업 면접을 볼 수 있어요.
          <br />
          면접을 볼수록 레벨이 올라 면접 마스터에 가까워져요.
        </p>
        <div className={s.journey}>
          <h2>합격까지의 여정</h2>
          <ol>
            {passLevels.map(({ level, label, minInterviews }) => (
              <li
                key={level}
                aria-current={level === progress.level ? 'step' : undefined}
              >
                <span>Lv.{level}</span>
                {label}
                {level === progress.level ? (
                  <Tag>지금</Tag>
                ) : (
                  <small>면접 {minInterviews}회</small>
                )}
              </li>
            ))}
          </ol>
        </div>
        <dl className={s.stats}>
          <div>
            <dt>받은 면접권</dt>
            <dd>{progress.ticketCount}장</dd>
          </div>
          <div>
            <dt>노쇼 경고</dt>
            <dd>
              {progress.noShowCount} / {progress.noShowLimit}
            </dd>
          </div>
        </dl>
        <div className={s.footer}>
          <Button size='large' display='block' aria-disabled='true'>
            로비로 입장하기
          </Button>
        </div>
      </section>
    </div>
  );
}
