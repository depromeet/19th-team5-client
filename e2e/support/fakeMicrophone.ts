/// <reference lib="dom" />
import type { Page } from '@playwright/test';

export type FakeMicMode = 'granted' | 'denied' | 'missing';

/** init script 시점에는 document가 비어 있어서 모드를 window에 둔다. */
const modeKey = '__fakeMicMode';

/**
 * 페이지가 열리기 전에 마이크 API를 가짜로 바꾼다.
 * granted: 무음 입력 스트림, denied: 권한 거부, missing: 연결된 마이크 없음
 */
export async function installFakeMicrophone(
  page: Page,
  mode: FakeMicMode = 'granted',
) {
  await page.addInitScript(
    ({ key, initialMode }) => {
      Reflect.set(window, key, initialMode);
      const currentMode = () => Reflect.get(window, key);

      const devices: MediaDeviceInfo[] = [
        {
          deviceId: 'built-in',
          groupId: 'built-in',
          kind: 'audioinput',
          label: 'MacBook Pro 마이크',
          toJSON: () => ({}),
        },
        {
          deviceId: 'airpods',
          groupId: 'airpods',
          kind: 'audioinput',
          label: 'AirPods Pro',
          toJSON: () => ({}),
        },
      ];

      navigator.mediaDevices.enumerateDevices = async () =>
        currentMode() === 'missing' ? [] : devices;

      navigator.mediaDevices.getUserMedia = async () => {
        if (currentMode() === 'denied') {
          throw new DOMException('Permission denied', 'NotAllowedError');
        }
        if (currentMode() === 'missing') {
          throw new DOMException('Requested device not found', 'NotFoundError');
        }
        const context = new AudioContext();
        const output = context.createMediaStreamDestination();
        context.createOscillator().connect(output);
        return output.stream;
      };
    },
    { key: modeKey, initialMode: mode },
  );
}

export async function setFakeMicMode(page: Page, mode: FakeMicMode) {
  await page.evaluate(
    ({ key, nextMode }) => Reflect.set(window, key, nextMode),
    { key: modeKey, nextMode: mode },
  );
}
