import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { interviewRoom, roomTiming } from '../support/interviewRoom.ts';

test('면접관은 질문 카드에서 면접자마다 메모를 남기고, 3부에서 지난 메모를 다시 본다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.clock.install();
  await page.goto(interviewRoom('interviewer'));

  const sheet = page.getByRole('dialog', { name: '면접관 질문 카드' });
  await expect(
    sheet.getByRole('heading', { name: '간단하게 자기소개 부탁드려요.' }),
  ).toBeVisible();
  await sheet.getByRole('button', { name: '다음 질문' }).click();
  await expect(
    sheet.getByRole('heading', {
      name: '팀 프로젝트에서 맡은 역할과 기여한 성과는 무엇인가요?',
    }),
  ).toBeVisible();

  const memo = sheet.getByRole('textbox', { name: '면접 메모' });
  const save = sheet.getByRole('button', { name: '저장' });
  await expect(save).toBeDisabled();
  await memo.fill('역할과 성과를 수치로 설명함.');
  await save.click();
  await expect(save).toBeDisabled();

  // 면접자를 바꾸면 그 면접자의 메모 칸을, 돌아오면 저장한 메모를 보여준다.
  await sheet.getByRole('button', { name: '면접자 B' }).click();
  await expect(memo).toHaveValue('');
  await sheet.getByRole('button', { name: '면접자 A' }).click();
  await expect(memo).toHaveValue('역할과 성과를 수치로 설명함.');

  await page.clock.fastForward(roomTiming.part);
  await expect(
    sheet.getByText('의도 · 성과를 숫자로 검증하는 습관이 있는지 봐요.'),
  ).toBeVisible();
  await sheet.getByRole('button', { name: '2부 건너뛰기' }).click();

  // 메모를 남긴 면접자는 저장한 메모를, 남기지 않은 면접자는 목 메모를 본다.
  const history = sheet.getByRole('region', { name: '지난 메모' });
  await expect(history.getByRole('listitem')).toHaveCount(1);
  await expect(history.getByRole('listitem')).toContainText(
    '역할과 성과를 수치로 설명함.',
  );
  await sheet.getByRole('button', { name: '면접자 B' }).click();
  await expect(history.getByRole('listitem')).toHaveCount(2);

  await sheet.getByRole('button', { name: '면접 마치기' }).click();
  await expect(sheet).toBeHidden();
  const end = page.getByRole('dialog', { name: '수고했어요, 면접 끝!' });
  // 평가표 마감은 5분부터 줄어든다. 가짜 시계도 실제 시간만큼 흐르므로 몇 초의 차이는 허용한다.
  const deadline = end.locator('time');
  await expect(deadline).toHaveText(/^(05:00|04:5\d)$/);
  await page.clock.fastForward(60_000);
  await expect(deadline).toHaveText(/^(04:00|03:5\d)$/);
  await expect(
    end.getByRole('button', { name: '평가표 작성하기' }),
  ).toBeVisible();
});
