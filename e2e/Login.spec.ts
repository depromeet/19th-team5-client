import { expect, test } from '@playwright/test';
import { chooseAvatar, skipResume, submitSignup } from './support/signup.ts';

test('로그인과 회원가입의 비밀번호를 필드별로 표시하고 다시 가릴 수 있다', async ({
  page,
}) => {
  await page.goto('/login');
  const loginPassword = page.getByPlaceholder('비밀번호를 입력해 주세요');
  const toggle = page.getByRole('button', {
    name: '비밀번호 표시',
    exact: true,
  });
  await expect(loginPassword).toHaveAttribute('type', 'password');
  await loginPassword.fill('Example123');
  await loginPassword.press('Tab');
  await expect(toggle).toBeFocused();
  await toggle.press('Space');
  await expect(loginPassword).toHaveAttribute('type', 'text');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.press('Enter');
  await expect(loginPassword).toHaveAttribute('type', 'password');
  await expect(loginPassword).toHaveValue('Example123');

  await page.getByRole('link', { name: '회원가입' }).click();
  const password = page.getByPlaceholder('영문, 숫자 포함 8자 이상');
  const confirmation = page.getByPlaceholder('비밀번호를 다시 입력해 주세요');
  const confirmToggle = page.getByRole('button', {
    name: '비밀번호 확인 표시',
  });
  await password.fill('Example123');
  await confirmation.fill('Example321');
  await toggle.click();
  await expect(password).toHaveAttribute('type', 'text');
  await expect(confirmation).toHaveAttribute('type', 'password');
  await confirmToggle.click();
  await expect(confirmation).toHaveAttribute('type', 'text');
  await expect(confirmation).toHaveAccessibleDescription(
    '비밀번호가 서로 달라요',
  );
  await toggle.click();
  await expect(password).toHaveAttribute('type', 'password');
  await expect(confirmation).toHaveAttribute('type', 'text');
  await confirmToggle.click();
  await expect(confirmation).toHaveAttribute('type', 'password');
  await expect(confirmation).toHaveValue('Example321');
});

test('모바일에서 로그인 화면을 거쳐 가입하고 첫 오류부터 수정해 아바타 단계로 이동한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('link', { name: '로그인' }).click();
  await expect(page).toHaveURL(/\/login$/);

  const main = page.getByRole('main');
  const email = main.getByRole('textbox', { name: '이메일' });
  await email.fill('invalid-email');
  await main.getByRole('button', { name: '로그인' }).click();
  await expect(email).toBeFocused();
  await email.fill('tester@example.com');
  await main.getByPlaceholder('비밀번호를 입력해 주세요').fill('Example123');
  await main.getByPlaceholder('비밀번호를 입력해 주세요').press('Enter');
  await expect(main.getByRole('alert')).toContainText(
    '이메일 또는 비밀번호를 확인',
  );
  await main.getByRole('link', { name: '회원가입' }).click();
  await expect(page).toHaveURL(/\/signup$/);

  const signup = page.getByRole('region', { name: '방문 출입증부터 만들어요' });
  await signup
    .getByRole('textbox', { name: '이메일' })
    .fill('tester@example.com');
  const password = main.getByPlaceholder('영문, 숫자 포함 8자 이상');
  const confirmation = main.getByPlaceholder('비밀번호를 다시 입력해 주세요');
  const next = main.getByRole('button', { name: '다음' });
  await password.fill('Example123');
  await confirmation.fill('Example321');
  await next.click();
  await expect(confirmation).toBeFocused();
  await expect(confirmation).toHaveAccessibleDescription(
    '비밀번호가 서로 달라요',
  );

  await password.fill('Example321');
  await expect(confirmation).not.toHaveAttribute('aria-invalid', 'true');
  await next.click();
  const consent = main.getByRole('checkbox');
  await expect(consent).toBeFocused();
  await consent.press('Space');
  await next.press('Enter');
  await expect(page).toHaveURL(/\/signup\/avatar$/);
  await expect(page.getByRole('textbox', { name: '닉네임' })).toBeVisible();
});

test('출입증을 발급받은 계정은 새 탭에서 다시 로그인하면 로비로 이동한다', async ({
  page,
  context,
}) => {
  const address = 'mock-member@example.com';
  const password = 'MockMember123';
  await page.goto('/signup');
  await submitSignup(page, address, password);
  await chooseAvatar(page, '모의수달');
  await skipResume(page);
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText(address);
  await page.reload();
  await expect(page.getByRole('status')).toContainText(address);
  await page.getByRole('button', { name: '로그아웃' }).click();
  await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();

  const tab = await context.newPage();
  // 새 탭에서 중복 가입을 시도해도 기존 비밀번호가 바뀌지 않는다.
  await tab.goto('/signup');
  await tab
    .getByRole('textbox', { name: '이메일' })
    .fill(address.toUpperCase());
  await tab.getByPlaceholder('영문, 숫자 포함 8자 이상').fill('Different123');
  await tab
    .getByPlaceholder('비밀번호를 다시 입력해 주세요')
    .fill('Different123');
  await tab.getByRole('checkbox').check();
  await tab.getByRole('button', { name: '다음' }).click();
  await expect(tab.getByRole('alert')).toContainText('이미 가입한 이메일');
  await tab.getByRole('alert').getByRole('link', { name: '로그인' }).click();
  const login = tab.getByRole('region', { name: '출입증 확인할게요' });
  await login
    .getByRole('textbox', { name: '이메일' })
    .fill(address.toUpperCase());
  await login.getByPlaceholder('비밀번호를 입력해 주세요').fill('Different123');
  await login.getByRole('button', { name: '로그인' }).click();
  await expect(login.getByRole('alert')).toContainText(
    '이메일 또는 비밀번호를 확인',
  );
  await login.getByPlaceholder('비밀번호를 입력해 주세요').fill(password);
  await login.getByPlaceholder('비밀번호를 입력해 주세요').press('Enter');
  await expect(tab).toHaveURL('/lobby');
  await tab.goto('/');
  await expect(tab.getByRole('status')).toContainText(address);
});
