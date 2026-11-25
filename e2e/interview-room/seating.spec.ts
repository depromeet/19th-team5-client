import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { interviewRoom } from '../support/interviewRoom.ts';

test.beforeEach(async ({ page }) => {
  await installFakeMicrophone(page);
  await page.clock.install();
  await page.goto(interviewRoom('interviewee'));
});

test('면접자는 Space로 내 자리에 앉고 1부를 시작한다', async ({ page }) => {
  const sitPrompt = page.getByRole('button', { name: 'Space 앉기' });
  await expect(
    page.getByRole('heading', { name: '내 자리로 가서 앉아 주세요' }),
  ).toBeVisible();
  await expect(sitPrompt).toBeVisible();

  await page.keyboard.press('Space');
  await expect(sitPrompt).toBeHidden();
  await expect(page.getByText('1부 공통 질문을 시작해요')).toBeVisible();
  await expect(
    page
      .getByRole('list', { name: '면접 진행 단계' })
      .getByRole('listitem')
      .first(),
  ).toHaveAttribute('aria-current', 'step');
});

test('1분 안에 앉지 않으면 자동으로 앉는다', async ({ page }) => {
  // 가짜 시계도 실제 시간만큼 흐르므로 몇 초의 차이는 허용한다.
  await expect(page.getByText(/남은 시간 (01:00|00:5\d)/)).toBeVisible();

  await page.clock.fastForward(60_000);
  await expect(
    page.getByRole('heading', { name: '1분이 지나 자동으로 앉았어요' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Space 앉기' })).toBeHidden();
});
