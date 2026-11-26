import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { interviewRoom, roomTiming } from '../support/interviewRoom.ts';

test('면접자는 부마다 면접관이 고른 질문을 받고, 3부가 끝나면 종료 안내를 본다', async ({
  page,
}) => {
  const { questionDelay, part } = roomTiming;
  await installFakeMicrophone(page);
  await page.clock.install();
  await page.goto(interviewRoom('interviewee'));
  await expect(page.getByRole('button', { name: 'Space 앉기' })).toBeVisible();
  await page.keyboard.press('Space');

  // 부가 시작되면 면접관이 질문을 고르는 동안 안내를 보여주고, 잠시 뒤 질문을 띄운다.
  await expect(
    page.getByRole('heading', { name: '면접관이 질문을 고르고 있어요' }),
  ).toBeVisible();
  await page.clock.fastForward(questionDelay);
  await expect(
    page.getByRole('heading', { name: '간단하게 자기소개 부탁드려요.' }),
  ).toBeVisible();
  await expect(page.getByText('1부 공통 질문 · 1 / 3')).toBeVisible();

  await page.clock.fastForward(part - questionDelay);
  await expect(page.getByText('2부 커스텀 질문을 시작해요')).toBeVisible();
  await page.clock.fastForward(questionDelay);
  await expect(
    page.getByRole('heading', {
      name: '예약 완료율 18%는 어떤 지표로 확인했나요?',
    }),
  ).toBeVisible();

  // 2부가 끝나는 시각을 지나 3부의 질문이 뜰 때까지 한 번에 넘긴다.
  await page.clock.fastForward(part);
  await expect(
    page.getByRole('heading', {
      name: '18%를 올리려고 가장 먼저 바꾼 건 뭐였나요?',
    }),
  ).toBeVisible();
  await expect(page.getByText('3부 자유 질문 · 꼬리질문')).toBeVisible();

  await page.clock.fastForward(part - questionDelay);
  const end = page.getByRole('dialog', { name: '수고했어요, 면접 끝!' });
  await expect(end).toBeVisible();
  await expect(
    end.getByRole('button', { name: '로비로 돌아가기' }),
  ).toBeVisible();
  await expect(
    end.getByRole('button', { name: '면접관 평가하기' }),
  ).toBeVisible();
});

test('하단 독에서 마이크를 끄고 켠다', async ({ page }) => {
  await installFakeMicrophone(page);
  await page.goto(interviewRoom('interviewee'));

  const mic = page.getByRole('button', { name: '마이크', exact: true });
  await expect(mic).toHaveAttribute('aria-pressed', 'true');
  await mic.click();
  await expect(mic).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByText('마이크 꺼짐')).toBeVisible();
  await mic.click();
  await expect(page.getByText('마이크 켜짐')).toBeVisible();
});
