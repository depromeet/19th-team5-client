import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { interviewRoom } from '../support/interviewRoom.ts';
import { finishMicTest, waitingRoom } from '../support/waitingRoom.ts';

test('Task3 지원자는 새 자소서를 읽고 각 부를 1분씩 진행한다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.clock.install();
  await page.goto('/');
  await page.getByRole('link', { name: 'Task3' }).click();
  await expect(page).toHaveURL(`${waitingRoom('interviewee')}&task=3`);
  await finishMicTest(page);

  await page.getByRole('button', { name: '내 자소서 펼치기' }).hover();
  const preview = page.getByRole('complementary', { name: '자기소개서 2문항' });
  await expect(preview).toContainText('프로젝트에서 개선할 문제를 발견한 경험');
  await preview.getByRole('button', { name: '자세히 보기' }).click();
  const resume = page.getByRole('dialog', { name: '내 자소서' });
  await expect(
    resume.getByText('프로젝트에서 개선할 문제를 발견한 경험', {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    resume.getByText('좌석을 선택한 사람 중 예약을 끝낸 비율', {
      exact: false,
    }),
  ).toBeVisible();

  await page.clock.fastForward(57_000);
  await expect(page.getByText('3초뒤 면접이 시작됩니다.')).toBeVisible();
  await page.clock.fastForward(3_000);
  await expect(page).toHaveURL(`${interviewRoom('interviewee')}&task=3`);
  const sit = page.getByRole('button', { name: 'Space 앉기' });
  await expect(sit).toBeEnabled();
  await sit.click();

  const stages = page.getByRole('list', { name: '면접 진행 단계' });
  await expect(stages.getByRole('listitem')).toHaveText([
    '1부 공통 질문 · 1분',
    '2부 커스텀 질문 · 1분',
    '3부 자유 질문 · 1분',
  ]);

  await page.clock.fastForward(30_000);
  await expect(stages.getByRole('listitem').first()).toHaveAttribute(
    'aria-current',
    'step',
  );
  await expect(
    page.getByRole('heading', { name: /간단하게 자기소개/ }),
  ).toBeVisible();

  await page.clock.fastForward(35_000);
  await expect(
    page.getByRole('heading', {
      name: /프로젝트에서 개선이 필요하다고 판단한 근거는 무엇이었나요/,
    }),
  ).toBeVisible();

  await page.clock.fastForward(60_000);
  await expect(
    page.getByRole('heading', {
      name: /그 개선이 효과가 있었는지는 어떻게 확인했나요/,
    }),
  ).toBeVisible();

  await page.clock.fastForward(55_000);
  await expect(
    page.getByRole('dialog', { name: '수고했어요, 면접 끝!' }),
  ).toBeVisible();
});
