import { expect, type Page, test } from '@playwright/test';
import { installFakeMicrophone } from './support/fakeMicrophone.ts';

type StoredResume = {
  draft?: {
    experiences: { draft: { title: string; role: string } }[];
    answers: { draft: { text: string } }[];
  };
  resume?: { answers: { text: string }[] };
};

const email = 'tester@example.com';
const password = 'Example123';
const answer = (page: Page) =>
  page.getByRole('textbox', { name: '문항 1 답변', exact: true });
const experienceTitle = (page: Page) =>
  page.getByRole('textbox', { name: '경험 제목', exact: true });

async function startResume(page: Page) {
  await page.goto('/signup');
  const form = page.getByRole('region', { name: '방문 출입증부터 만들어요' });
  await form.getByRole('textbox', { name: '이메일' }).fill(email);
  await form.getByPlaceholder('영문, 숫자 포함 8자 이상').fill(password);
  await form.getByPlaceholder('비밀번호를 다시 입력해 주세요').fill(password);
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: '다음' }).click();
  await page.getByRole('textbox', { name: '닉네임' }).fill('검증수달');
  await page.getByRole('radio', { name: '남자 아바타' }).press('Space');
  await page.getByRole('button', { name: '이 모습으로 할게요' }).click();
  await expect(page).toHaveURL('/signup/resume');
}

async function readProgress(page: Page) {
  return page.evaluate(
    async ({ storageModule, email }) => {
      const { readSignupProgress } = await import(storageModule);
      const progress: StoredResume = await readSignupProgress(email);
      return {
        title: progress.draft?.experiences[0]?.draft.title,
        role: progress.draft?.experiences[0]?.draft.role,
        answer: progress.draft?.answers[0]?.draft.text,
        submittedAnswers: progress.resume?.answers.map(({ text }) => text),
      };
    },
    { storageModule: '/src/stores/signup/signupStorage.ts', email },
  );
}

test('두 탭의 서로 다른 편집을 병합하고 제출 직전 다른 탭의 답변을 포함한다', async ({
  page,
  context,
}) => {
  await startResume(page);
  const otherTab = await context.newPage();
  await installFakeMicrophone(otherTab);
  // 포커스에 따른 새로 읽기 없이 각 탭에 예전 초안이 남아 있는 상황을 만든다.
  await otherTab.addInitScript(() => {
    window.addEventListener(
      'focus',
      (event) => {
        if (event.target === window) event.stopImmediatePropagation();
      },
      true,
    );
  });
  await otherTab.goto('/login');
  const login = otherTab.getByRole('region', { name: '출입증 확인할게요' });
  await login.getByRole('textbox', { name: '이메일' }).fill(email);
  await login.getByPlaceholder('비밀번호를 입력해 주세요').fill(password);
  await login.getByRole('button', { name: '로그인' }).click();
  await expect(otherTab).toHaveURL(/\/waiting-room\?role=interviewee$/);
  await otherTab.goto('/signup/resume');
  await expect(experienceTitle(otherTab)).toHaveValue('');

  await experienceTitle(page).fill('첫 탭 경험');
  await answer(page).fill('첫 탭 답변');
  await expect
    .poll(async () => (await readProgress(page)).answer)
    .toBe('첫 탭 답변');
  await expect(answer(otherTab)).toHaveValue('');
  await otherTab
    .getByRole('textbox', { name: '역할', exact: true })
    .fill('둘째 탭 역할');
  await expect
    .poll(() => readProgress(otherTab))
    .toMatchObject({
      title: '첫 탭 경험',
      role: '둘째 탭 역할',
      answer: '첫 탭 답변',
    });

  await otherTab
    .getByRole('radio', { name: '신입', exact: true })
    .press('Space');
  await otherTab.getByRole('button', { name: '등록하고 시작하기' }).click();
  await otherTab
    .getByRole('dialog')
    .getByRole('button', { name: '완료' })
    .click();
  await expect(otherTab).toHaveURL('/signup/pass');
  await expect
    .poll(async () => (await readProgress(otherTab)).submittedAnswers)
    .toEqual(['첫 탭 답변']);
});

test('미완성 수정본이 있어도 마지막 저장 답변으로 등록한다', async ({
  page,
}) => {
  await startResume(page);
  await answer(page).fill('마지막 저장 답변');
  const answers = page.locator('section').filter({
    has: page.getByRole('heading', { name: '자기소개서', exact: true }),
  });
  await answers.getByRole('button', { name: '저장', exact: true }).click();
  await page.getByRole('button', { name: '수정', exact: true }).click();
  await answer(page).fill('   ');
  await page
    .getByRole('complementary', { name: '이력서 작성 현황' })
    .getByRole('listitem')
    .filter({ hasText: '자기소개서' })
    .getByText('1개')
    .waitFor();
  await page.getByRole('button', { name: '등록하고 시작하기' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '완료' }).click();
  await expect(page).toHaveURL('/signup/pass');
  await expect
    .poll(() => readProgress(page))
    .toMatchObject({
      answer: '   ',
      submittedAnswers: ['마지막 저장 답변'],
    });
});
