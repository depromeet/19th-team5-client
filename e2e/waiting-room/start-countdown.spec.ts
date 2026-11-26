import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { finishMicTest, waitingRoom } from '../support/waitingRoom.ts';

/** 대기실 목 시계(src/mocks/interview/interview.ts의 untilStart)와 같은 값 */
const untilStart = 60_000;

for (const role of ['interviewee', 'interviewer'] as const) {
  test(`시작 3초 전 카운트다운이 끝나면 ${role} 역할로 면접방에 들어간다`, async ({
    page,
  }) => {
    await installFakeMicrophone(page);
    await page.clock.install();
    await page.goto(waitingRoom(role));
    await finishMicTest(page);

    await page.clock.fastForward(untilStart - 3_000);
    await expect(page.getByText('3초뒤 면접이 시작됩니다.')).toBeVisible();
    // 카운트다운 동안에는 하단 독과 참가자 목록을 숨긴다.
    await expect(page.getByRole('region', { name: '참가자' })).toBeHidden();

    await page.clock.fastForward(3_000);
    await expect(page).toHaveURL(
      `/interviews/design-1400/interview-room?role=${role}`,
    );
    await expect(page.getByRole('heading', { name: '면접방' })).toBeAttached();
  });
}
