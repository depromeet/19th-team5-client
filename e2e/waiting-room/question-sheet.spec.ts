import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { finishMicTest, waitingRoom } from '../support/waitingRoom.ts';

test('면접관은 로비에서 쓴 질문지를 대기실에서 읽기 전용으로 본다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.goto('/lobby?role=interviewer&phase=open');
  await page.getByRole('button', { name: '질문지 작성' }).click();
  const lobbySheet = page.getByRole('dialog', { name: '면접 준비해볼까요?' });
  await page.getByRole('button', { name: '질문 만들기', exact: true }).click();
  await page
    .getByRole('textbox', { name: '질문', exact: true })
    .fill('예약 완료율 18%는 어떤 지표로 확인했나요?');
  await page
    .getByRole('textbox', { name: '질문 의도' })
    .fill('성과를 숫자로 검증하는 습관이 있는지 보고 싶어요');
  await page.getByRole('button', { name: '저장하고 로비로' }).click();
  await expect(lobbySheet).toBeHidden();

  await page
    .getByRole('complementary', { name: '대기실 문 열렸어요' })
    .getByRole('button', { name: '확인' })
    .click();
  await expect(page).toHaveURL(waitingRoom('interviewer'));
  await finishMicTest(page);

  // 대기실에서는 질문지를 고칠 수 없어 Q 단축키와 독의 질문지 버튼이 없다.
  await page.keyboard.press('q');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^질문지/ })).toHaveCount(0);

  // 우측 하단 버튼에 마우스를 올리면 요약 카드로 펼친다.
  await page.getByRole('button', { name: '작성한 질문지 펼치기' }).hover();
  const card = page.getByRole('complementary', { name: '2부 질문 1개' });
  await expect(card).toContainText('대기실에서는 볼 수만 있어요');
  await expect(card).toContainText('예약 완료율 18%는 어떤 지표로 확인했나요?');

  await card.getByRole('button', { name: '자세히 보기' }).click();
  await expect(card).toBeHidden();
  const sheet = page.getByRole('dialog', { name: '작성한 질문지' });
  await expect(
    sheet.getByRole('heading', { name: '2부에서 물어볼 질문 1개' }),
  ).toBeVisible();
  await expect(
    sheet.getByText('예약 완료율 18%는 어떤 지표로 확인했나요?'),
  ).toBeVisible();
  await expect(
    sheet.getByText('성과를 숫자로 검증하는 습관이 있는지 보고 싶어요'),
  ).toBeVisible();
  await expect(sheet.getByRole('textbox')).toHaveCount(0);

  // 다른 면접자에게는 아직 질문을 쓰지 않았다. 공통 Radio는 칩(label)을 눌러 고른다.
  await sheet.getByText('면접자 B', { exact: true }).click();
  await expect(
    sheet.getByText('이 면접자에게 작성한 질문이 없어요'),
  ).toBeVisible();

  await sheet.getByRole('button', { name: '대기실로 돌아가기' }).click();
  await expect(sheet).toBeHidden();
});

test('면접관도 같은 대기실에서 Space로 김대리에게 말을 건다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.goto(waitingRoom('interviewer'));
  await finishMicTest(page);

  await expect(
    page.getByRole('button', { name: 'Space 김대리에게 말 걸기' }),
  ).toBeVisible();
  await page.keyboard.press('Space');
  const sheet = page.getByRole('dialog', { name: '김대리' });
  await expect(sheet).toBeVisible();
  await sheet.getByRole('button', { name: '김대리와 대화 닫기' }).click();
  await expect(sheet).toBeHidden();
});
