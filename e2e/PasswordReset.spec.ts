import { expect, type Page, test } from '@playwright/test';

const address = 'reset-member@example.com';
const oldPassword = 'Original123';
const newPassword = 'Updated123';

async function registerAndLogOut(page: Page) {
  await page.goto('/signup');
  await page.getByRole('textbox', { name: '이메일' }).fill(address);
  await page.getByPlaceholder('영문, 숫자 포함 8자 이상').fill(oldPassword);
  await page
    .getByPlaceholder('비밀번호를 다시 입력해 주세요')
    .fill(oldPassword);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: '다음' }).click();
  await expect(page).toHaveURL(/\/signup\/avatar$/);
  await page.goto('/');
  await page.getByRole('button', { name: '로그아웃' }).click();
  await page.getByRole('link', { name: '로그인', exact: true }).click();
  await page.getByRole('link', { name: '비밀번호 찾기' }).click();
}

async function requestLink(page: Page, email = address) {
  await page.getByRole('textbox', { name: '이메일' }).fill(email);
  await page.getByRole('button', { name: '재설정 링크 요청' }).click();
}

test('재설정을 새로고침 후 이어서 완료하고 새 비밀번호로 로그인한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await registerAndLogOut(page);
  await requestLink(page, 'unknown@example.com');
  await expect(page.getByRole('alert')).toHaveText(
    '가입한 이메일을 확인해 주세요.',
  );
  await expect(
    page.getByRole('link', { name: '비밀번호 재설정하기' }),
  ).toHaveCount(0);
  await requestLink(page, address.toUpperCase());
  await expect(page.getByRole('region', { name: '모의 메일함' })).toContainText(
    address,
  );
  await page.reload();
  await page.getByRole('link', { name: '비밀번호 재설정하기' }).click();
  await page.reload();
  const password = page.getByPlaceholder('영문, 숫자 포함 8자 이상');
  const confirmation = page.getByPlaceholder('비밀번호를 다시 입력해 주세요');
  await password.fill(newPassword);
  await confirmation.fill(oldPassword);
  await page.getByRole('button', { name: '비밀번호 변경' }).click();
  await expect(confirmation).toBeFocused();
  await expect(confirmation).toHaveAccessibleDescription(
    '비밀번호가 서로 달라요',
  );
  await confirmation.fill(newPassword);
  await page.getByRole('button', { name: '비밀번호 변경' }).click();
  await expect(
    page.getByRole('heading', { name: '비밀번호를 변경했어요' }),
  ).toBeVisible();
  await page.getByRole('link', { name: '로그인하기' }).click();
  const login = page.getByRole('main');
  await login.getByRole('textbox', { name: '이메일' }).fill(address);
  const loginPassword = login.getByPlaceholder('비밀번호를 입력해 주세요');
  await loginPassword.fill(oldPassword);
  await loginPassword.press('Enter');
  await expect(login.getByRole('alert')).toHaveText(
    '이메일 또는 비밀번호를 확인해 주세요.',
  );
  await loginPassword.fill(newPassword);
  await loginPassword.press('Enter');
  await expect(page).toHaveURL(/\/signup\/avatar$/);
  await expect(page.getByRole('textbox', { name: '닉네임' })).toBeVisible();
  await page.goto('/reset-password');
  await expect(
    page.getByRole('link', { name: '새 링크 요청하기' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      (values) => {
        const stored = JSON.stringify([sessionStorage, localStorage]);
        return values.every((value) => !stored.includes(value));
      },
      [oldPassword, newPassword],
    ),
  ).toBe(true);
});

test('만료된 링크는 재발급한 뒤에만 다시 사용할 수 있다', async ({ page }) => {
  await registerAndLogOut(page);
  const now = new Date();
  await page.clock.setFixedTime(now);
  await requestLink(page);
  await page.getByRole('link', { name: '비밀번호 재설정하기' }).click();
  await page.clock.setFixedTime(new Date(now.getTime() + 16 * 60 * 1000));
  await page.getByPlaceholder('영문, 숫자 포함 8자 이상').fill(newPassword);
  await page
    .getByPlaceholder('비밀번호를 다시 입력해 주세요')
    .fill(newPassword);
  await page.getByRole('button', { name: '비밀번호 변경' }).click();
  await page.getByRole('link', { name: '새 링크 요청하기' }).click();
  await requestLink(page);
  await page.getByRole('link', { name: '비밀번호 재설정하기' }).click();
  await expect(
    page.getByRole('heading', { name: '새 비밀번호 설정' }),
  ).toBeVisible();
});
