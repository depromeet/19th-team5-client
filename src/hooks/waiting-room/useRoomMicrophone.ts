import { useEffect, useEffectEvent, useState } from 'react';

export type MicStatus =
  | 'requesting'
  | 'live'
  | 'denied'
  | 'no-device'
  | 'error';

export type MicDevice = { id: string; label: string };

/** 브라우저가 정하는 기본 입력 장치 */
export const systemDefaultDeviceId = 'default';

function toMicDevices(devices: MediaDeviceInfo[]): MicDevice[] {
  const inputs = devices.filter(
    ({ kind, deviceId }) =>
      kind === 'audioinput' &&
      deviceId !== '' &&
      deviceId !== systemDefaultDeviceId &&
      deviceId !== 'communications',
  );
  if (inputs.length === 0) return [];
  return [
    ...inputs.map(({ deviceId, label }, index) => ({
      id: deviceId,
      label: label || `마이크 ${index + 1}`,
    })),
    { id: systemDefaultDeviceId, label: '시스템 기본값' },
  ];
}

async function listMicDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  return toMicDevices(await navigator.mediaDevices.enumerateDevices());
}

function toFailedStatus(cause: unknown): MicStatus {
  if (!(cause instanceof DOMException)) return 'error';
  if (cause.name === 'NotAllowedError' || cause.name === 'SecurityError') {
    return 'denied';
  }
  if (cause.name === 'NotFoundError' || cause.name === 'OverconstrainedError') {
    return 'no-device';
  }
  return 'error';
}

/** 장치를 바꾸거나 다시 시도할 때마다 새 객체를 만들어 연결을 다시 맺는다. */
type MicRequest = { deviceId: string };

/**
 * 대기실 마이크. 입장하면 바로 권한을 요청하고, 고른 장치로 입력을 받는다.
 * 하단 독의 켜고 끄기는 트랙을 멈추지 않고 음소거만 바꾼다.
 */
export function useRoomMicrophone() {
  const [request, setRequest] = useState<MicRequest>({
    deviceId: systemDefaultDeviceId,
  });
  const [status, setStatus] = useState<MicStatus>('requesting');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [liveSince, setLiveSince] = useState<number | null>(null);
  const [devices, setDevices] = useState<MicDevice[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  // 권한을 다시 요청하는 동안에도 권한 안내를 유지하려고 마지막 결과를 따로 둔다.
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let acquired: MediaStream | undefined;

    function stopTracks() {
      for (const track of acquired?.getTracks() ?? []) track.stop();
    }

    function fail(nextStatus: MicStatus) {
      setStream(null);
      setLiveSince(null);
      setStatus(nextStatus);
      setIsPermissionDenied(nextStatus === 'denied');
    }

    async function refreshDevices() {
      const nextDevices = await listMicDevices();
      if (!controller.signal.aborted) setDevices(nextDevices);
    }

    async function connect({ deviceId }: MicRequest) {
      setStatus('requesting');
      if (!navigator.mediaDevices?.getUserMedia) {
        fail('error');
        return;
      }
      try {
        acquired = await navigator.mediaDevices.getUserMedia({
          audio:
            deviceId === systemDefaultDeviceId
              ? true
              : { deviceId: { exact: deviceId } },
        });
        if (controller.signal.aborted) {
          stopTracks();
          return;
        }
        for (const track of acquired.getAudioTracks()) {
          track.addEventListener('ended', () => fail('no-device'), {
            signal: controller.signal,
          });
        }
        setStream(acquired);
        setLiveSince(Date.now());
        setStatus('live');
        setIsPermissionDenied(false);
      } catch (cause) {
        if (controller.signal.aborted) return;
        fail(toFailedStatus(cause));
      }
      await refreshDevices();
    }

    void connect(request);
    return () => {
      controller.abort();
      stopTracks();
    };
  }, [request]);

  useEffect(() => {
    for (const track of stream?.getAudioTracks() ?? []) {
      track.enabled = !isMuted;
    }
  }, [stream, isMuted]);

  function retry() {
    setRequest(({ deviceId }) => ({ deviceId }));
  }

  function selectDevice(deviceId: string) {
    setRequest((current) =>
      current.deviceId === deviceId ? current : { deviceId },
    );
  }

  // 마이크를 꽂거나 뺄 때 목록을 새로 읽는다. 고른 장치가 빠지면 기본값으로,
  // 장치가 없던 상태에서 새 장치가 생기면 자동으로 다시 연결한다.
  const handleDeviceChange = useEffectEvent(async () => {
    const nextDevices = await listMicDevices();
    setDevices(nextDevices);
    const isSelectedMissing =
      request.deviceId !== systemDefaultDeviceId &&
      !nextDevices.some(({ id }) => id === request.deviceId);
    if (isSelectedMissing) {
      selectDevice(systemDefaultDeviceId);
      return;
    }
    if (status === 'no-device' && nextDevices.length > 0) retry();
  });

  useEffect(() => {
    const mediaDevices = navigator.mediaDevices;
    if (!mediaDevices) return;
    const listener = () => void handleDeviceChange();
    mediaDevices.addEventListener('devicechange', listener);
    return () => mediaDevices.removeEventListener('devicechange', listener);
  }, []);

  return {
    status,
    stream,
    liveSince,
    devices,
    deviceId: request.deviceId,
    /** 실제로 입력 중인 장치 이름. 시스템 기본값을 고르면 어떤 마이크인지 보여줄 때 쓴다. */
    inputLabel: stream?.getAudioTracks()[0]?.label ?? '',
    isMuted,
    isPermissionDenied,
    selectDevice,
    retry,
    toggleMute: () => setIsMuted((muted) => !muted),
  };
}

export type RoomMicrophone = ReturnType<typeof useRoomMicrophone>;
