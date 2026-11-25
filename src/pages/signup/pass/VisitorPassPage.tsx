import { Component, lazy, type ReactNode, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Button } from '@/components/common/button';
import { Tag } from '@/components/common/tag';
import { color } from '@/styles/token';
import { type Avatar, initialDraft, isComplete } from '../AvatarDraft';
import { useAvatarDraft } from '../SignupLayout';
import * as signup from '../Signup.css';
import { PassCard } from './PassCard';
import * as s from './Pass.css';
import { passLayouts } from './PassCardDesign';

const Lanyard = lazy(() => import('../lanyard/Lanyard.jsx'));
const levels = [
  ['지원자', '지금'],
  ['서류 합격자', '면접 3회'],
  ['1차 합격자', '면접 8회'],
  ['최종 합격자', '면접 15회'],
  ['면접 마스터', '면접 30회'],
];
class PassArtworkBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed)
      return <div data-pass-fallback='module'>{this.props.fallback}</div>;
    return this.props.children;
  }
}

function PassPreview({
  avatar,
  nickname,
  issuedAt,
}: {
  avatar: Avatar;
  nickname: string;
  issuedAt: number;
}) {
  const layout = passLayouts.L;
  return (
    <div className={s.scene}>
      <div className={s.rings} aria-hidden='true' />
      <PassCard
        className={s.cardPreview}
        data={{
          kind: 'visitor',
          size: 'L',
          name: nickname,
          portraitUrl: `/images/signup/${avatar}-portrait.png`,
          issuedAt,
          interviews: 0,
          levelLabel: 'Lv.1 지원자',
        }}
        renderArtwork={(artwork, staticCard) => {
          const fallback = (
            <div
              className={s.staticPass}
              style={{ aspectRatio: layout.width / layout.height }}
            >
              {staticCard}
            </div>
          );
          if (!artwork) return fallback;
          return (
            <PassArtworkBoundary fallback={fallback}>
              <Suspense fallback={fallback}>
                <Lanyard
                  frontImage={artwork.front}
                  backImage={artwork.back}
                  fallback={fallback}
                  strapImage='/images/signup/pass-strap.svg'
                  strapColor={color.primary[500]}
                  cardColor={color.primary[900]}
                  aspectRatio={layout.width / layout.height}
                  cornerRadius={0.4}
                  size={0.52}
                  strapLength={0.35}
                  strapWidth={0.55}
                  finish='matte'
                  damping={0.75}
                  breeze={0.15}
                />
              </Suspense>
            </PassArtworkBoundary>
          );
        }}
      />
      <span className={s.ticketLabel}>+ 면접권 2장</span>
      <span className={s.levelLabel}>Lv.1 지원자</span>
    </div>
  );
}

export function VisitorPassPage() {
  const [draft] = useAvatarDraft();
  const { state } = useLocation();
  const issued = initialDraft(state);
  if (
    !issued.avatar ||
    !isComplete(issued) ||
    typeof state?.issuedAt !== 'number' ||
    !Number.isFinite(new Date(state.issuedAt).getTime())
  ) {
    if (!isComplete(draft)) return <Navigate to='/signup/avatar' replace />;
    return <Navigate to='/signup/resume-guide' state={draft} replace />;
  }
  return (
    <div className={s.layout}>
      <PassPreview
        avatar={issued.avatar}
        nickname={issued.nickname}
        issuedAt={state.issuedAt}
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
            {levels.map(([label, threshold], i) => (
              <li key={label} aria-current={i === 0 ? 'step' : undefined}>
                <span>Lv.{i + 1}</span>
                {label}
                {i === 0 ? <Tag>지금</Tag> : <small>{threshold}</small>}
              </li>
            ))}
          </ol>
        </div>
        <dl className={s.stats}>
          <div>
            <dt>받은 면접권</dt>
            <dd>2장</dd>
          </div>
          <div>
            <dt>노쇼 경고</dt>
            <dd>0 / 2</dd>
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
