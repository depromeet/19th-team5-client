import { useEffect, useEffectEvent, useState } from 'react';

export function useMicrophoneInput(onMicChange?: (isOn: boolean) => void) {
  const [requested, setRequested] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');

  const notifyMicChange = useEffectEvent((isOn: boolean) =>
    onMicChange?.(isOn),
  );

  useEffect(() => {
    if (!requested) return;

    const controller = new AbortController();
    let input: MediaStream | undefined;

    function stopTracks() {
      for (const track of input?.getTracks() ?? []) track.stop();
    }

    function fail(message: string) {
      setStream(null);
      setRequested(false);
      setError(message);
      notifyMicChange(false);
    }

    async function connect() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          fail('마이크 사용 불가');
          return;
        }
        input = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (controller.signal.aborted) {
          stopTracks();
          return;
        }
        for (const track of input.getAudioTracks()) {
          track.addEventListener('ended', () => fail('마이크 연결 끊김'), {
            signal: controller.signal,
          });
        }
        setStream(input);
        notifyMicChange(true);
      } catch (cause) {
        if (controller.signal.aborted) return;
        if (cause instanceof DOMException && cause.name === 'NotAllowedError') {
          fail('마이크 권한 필요');
        } else {
          fail('마이크 장치 확인');
        }
      }
    }

    void connect();
    return () => {
      controller.abort();
      stopTracks();
    };
  }, [requested]);

  function toggle() {
    if (requested) onMicChange?.(false);
    setError('');
    setStream(null);
    setRequested(!requested);
  }

  return { requested, stream, error, toggle };
}
