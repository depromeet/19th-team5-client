import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';

test('면접관은 1시간 전 알림에서 2부 질문지를 연다', async ({ page }) => {
  await page.goto('/lobby?role=interviewer&phase=prepare');

  await expect(
    page.getByRole('complementary', { name: '오늘 14:00 · 디자인' }),
  ).toContainText('면접관으로 참여');
  await expect(
    page.getByRole('button', { name: 'Space 예약 키오스크 사용하기' }),
  ).toBeVisible();

  await page
    .getByRole('complementary', { name: '면접자 서류 도착!' })
    .getByRole('button', { name: '확인' })
    .click();
  await expect(
    page.getByRole('dialog', { name: '면접 준비해볼까요?' }),
  ).toBeVisible();
});

test('대기실이 열리면 알림에서 대기실로 들어간다', async ({ page }) => {
  await installFakeMicrophone(page);
  await page.goto('/lobby?role=interviewee&phase=open');

  await page
    .getByRole('complementary', { name: '대기실 문 열렸어요' })
    .getByRole('button', { name: '확인' })
    .click();
  await expect(page).toHaveURL(
    '/interviews/design-1400/waiting-room?role=interviewee',
  );
  await expect(
    page.getByRole('dialog', { name: '아-아, 마이크 테스트' }),
  ).toBeVisible();
});

test('나중에를 누르면 알림 카드를 닫는다', async ({ page }) => {
  await page.goto('/lobby?role=interviewee&phase=open');

  const notice = page.getByRole('complementary', {
    name: '대기실 문 열렸어요',
  });
  await notice.getByRole('button', { name: '나중에' }).click();
  await expect(notice).toBeHidden();
});
