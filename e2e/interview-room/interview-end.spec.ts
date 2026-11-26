import { expect, type Page, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { interviewRoom, roomTiming } from '../support/interviewRoom.ts';

const endDialog = { name: '수고했어요, 면접 끝!' };

async function sit(page: Page) {
  await page.getByRole('button', { name: 'Space 앉기' }).press('Space');
  await expect(
    page.getByRole('heading', { name: '면접관이 질문을 고르고 있어요' }),
  ).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await installFakeMicrophone(page);
  const now = Date.now();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now + 60_000);
});

test('면접자는 면접이 끝나면 면접관에게 좋아요를 보내고 로비로 돌아간다', async ({
  page,
}) => {
  await page.goto(interviewRoom('interviewee'));
  await sit(page);
  await page.clock.fastForward(roomTiming.part * 3);

  const end = page.getByRole('dialog', endDialog);
  await end.getByRole('button', { name: '면접관 평가하기' }).click();
  const review = page.getByRole('dialog', { name: '이번 면접관 어떠셨나요?' });
  await expect(review).toBeVisible();
  await review.getByRole('button', { name: '단단한 곰에게 좋아요' }).click();
  await expect(
    review.getByRole('button', { name: '좋아요 보냄' }),
  ).toBeDisabled();
  await expect(
    review.getByRole('button', { name: '느긋한 여우에게 좋아요' }),
  ).toBeEnabled();

  await review.getByRole('button', { name: '로비로 돌아가기' }).click();
  await expect(page).toHaveURL('/lobby');
});

test('면접자는 평가 없이 바로 로비로 돌아갈 수 있다', async ({ page }) => {
  await page.goto(interviewRoom('interviewee'));
  await sit(page);
  await page.clock.fastForward(roomTiming.part * 3);

  await page
    .getByRole('dialog', endDialog)
    .getByRole('button', { name: '로비로 돌아가기' })
    .click();
  await expect(page).toHaveURL('/lobby');
});

test('면접관은 면접을 마치면 면접자 평가 화면으로 간다', async ({ page }) => {
  await page.goto(interviewRoom('interviewer'));
  await page.clock.fastForward(roomTiming.part * 3);

  await page
    .getByRole('dialog', endDialog)
    .getByRole('button', { name: '평가표 작성하기' })
    .click();
  await expect(page).toHaveURL('/write-review');
  await expect(
    page.getByRole('heading', { name: '오늘의 면접자, 어땠나요?' }),
  ).toBeVisible();
});
