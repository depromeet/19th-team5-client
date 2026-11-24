import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button, Pulse } from '@/components/common';
import { useMicrophoneInput } from '@/hooks/useMicrophoneInput';
import * as styles from './pulse.stories.css';

const meta = {
  title: 'Components/Pulse',
  component: Pulse,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof Pulse>;

export default meta;
type Story = StoryObj<typeof Pulse>;

function MicrophonePreview() {
  const { requested, stream, error, toggle } = useMicrophoneInput();
  const status = stream
    ? '듣고 있어요'
    : requested
      ? '연결 중'
      : '마이크 연결 대기 중';
  return (
    <div className={styles.preview}>
      <span aria-live='polite'>{error || status}</span>
      <Pulse variant='waveform' stream={stream} />
      <Button onClick={toggle} aria-pressed={requested}>
        {requested ? '마이크 끄기' : '마이크 켜기'}
      </Button>
    </div>
  );
}

export const MicTest: Story = {
  name: '마이크 테스트 · 실시간 입력',
  render: () => <MicrophonePreview />,
};

function PlaybackPreview() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<
    'ready' | 'playing' | 'paused' | 'ended' | 'error'
  >('ready');
  useEffect(() => {
    if (!audio) return;
    audio.onplaying = () => setStatus('playing');
    audio.onpause = () => setStatus(audio.ended ? 'ended' : 'paused');
    audio.onended = () => setStatus('ended');
    audio.onerror = () => setStatus('error');
    return () => {
      audio.onplaying = audio.onpause = audio.onended = audio.onerror = null;
      audio.pause();
      URL.revokeObjectURL(audio.src);
    };
  }, [audio]);

  return (
    <div className={styles.preview}>
      <label>
        녹음 파일 선택
        <input
          type='file'
          accept='audio/*'
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            setStatus('ready');
            setAudio(file ? new Audio(URL.createObjectURL(file)) : null);
          }}
        />
      </label>
      {audio && (
        <Button
          disabled={status === 'error'}
          onClick={() => {
            if (!audio.paused) audio.pause();
            else void audio.play().catch(() => setStatus('error'));
          }}
        >
          {status === 'playing'
            ? '일시 정지'
            : status === 'ended'
              ? '다시 듣기'
              : '내 목소리 들어보기'}
        </Button>
      )}
      {status === 'error' && (
        <span role='alert'>녹음 파일을 재생할 수 없어요</span>
      )}
      {audio &&
        (status === 'playing' || status === 'paused' || status === 'ended') && (
          <Pulse audio={audio} src={audio.src} />
        )}
    </div>
  );
}

export const RecordedPlayback: Story = {
  name: '마이크 테스트 · 녹음 재생',
  render: () => <PlaybackPreview />,
};
