import { expect, type Page, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { interviewRoom } from '../support/interviewRoom.ts';

const leaveDialog = { name: '면접에서 나갈까요?' };

async function openLeaveDialog(page: Page) {
  await page.getByRole('button', { name: '면접 나가기' }).click();
  const dialog = page.getByRole('dialog', leaveDialog);
  await expect(dialog).toBeVisible();
  return dialog;
}

test.beforeEach(async ({ page }) => {
  await installFakeMicrophone(page);
  await page.clock.install();
});

test('Task3 면접자는 나가기를 확인하면 로비로 간다', async ({ page }) => {
  await page.goto(`${interviewRoom('interviewee')}&task=3`);
  await page.getByRole('button', { name: 'Space 앉기' }).press('Space');

  // 취소하면 면접방에 그대로 남는다.
  const dialog = await openLeaveDialog(page);
  await dialog.getByRole('button', { name: '취소' }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/interview-room/);

  await (await openLeaveDialog(page))
    .getByRole('button', { name: '확인' })
    .click();
  await expect(page).toHaveURL('/lobby');
});

test('Task4 면접관은 나가기를 확인하면 로비로 간다', async ({ page }) => {
  await page.goto(`${interviewRoom('interviewer')}&task=4`);

  await (await openLeaveDialog(page))
    .getByRole('button', { name: '확인' })
    .click();
  await expect(page).toHaveURL('/lobby');
});
