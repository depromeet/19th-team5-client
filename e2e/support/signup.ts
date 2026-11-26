import { expect, type Page } from '@playwright/test';

type AvatarChoice = '남자 아바타' | '여자 아바타';

export async function submitSignup(
  page: Page,
  email = 'tester@example.com',
  password = 'Example123',
) {
  const form = page.getByRole('region', { name: '방문 출입증부터 만들어요' });
  await form.getByRole('textbox', { name: '이메일' }).fill(email);
  await form.getByPlaceholder('영문, 숫자 포함 8자 이상').fill(password);
  await form.getByPlaceholder('비밀번호를 다시 입력해 주세요').fill(password);
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: '다음' }).click();
  await expect(page).toHaveURL(/\/signup\/avatar(?:[?#].*)?$/);
}

export async function chooseAvatar(
  page: Page,
  nickname = '검증수달',
  avatar: AvatarChoice = '남자 아바타',
) {
  await page.getByRole('textbox', { name: '닉네임' }).fill(nickname);
  await page.getByRole('radio', { name: avatar }).press('Space');
  await page.getByRole('button', { name: '이 모습으로 할게요' }).click();
  await expect(page).toHaveURL('/signup/resume');
}

export async function skipResume(page: Page) {
  await page.getByRole('button', { name: '건너뛰기' }).click();
  const dialog = page.getByRole('dialog', { name: '여기까지만 작성할까요?' });
  await dialog.getByRole('button', { name: '완료' }).click();
  await expect(page).toHaveURL('/signup/pass');
}
