import { expect, test } from '@playwright/test';
import {
  installFakeMicrophone,
  setFakeMicMode,
} from '../support/fakeMicrophone.ts';
import {
  finishMicTest,
  micTestDialog,
  waitingRoom,
} from '../support/waitingRoom.ts';

test('마이크 권한이 꺼져 있으면 안내하고, 권한을 켠 뒤 다시 확인한다', async ({
  page,
}) => {
  await installFakeMicrophone(page, 'denied');
  await page.goto(waitingRoom('interviewee'));

  const permission = page.getByRole('dialog', {
    name: '마이크 권한이 꺼져 있어요',
  });
  await expect(permission).toBeVisible();

  await setFakeMicMode(page, 'granted');
  await permission.getByRole('button', { name: '다시 확인하기' }).click();
  await expect(permission).toBeHidden();
  await expect(micTestDialog(page).getByText('듣고 있어요')).toBeVisible();
});

test('연결된 마이크가 없으면 완료를 누를 수 없다', async ({ page }) => {
  await installFakeMicrophone(page, 'missing');
  await page.goto(waitingRoom('interviewee'));

  const micTest = micTestDialog(page);
  await expect(micTest.getByText('연결된 마이크가 없어요')).toBeVisible();
  await expect(micTest.getByRole('button', { name: '완료' })).toBeDisabled();
});

test('마이크 테스트에서 입력 장치를 고른다', async ({ page }) => {
  await installFakeMicrophone(page);
  await page.goto(waitingRoom('interviewee'));

  const micTest = micTestDialog(page);
  await expect(micTest.getByText('듣고 있어요')).toBeVisible();
  await micTest.getByRole('button', { name: /입력 장치/ }).click();
  const devices = micTest.getByRole('listbox', { name: '입력 장치' });
  await devices.getByRole('option', { name: 'AirPods Pro' }).click();

  await expect(devices).toBeHidden();
  await expect(
    micTest.getByRole('button', { name: /AirPods Pro/ }),
  ).toBeVisible();
});

test('하단 독에서 마이크를 끄고, 연결이 끊기면 안내한다', async ({
  page,
  context,
}) => {
  await installFakeMicrophone(page);
  await page.goto(waitingRoom('interviewee'));
  await finishMicTest(page);

  // 마이크 테스트를 마쳐도 마이크는 꺼진 채로 시작한다.
  const mic = page.getByRole('button', { name: '마이크', exact: true });
  await expect(mic).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByText('마이크 꺼짐')).toBeVisible();
  await mic.click();
  await expect(mic).toHaveAttribute('aria-pressed', 'true');
  await mic.click();
  await expect(mic).toHaveAttribute('aria-pressed', 'false');

  await context.setOffline(true);
  const connectionLost = page.getByRole('dialog', {
    name: '앗, 연결이 끊겼어요',
  });
  await expect(connectionLost).toBeVisible();
  await context.setOffline(false);
  await expect(connectionLost).toBeHidden();
});
