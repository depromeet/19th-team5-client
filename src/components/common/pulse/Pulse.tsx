import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/plugins/record';
import { color } from '@/styles/token';
import * as styles from './pulse.css';

type PulseVariant = 'compact' | 'waveform';

export type PulseProps =
  | {
      /** 호출자가 관리하는 마이크 스트림. 연결 전에는 null을 전달합니다. */
      stream: MediaStream | null;
      variant?: PulseVariant;
      audio?: never;
      src?: never;
    }
  | {
      /** 녹음 파일을 재생하는 기존 오디오 요소와 해당 파일의 URL입니다. */
      audio: HTMLAudioElement;
      src: string;
      stream?: never;
      variant?: 'waveform';
    };

function drawPulse(
  channels: (Float32Array | number[])[],
  ctx: CanvasRenderingContext2D,
  variant: PulseVariant,
  live: boolean,
) {
  const sampleCount = channels[0]?.length ?? 0;
  if (!sampleCount) return;
  const { width, height } = ctx.canvas;
  const wide = variant === 'waveform';
  const barCount = wide ? 24 : 5;
  const barWidth = width * (wide ? 3 / 164 : 3 / 24);
  const spacing = (width - barWidth) / (barCount - 1);
  const minHeight = height * (wide ? 3 / 16 : 2 / 24);
  const activeColor = ctx.fillStyle;

  for (let bar = 0; bar < barCount; bar++) {
    const start = Math.floor((bar * sampleCount) / barCount);
    const end = Math.ceil(((bar + 1) * sampleCount) / barCount);
    let peak = 0;
    for (const samples of channels) {
      for (let i = start; i < end; i++) {
        peak = Math.max(peak, Math.abs(samples[i]));
      }
    }

    // 제곱근 스케일은 작은 입력을 강조하면서 큰 입력의 높이 차이도 유지한다.
    const level = Math.sqrt(Math.min(peak, 1));
    const barHeight = Math.max(minHeight, Math.round(height * level));
    ctx.fillStyle =
      wide && live && barHeight === minHeight
        ? color.neutral[200]
        : activeColor;
    ctx.beginPath();
    ctx.roundRect(
      bar * spacing,
      (height - barHeight) / 2,
      barWidth,
      barHeight,
      Math.min(barWidth, barHeight) / 2,
    );
    ctx.fill();
  }
}

export function Pulse({ stream, audio, src, variant }: PulseProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const layout = variant ?? (audio ? 'waveform' : 'compact');
  const hasInput = audio
    ? Boolean(src)
    : Boolean(stream?.getAudioTracks().length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasInput) return;

    const wave = WaveSurfer.create({
      container,
      height: 'auto',
      media: audio,
      url: src,
      waveColor: audio ? color.neutral[300] : getComputedStyle(container).color,
      progressColor: audio ? color.primary[500] : undefined,
      renderFunction: (samples, ctx) =>
        drawPulse(samples, ctx, layout, !!stream),
      cursorWidth: 0,
      interact: false,
    });
    const preview = stream
      ? wave
          .registerPlugin(
            RecordPlugin.create({
              scrollingWaveform: true,
              scrollingWaveformWindow: layout === 'waveform' ? 2.4 : 0.5,
            }),
          )
          .renderMicStream(stream)
      : undefined;

    return () => {
      preview?.onDestroy();
      wave.destroy();
    };
  }, [stream, audio, src, layout, hasInput]);

  return (
    <span
      className={styles.pulse}
      data-variant={layout}
      data-idle={!hasInput}
      ref={containerRef}
      aria-hidden='true'
    />
  );
}
