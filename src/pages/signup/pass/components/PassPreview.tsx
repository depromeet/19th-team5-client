import { Component, lazy, type ReactNode, Suspense } from 'react';
import { color } from '@/styles/token';
import type { PassProgress } from '@/types/Signup';
import type { Avatar } from '../../AvatarDraft';
import * as s from '../VisitorPassPage.css';
import { PassCard } from './PassCard';
import { passLayouts } from './PassCardLayout';

const Lanyard = lazy(() => import('./lanyard/Lanyard.jsx'));

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

export function PassPreview({
  avatar,
  nickname,
  issuedAt,
  progress,
  levelLabel,
}: {
  avatar: Avatar;
  nickname: string;
  issuedAt: number;
  progress: PassProgress;
  levelLabel: string;
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
          interviews: progress.interviewCount,
          levelLabel,
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
      <span className={s.ticketLabel}>+ 면접권 {progress.ticketCount}장</span>
      <span className={s.levelLabel}>{levelLabel}</span>
    </div>
  );
}
