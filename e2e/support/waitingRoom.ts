import { expect, type Page } from '@playwright/test';

export const waitingRoom = (role: 'interviewee' | 'interviewer') =>
  `/interviews/design-1400/waiting-room?role=${role}`;

export const micTestDialog = (page: Page) =>
  page.getByRole('dialog', { name: '아-아, 마이크 테스트' });

export async function finishMicTest(page: Page) {
  const micTest = micTestDialog(page);
  await expect(micTest.getByText('듣고 있어요')).toBeVisible();
  await micTest.getByRole('button', { name: '완료' }).click();
  await expect(micTest).toBeHidden();
}
