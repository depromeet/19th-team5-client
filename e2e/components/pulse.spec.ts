/// <reference lib="dom" />
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e/fixtures/interview-question.html');
  await page.getByRole('button', { name: '면접관 질문 열기' }).click();
});

test('음량 변화를 파형 높이로 표시하고 마이크를 끄면 트랙을 종료한다', async ({
  page,
}) => {
  const input = await page.evaluateHandle(() => {
    const context = new AudioContext();
    const tone = context.createOscillator();
    const gain = context.createGain();
    const output = context.createMediaStreamDestination();
    gain.gain.value = 0;
    tone.connect(gain).connect(output);
    tone.start();
    navigator.mediaDevices.getUserMedia = async () => {
      await context.resume();
      return output.stream;
    };
    return { gain, track: output.stream.getAudioTracks()[0], context };
  });
  const mic = page.getByRole('button', { name: '마이크', exact: true });
  await mic.click();
  const canvas = mic.locator('[part="canvases"] canvas').first();
  await expect(canvas).toBeVisible();
  const paintedHeight = () =>
    canvas.evaluate((element: HTMLCanvasElement) => {
      const { width, height } = element;
      const copy = new OffscreenCanvas(width, height);
      const ctx = copy.getContext('2d');
      if (!ctx) throw new Error('파형을 읽을 수 없습니다.');
      ctx.drawImage(element, 0, 0);
      const { data } = ctx.getImageData(0, 0, width, height);
      let rows = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (data[(y * width + x) * 4 + 3] > 0) {
            rows++;
            break;
          }
        }
      }
      return rows;
    });
  const setLevel = (level: number) =>
    input.evaluate(({ gain }, value) => {
      gain.gain.value = value;
    }, level);

  await expect.poll(paintedHeight).toBeGreaterThan(0);
  const silence = await paintedHeight();
  await setLevel(0.05);
  await expect.poll(paintedHeight).toBeGreaterThan(silence);
  const quiet = await paintedHeight();
  await setLevel(0.85);
  await expect.poll(paintedHeight).toBeGreaterThan(quiet);
  const loud = await paintedHeight();
  await setLevel(0.5);
  await expect.poll(paintedHeight).toBeLessThan(loud);
  expect(await paintedHeight()).toBeGreaterThan(quiet);
  await setLevel(0);
  await expect.poll(paintedHeight).toBe(silence);
  await mic.click();
  await expect
    .poll(() => input.evaluate(({ track }) => track.readyState))
    .toBe('ended');
  await input.evaluate(({ context }) => context.close());
});

test('카드를 닫은 뒤 마이크 권한이 허용되어도 트랙을 종료한다', async ({
  page,
}) => {
  const pending = await page.evaluateHandle(() => {
    const context = new AudioContext();
    const { stream } = context.createMediaStreamDestination();
    let grantPermission: () => void;
    navigator.mediaDevices.getUserMedia = () =>
      new Promise((resolve) => {
        grantPermission = () => resolve(stream);
      });
    return {
      allow: () => grantPermission(),
      track: stream.getAudioTracks()[0],
      context,
    };
  });
  await page.getByRole('button', { name: '마이크', exact: true }).click();
  await expect(page.getByText('연결 중', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '면접관 질문 카드 닫기' }).click();
  await pending.evaluate(({ allow }) => allow());
  await expect
    .poll(() => pending.evaluate(({ track }) => track.readyState))
    .toBe('ended');
  await pending.evaluate(({ context }) => context.close());
});
