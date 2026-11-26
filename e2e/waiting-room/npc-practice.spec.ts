import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { finishMicTest, waitingRoom } from '../support/waitingRoom.ts';

test('마이크 테스트를 마치면 준비 완료가 되고, Space로 김대리와 연습한다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.goto(waitingRoom('interviewee'));

  const me = page
    .getByRole('region', { name: '참가자' })
    .getByRole('listitem')
    .first();
  await expect(me).toContainText('마이크 확인');
  await finishMicTest(page);
  await expect(me).toContainText('준비 완료');

  await page.keyboard.press('Space');
  const sheet = page.getByRole('dialog', { name: '김대리' });
  await expect(sheet).toBeVisible();
  await sheet.getByRole('button', { name: '모범답안 보기' }).click();
  await expect(sheet.getByText('모범답안 · 1분 자기소개')).toBeVisible();

  await sheet.getByRole('button', { name: '연습하기' }).click();
  await expect(sheet.getByRole('img', { name: '연습 중' })).toBeVisible();
  await sheet.getByRole('button', { name: '연습 끝내기' }).click();
  const confirm = page.getByRole('dialog', { name: '연습을 종료할까요?' });
  await confirm.getByRole('button', { name: '계속 연습하기' }).click();
  await expect(confirm).toBeHidden();

  // 연습 중에 시트를 닫으려 하면 종료 확인을 먼저 띄운다.
  await sheet.getByRole('button', { name: '김대리와 대화 닫기' }).click();
  await confirm.getByRole('button', { name: '종료하기' }).click();
  await expect(sheet).toBeHidden();
});
