import { color, fontFamily, fontWeight } from '@/styles/token';
import {
  getPassLabels,
  type PassCardData,
  passBackgrounds,
  passLayouts,
} from './PassCardDesign';

const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

async function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

export async function makePassArtwork(
  data: PassCardData,
  watermarkSvg: SVGSVGElement,
) {
  const layout = passLayouts[data.size];
  const { width, height, details } = layout;
  const labels = getPassLabels(data);
  const watermarkMarkup = new XMLSerializer().serializeToString(watermarkSvg);
  const [background, portrait, watermark] = await Promise.all([
    loadImage(passBackgrounds[data.kind][data.size]),
    loadImage(data.portraitUrl),
    loadImage(
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(watermarkMarkup)}`,
    ),
    Promise.allSettled([
      document.fonts.load('700 24px Pretendard'),
      document.fonts.load('600 14px Pretendard'),
      document.fonts.load('400 14px Pretendard'),
    ]),
  ]);

  const canvas = document.createElement('canvas');
  const scale = 3;
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('출입증 이미지를 만들 수 없어요.');
  ctx.scale(scale, scale);
  ctx.fillStyle = color.neutral[0];

  const drawBase = () => {
    ctx.drawImage(background, 0, 0, width, height);
    const [tieX, tieY, tieWidth, tieHeight] = layout.tie;
    ctx.drawImage(watermark, tieX, tieY, tieWidth, tieHeight);
  };
  const setFont = (size: number, weight: number) => {
    ctx.font = `${weight} ${size}px ${fontFamily.pretendard}`;
  };
  const text = (
    value: string,
    x: number,
    y: number,
    size: number,
    weight: number = fontWeight.regular,
    maxWidth?: number,
  ) => {
    setFont(size, weight);
    ctx.fillText(value, x, y, maxWidth);
  };

  drawBase();
  ctx.textAlign = 'center';
  text('MOING', width / 2, height * 0.47, layout.name[2] + 10, fontWeight.bold);
  text('INTERVIEW PASS', width / 2, height * 0.54, 12, fontWeight.semibold);
  const back = canvas.toDataURL('image/png');
  drawBase();

  const [photoX, photoY, photoWidth, photoHeight, photoRadius] = layout.photo;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoWidth, photoHeight, photoRadius);
  ctx.fill();
  ctx.clip();
  const photoScale = Math.max(
    photoWidth / portrait.width,
    photoHeight / portrait.height,
  );
  const imageWidth = portrait.width * photoScale;
  const imageHeight = portrait.height * photoScale;
  ctx.drawImage(
    portrait,
    photoX + (photoWidth - imageWidth) / 2,
    photoY + (photoHeight - imageHeight) / 2,
    imageWidth,
    imageHeight,
  );
  ctx.restore();

  const [nameX, nameY, nameSize] = layout.name;
  ctx.textAlign = details ? 'start' : 'center';
  text(
    data.name,
    nameX,
    nameY,
    nameSize,
    fontWeight.bold,
    details ? width - nameX - details.x : width - 20,
  );
  text(labels.role, nameX, layout.roleY, data.size === 'S' ? 12 : 14);
  setFont(14, fontWeight.semibold);
  const badgeWidth = Math.min(
    Math.ceil(ctx.measureText(labels.badge).width) + 24,
    details ? width - nameX - details.x : width - 20,
  );
  ctx.fillStyle = data.kind === 'visitor' ? '#4C6FFF38' : '#C9D3E629';
  ctx.beginPath();
  ctx.roundRect(
    details ? nameX : (width - badgeWidth) / 2,
    layout.badgeY,
    badgeWidth,
    28,
    14,
  );
  ctx.fill();
  ctx.fillStyle = color.neutral[0];
  text(
    labels.badge,
    details ? nameX + 12 : nameX,
    layout.badgeY + 19,
    14,
    fontWeight.semibold,
    badgeWidth - 24,
  );

  if (details) {
    ctx.fillRect(
      details.x,
      details.dividerY,
      details.dividerWidth,
      data.size === 'L' ? 1.3 : 1,
    );
    const date = dateFormatter.format(data.issuedAt).replaceAll('-', '.');
    for (const [index, [label, value]] of [
      ['소속', 'MOING'],
      ['가입일', date],
      [labels.stats, `${data.interviews}회`],
    ].entries()) {
      const y = details.rowY + index * details.gap;
      text(label, details.x, y, 14);
      text(value, details.valueX, y, 14, fontWeight.semibold);
    }
  }

  const front = canvas.toDataURL('image/png');
  // 3D 모델의 구멍은 형상에서 뚫고, 정적 카드에는 시안의 슬롯을 그린다.
  const [slotY, slotWidth, slotHeight] = layout.slot;
  ctx.beginPath();
  ctx.roundRect(
    (width - slotWidth) / 2,
    slotY,
    slotWidth,
    slotHeight,
    slotHeight / 2,
  );
  ctx.fill();
  ctx.lineWidth = data.size === 'L' ? 2.6 : 2;
  ctx.strokeStyle = color.neutral[500];
  ctx.stroke();
  return { front, back, staticFront: canvas.toDataURL('image/png') };
}
