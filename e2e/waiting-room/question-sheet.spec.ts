import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from '../support/fakeMicrophone.ts';
import { finishMicTest, waitingRoom } from '../support/waitingRoom.ts';

test('면접관은 Q로 질문지를 열고, 로비에서 쓴 질문을 불러온다', async ({
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
  await page.getByRole('button', { name: '저장하고 로비로' }).click();
  await expect(lobbySheet).toBeHidden();

  await page
    .getByRole('complementary', { name: '대기실 문 열렸어요' })
    .getByRole('button', { name: '확인' })
    .click();
  await expect(page).toHaveURL(waitingRoom('interviewer'));
  await finishMicTest(page);
  await expect(
    page.getByRole('button', { name: 'Space 김대리에게 말 걸기' }),
  ).toBeHidden();

  await page.keyboard.press('q');
  const sheet = page.getByRole('dialog', { name: '면접 준비해볼까요?' });
  await expect(
    sheet.getByRole('button', {
      name: '예약 완료율 18%는 어떤 지표로 확인했나요?',
    }),
  ).toBeVisible();
  await sheet.getByRole('button', { name: '저장하고 대기실로' }).click();
  await expect(sheet).toBeHidden();
});
