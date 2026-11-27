import { expect, test } from '@playwright/test';
import { task4CustomQuestions } from '../../src/mocks/interview-room/task4Questions.ts';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { interviewRoom } from '../support/interviewRoom.ts';
import { finishMicTest, waitingRoom } from '../support/waitingRoom.ts';

test('Task4 면접관은 2부에서 질문을 넘기고 3부에서 면접자별 지난 메모를 본다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.clock.install();
  await page.goto('/');
  await page.getByRole('link', { name: 'Task4' }).click();
  await expect(page).toHaveURL(`${waitingRoom('interviewer')}&task=4`);
  await finishMicTest(page);

  await page.getByRole('button', { name: '작성한 질문지 펼치기' }).hover();
  const preview = page.getByRole('complementary', { name: '2부 질문 6개' });
  await expect(preview.getByRole('listitem')).toHaveCount(3);
  await expect(preview).toContainText(task4CustomQuestions.A[0].text);
  await preview.getByRole('button', { name: '자세히 보기' }).click();
  const questions = page.getByRole('dialog', { name: '작성한 질문지' });
  const candidateSelection = questions.getByRole('group', {
    name: '면접자 선택',
  });
  for (const candidate of ['A', 'B'] as const) {
    await candidateSelection
      .getByText(`면접자 ${candidate}`, { exact: true })
      .click();
    await expect(
      questions.getByRole('heading', { name: '2부에서 물어볼 질문 3개' }),
    ).toBeVisible();
    for (const question of task4CustomQuestions[candidate]) {
      await expect(questions.getByText(question.text)).toBeVisible();
    }
  }
  await questions.getByRole('button', { name: '대기실로 돌아가기' }).click();

  await page.clock.fastForward(57_000);
  await expect(page.getByText(/[1-3]초뒤 면접이 시작됩니다/)).toBeVisible();
  await page.clock.fastForward(3_000);
  await expect(page).toHaveURL(`${interviewRoom('interviewer')}&task=4`);

  const stages = page.getByRole('list', { name: '면접 진행 단계' });
  const sheet = page.getByRole('dialog', { name: '면접관 질문 카드' });
  const memo = sheet.getByRole('textbox', { name: '면접 메모' });
  const save = sheet.getByRole('button', { name: '저장' });
  const next = sheet.getByRole('button', { name: '다음 질문' });

  await expect(stages.getByRole('listitem')).toHaveText([
    '1부 공통 질문 · 40초',
    '2부 커스텀 질문 · 40초',
    '3부 자유 질문 · 40초',
  ]);
  await page.clock.fastForward(30_000);
  await expect(
    sheet.getByRole('heading', { name: /간단하게 자기소개/ }),
  ).toBeVisible();
  await memo.fill('개선 작업을 시작한 근거를 설명함.');
  await save.click();
  await page.clock.fastForward(10_000);
  await expect(stages.getByRole('listitem').nth(1)).toHaveAttribute(
    'aria-current',
    'step',
  );

  for (const candidate of ['A', 'B'] as const) {
    await sheet.getByRole('button', { name: `면접자 ${candidate}` }).click();
    const [first, second, third] = task4CustomQuestions[candidate];
    await expect(
      sheet.getByRole('heading', { name: first.text }),
    ).toBeVisible();
    await next.click();
    await expect(
      sheet.getByRole('heading', { name: second.text }),
    ).toBeVisible();
    await next.click();
    await expect(
      sheet.getByRole('heading', { name: third.text }),
    ).toBeVisible();
    await expect(next).toBeDisabled();
    await memo.fill(`면접자 ${candidate}의 2부 답변을 기록함.`);
    await save.click();
  }

  await page.clock.fastForward(40_000);
  await expect(stages.getByRole('listitem').nth(2)).toHaveAttribute(
    'aria-current',
    'step',
  );
  await expect(next).toHaveCount(0);
  await expect(sheet.getByRole('button', { name: '이전 질문' })).toHaveCount(0);
  const history = sheet.getByRole('region', { name: '지난 메모' });
  await expect(history.getByRole('listitem')).toHaveCount(1);
  await expect(history).toContainText('면접자 B의 2부 답변을 기록함.');

  await sheet.getByRole('button', { name: '면접자 A' }).click();
  const previousMemos = history.getByRole('listitem');
  await expect(previousMemos).toHaveCount(2);
  await expect(previousMemos.first()).toContainText(
    '개선 작업을 시작한 근거를 설명함.',
  );
  await expect(previousMemos.last()).toContainText(
    '면접자 A의 2부 답변을 기록함.',
  );

  await memo.fill('자유질문에서 확인한 내용을 기록함.');
  await save.click();
  await expect(memo).toHaveValue('');
  await expect(previousMemos).toHaveCount(2);

  await page.clock.fastForward(40_000);

  await expect(
    page.getByRole('button', { name: '평가표 작성하기' }),
  ).toBeVisible();
});
