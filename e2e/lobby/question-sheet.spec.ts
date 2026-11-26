import { expect, type Page, test } from '@playwright/test';

/** 로비 알림에서 질문지를 연다. 질문지는 로비 위에 뜨는 오버레이다. */
async function openQuestionSheet(page: Page) {
  await page.goto('/lobby?role=interviewer&phase=prepare');
  await page
    .getByRole('complementary', { name: '면접자 서류 도착!' })
    .getByRole('button', { name: '확인' })
    .click();
  const sheet = page.getByRole('dialog', { name: '면접 준비해볼까요?' });
  await expect(sheet).toBeVisible();
  return sheet;
}

test('질문 의도가 50자를 넘으면 알리고, 고치기 전에 나가면 확인한다', async ({
  page,
}) => {
  const sheet = await openQuestionSheet(page);
  await page
    .getByRole('button', { name: '+ 서류를 읽으며 질문 만들기' })
    .click();
  await page
    .getByRole('textbox', { name: '질문', exact: true })
    .fill('A/B 테스트 결과가 예상과 달랐다면 어떻게 했을까요?');

  const intent = page.getByRole('textbox', { name: '질문 의도' });
  await intent.fill('가'.repeat(51));
  await expect(page.getByText('50자 이내로 줄여 주세요')).toBeVisible();
  await expect(page.getByText('51 / 50')).toBeVisible();

  await page.getByRole('button', { name: '저장하고 로비로' }).click();
  const unsaved = page.getByRole('dialog', { name: '작성 중인 질문이 있어요' });
  await unsaved.getByRole('button', { name: '취소' }).click();
  await expect(unsaved).toBeHidden();

  await intent.fill('가설이 틀렸을 때의 대처를 보고 싶어요');
  await page.getByRole('button', { name: '질문 준비 끝내기' }).click();
  await page
    .getByRole('dialog', { name: '면접 준비 끝! 이제 기다리기만 하면 돼요' })
    .getByRole('button', { name: '저장하고 나가기' })
    .click();
  await expect(sheet).toBeHidden();

  // 로비에서 다시 열면 저장한 질문을 불러온다.
  await page
    .getByRole('complementary', { name: '면접자 서류 도착!' })
    .getByRole('button', { name: '확인' })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'A/B 테스트 결과가 예상과 달랐다면 어떻게 했을까요?',
    }),
  ).toBeVisible();
  await expect(page.getByText('의도 ✓')).toBeVisible();
});

test('질문은 면접자마다 3개까지 만들 수 있다', async ({ page }) => {
  await openQuestionSheet(page);
  const questionInput = page.getByRole('textbox', {
    name: '질문',
    exact: true,
  });

  await page
    .getByRole('button', { name: '+ 서류를 읽으며 질문 만들기' })
    .click();
  await questionInput.fill('첫 번째 질문');
  for (const question of ['두 번째 질문', '세 번째 질문']) {
    await page.getByRole('button', { name: '+ 질문 추가하기' }).click();
    await questionInput.fill(question);
  }

  await expect(page.getByText('3 / 3')).toBeVisible();
  await expect(
    page.getByRole('button', { name: '+ 질문 추가하기' }),
  ).toBeDisabled();
  await expect(page.getByText('질문은 3개까지 만들 수 있어요.')).toBeVisible();

  // 다른 면접자의 질문지는 따로 쓴다. 공통 Radio는 칩(label)을 눌러 고른다.
  await page.getByText('면접자 B', { exact: true }).click();
  await expect(page.getByRole('radio', { name: '면접자 B' })).toBeChecked();
  await expect(page.getByText('0 / 3')).toBeVisible();
});
