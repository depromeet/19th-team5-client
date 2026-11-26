import { expect, test } from '@playwright/test';
import { installFakeMicrophone } from './support/fakeMicrophone.ts';
import { skipResume, submitSignup } from './support/signup.ts';
import { micTestDialog, waitingRoom } from './support/waitingRoom.ts';

test('가입 정보를 검증한 뒤 아바타로 이동하고 뒤로 가면 가입 폼으로 돌아간다', async ({
  page,
}) => {
  await page.goto('/');
  await page.goto('/signup/?from=home#nickname');
  await expect(
    page.getByRole('heading', { name: '방문 출입증부터 만들어요' }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: '이메일' })
    .fill('tester@example.com');
  const password = page.getByPlaceholder('영문, 숫자 포함 8자 이상');
  await password.fill('short');
  await page.getByPlaceholder('비밀번호를 다시 입력해 주세요').fill('short');
  const next = page.getByRole('button', { name: '다음' });
  await next.click();
  await expect(password).toBeFocused();
  await password.fill('Example123');
  await page.getByRole('checkbox').check();
  await next.click();
  await expect(page.getByText('비밀번호가 서로 달라요')).toBeVisible();
  await expect(
    page.getByPlaceholder('비밀번호를 다시 입력해 주세요'),
  ).toBeFocused();
  await page
    .getByPlaceholder('비밀번호를 다시 입력해 주세요')
    .fill('Example123');
  await page.getByRole('checkbox').uncheck();
  await next.click();
  await expect(page.getByRole('checkbox')).toBeFocused();
  await page.getByRole('checkbox').check();
  await next.click();
  await expect(page).toHaveURL(/\/signup\/avatar\?from=home#nickname$/);
  await expect(page.getByRole('textbox', { name: '닉네임' })).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole('heading', { name: '방문 출입증부터 만들어요' }),
  ).toBeVisible();
  await expect(password).toBeEmpty();
  await page.goBack();
  await expect(page).toHaveURL('/');
  const resume = page.getByRole('link', { name: '가입 이어하기' });
  await expect(resume).toHaveAttribute('href', '/signup/avatar');
  await resume.click();
  await expect(page).toHaveURL('/signup/avatar');
});

test('닉네임은 공백 포함 6자까지 허용하고 아바타를 선택해야 다음으로 이동한다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.goto('/');
  await page.getByRole('link', { name: '회원가입', exact: true }).click();
  await submitSignup(page);
  const confirm = page.getByRole('button', { name: '이 모습으로 할게요' });
  const nickname = page.getByRole('textbox', { name: '닉네임' });
  await expect(confirm).toBeDisabled();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.getByAltText('여자 아바타 전신 미리보기')).toBeVisible();
  await nickname.fill('차분한 수달');
  await expect(page.getByText('6 / 6')).toBeVisible();
  await expect(confirm).toBeDisabled();
  await page.getByLabel('남자 아바타', { exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByAltText('남자 아바타 전신 미리보기')).toBeVisible();
  await expect(confirm).toBeEnabled();
  await nickname.fill('차분한 수달달');
  await expect(page.getByText('7 / 6')).toBeVisible();
  await expect(nickname).toHaveAttribute('aria-invalid', 'true');
  await expect(confirm).toBeDisabled();
  await nickname.fill('  ');
  await expect(confirm).toBeDisabled();
  await nickname.fill('차분한 수달');
  await confirm.click();
  await expect(page).toHaveURL('/signup/resume');
  await expect(page.getByRole('textbox', { name: '경험 제목' })).toBeVisible();
  await page.goBack();
  await expect(nickname).toHaveValue('차분한 수달');
  await expect(page.getByRole('radio', { name: '남자 아바타' })).toBeChecked();
  await confirm.click();
  await skipResume(page);
  await expect(
    page.getByRole('heading', { name: /출입증 나왔어요/ }),
  ).toBeVisible();
  const issuedPass = page.getByRole('img', {
    name: /차분한 수달님의 MOING 방문 출입증/,
  });
  await expect(issuedPass).toBeVisible();
  await page.reload();
  await expect(issuedPass).toBeVisible();
  await page.goto('/signup/avatar');
  await expect(page).toHaveURL('/signup/pass');
  await expect(issuedPass).toBeVisible();
  await page.getByRole('link', { name: '대기실 입장하기' }).click();
  await expect(page).toHaveURL(waitingRoom('interviewee'));
  await expect(micTestDialog(page)).toBeVisible();
});

test('가입 정보가 없는 직접 접근을 처리하고 모바일에서 랜덤 이름과 아바타를 변경한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/signup/resume');
  await expect(page).toHaveURL('/signup');
  await submitSignup(page);
  await page.goto('/signup/resume');
  await expect(page).toHaveURL('/signup/avatar');
  const draw = page.getByRole('button', { name: '랜덤으로 뽑기' });
  const nickname = page.getByRole('textbox', { name: '닉네임' });
  await draw.click();
  await expect(nickname).not.toHaveValue('');
  const first = await nickname.inputValue();
  await draw.click();
  await expect(nickname).not.toHaveValue(first);
  await page.getByRole('radio', { name: '남자 아바타' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: '여자 아바타' })).toBeChecked();
  const rotate = page.getByRole('button', { name: '아바타 좌우 돌려보기' });
  await rotate.click();
  await expect(rotate).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '이 모습으로 할게요' }).click();
  await expect(page).toHaveURL('/signup/resume');
  await expect(
    page.getByRole('heading', { name: '경험을 쓸수록 질문이 날카로워져요' }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('radio', { name: '여자 아바타' })).toBeChecked();
  await expect(page.getByAltText('여자 아바타 전신 미리보기')).toHaveAttribute(
    'src',
    '/images/signup/girl.png',
  );
});
