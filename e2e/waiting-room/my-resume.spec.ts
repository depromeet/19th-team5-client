import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { finishMicTest, waitingRoom } from '../support/waitingRoom.ts';

test('면접자는 대기실에서 내 자소서를 읽기 전용으로 본다', async ({ page }) => {
  await installFakeMicrophone(page);
  await page.goto(waitingRoom('interviewee'));
  await finishMicTest(page);

  const toggle = page.getByRole('button', { name: '내 자소서 펼치기' });
  await toggle.hover();
  const card = page.getByRole('complementary', { name: '자기소개서 2문항' });
  await expect(card).toContainText('이력·포트폴리오 1개 · 면접관에게 공유됨');
  await expect(card).toContainText('Q1. 지원 동기');

  // 마우스가 카드 밖으로 나가면 다시 접는다.
  await page.mouse.move(0, 0);
  await expect(card).toBeHidden();
  await expect(toggle).toBeVisible();

  await toggle.hover();
  await card.getByRole('button', { name: '자세히 보기' }).click();
  const resume = page.getByRole('dialog', { name: '내 자소서' });
  await expect(resume.getByText('면접관에게 공유됨 · 읽기 전용')).toBeVisible();
  await expect(resume.getByText('Q2. 협업 경험')).toBeVisible();
  await expect(resume.getByRole('textbox')).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(resume).toBeHidden();
});

test('키보드로도 내 자소서 카드를 펼치고 접는다', async ({ page }) => {
  await installFakeMicrophone(page);
  await page.goto(waitingRoom('interviewee'));
  await finishMicTest(page);

  const toggle = page.getByRole('button', { name: '내 자소서 펼치기' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  const card = page.getByRole('complementary', { name: '자기소개서 2문항' });
  await expect(card.getByRole('button', { name: '자세히 보기' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(card).toBeHidden();
  await expect(toggle).toBeFocused();
});
