import { type ReactNode, useEffect, useRef, useState } from 'react';
import { IconTieWatermark } from '@/assets/icons';
import { makePassArtwork } from './PassArtwork';
import * as styles from './PassCard.css';
import {
  getPassLabels,
  type PassCardData,
  passLayouts,
} from './PassCardDesign';

type Artwork = Awaited<ReturnType<typeof makePassArtwork>>;

type PassCardProps = {
  data: PassCardData;
  className?: string;
  renderArtwork?: (artwork: Artwork | null, staticCard: ReactNode) => ReactNode;
};

export function PassCard({ data, className, renderArtwork }: PassCardProps) {
  const watermark = useRef<SVGSVGElement>(null);
  const [result, setResult] = useState<{
    data: PassCardData;
    artwork: Artwork;
  }>();

  useEffect(() => {
    const svg = watermark.current;
    if (!svg) return;
    let active = true;
    makePassArtwork(data, svg)
      .then((artwork) => {
        if (active) setResult({ data, artwork });
      })
      .catch(() => {
        if (active) setResult(undefined);
      });
    return () => {
      active = false;
    };
  }, [data]);

  const { width, height, radius } = passLayouts[data.size];
  const borderRadius = `${(radius / width) * 100}% / ${(radius / height) * 100}%`;
  const labels = getPassLabels(data);
  const artwork = result?.data === data ? result.artwork : null;
  const staticCard = artwork ? (
    <img
      className={styles.image}
      data-pass-card={`${data.kind}-${data.size}`}
      src={artwork.staticFront}
      width={width}
      height={height}
      style={{ borderRadius }}
      alt=''
    />
  ) : (
    <div
      className={styles.placeholder}
      style={{ width, aspectRatio: width / height, borderRadius }}
    >
      <img src={data.portraitUrl} alt='' />
      <strong>{data.name}</strong>
      <span>
        {labels.role} · {labels.badge}
      </span>
    </div>
  );

  return (
    <div
      className={className}
      role='img'
      aria-label={`${data.name}님의 MOING ${data.kind === 'visitor' ? '방문 출입증' : labels.type} · ${labels.badge}`}
    >
      <div hidden>
        <IconTieWatermark ref={watermark} />
      </div>
      {renderArtwork ? renderArtwork(artwork, staticCard) : staticCard}
    </div>
  );
}
