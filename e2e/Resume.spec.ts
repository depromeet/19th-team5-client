import { expect, test } from '@playwright/test';
import { chooseAvatar, submitSignup } from './support/signup.ts';

type StoredResume = {
  draft?: { experiences: { draft: { title: string } }[] };
  resume?: { experiences: { title: string }[]; answers: { text: string }[] };
};

test.beforeEach(async ({ page }) => {
  await page.goto('/signup');
  await submitSignup(page);
  await chooseAvatar(page, '차분한수달', '여자 아바타');
});

test('경험과 답변을 저장·수정하고 등록하면 선택한 아바타의 출입증을 발급한다', async ({
  page,
}) => {
  const register = page.getByRole('button', { name: '등록하고 시작하기' });
  await expect(register).toBeDisabled();
  await page.getByRole('textbox', { name: '경험 제목' }).fill('교내 공모전');
  await expect(register).toBeDisabled();
  const start = page.getByRole('textbox', { name: '시작', exact: false });
  await start.pressSequentially('202603');
  await expect(start).toHaveValue('2026.03');
  await start.press('Backspace');
  await start.press('Backspace');
  await expect(start).toHaveValue('2026');
  await start.pressSequentially('03');
  const end = page.getByRole('textbox', { name: '종료' });
  await end.fill('2026-01');
  await expect(end).toHaveValue('2026.01');
  await page.getByRole('textbox', { name: '역할' }).fill('기획자');
  await page
    .getByRole('textbox', { name: '내용' })
    .fill('팀 인터뷰를 진행해 예약 흐름을 개선했습니다.');
  await expect(page.getByRole('button', { name: '저장' })).toBeDisabled();
  await end.fill('2026.04');
  await page.getByRole('button', { name: '저장' }).click();
  await expect(register).toBeEnabled();
  await expect(page.getByText(/2개월/)).toBeVisible();
  await page.getByRole('button', { name: '수정' }).click();
  await page.getByRole('textbox', { name: '경험 제목' }).fill('취소할 수정');
  await page.getByRole('button', { name: '취소' }).click();
  await expect(
    page.getByRole('heading', { name: '교내 공모전' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '+ 경험 추가' }).click();
  await page.getByRole('button', { name: '취소' }).click();
  const picker = page.getByRole('combobox', {
    name: '자기소개서 1번째 문항 선택',
  });
  const lastQuestion = '문항 10 · 일할 때 가장 중요하게 생각하는 가치';
  await expect(picker.getByRole('option')).toHaveCount(10);
  await picker.selectOption({ label: lastQuestion });
  await page
    .getByRole('textbox', { name: '문항 10 답변' })
    .fill('맡은 결과를 팀과 투명하게 공유하는 일을 중요하게 생각합니다.');
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByRole('heading', { name: lastQuestion })).toBeVisible();
  await page.getByRole('button', { name: '+ 문항 추가' }).click();
  await expect(page.getByRole('option', { name: lastQuestion })).toBeDisabled();
  await page.getByRole('button', { name: '+ 문항 추가' }).click();
  await expect(
    page.getByRole('button', { name: '+ 문항 추가' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: '삭제', exact: true }).last().click();
  await page.getByRole('radio', { name: '1–3년' }).press('Space');
  await register.click();
  const dialog = page.getByRole('dialog', { name: '여기까지만 작성할까요?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '완료' }).click();
  await expect(page).toHaveURL(/\/signup\/pass$/);
  await expect(
    page.getByRole('img', { name: /차분한수달님의 MOING 방문 출입증/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: '로비로 입장하기' }),
  ).toHaveAttribute('href', '/lobby');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: /출입증 나왔어요/ }),
  ).toBeVisible();
});

test('PDF 형식·용량·개수를 검증하고 첨부 삭제 후 건너뛸 수 있다', async ({
  page,
}) => {
  const picker = page.locator('input[type=file]');
  const register = page.getByRole('button', { name: '등록하고 시작하기' });
  const pdf = (name: string) => ({
    name,
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.7\n%%EOF'),
  });
  await picker.setInputFiles({ ...pdf('test.txt'), mimeType: 'text/plain' });
  await expect(page.getByRole('alert')).toHaveText(
    'PDF 파일만 첨부할 수 있어요.',
  );
  await picker.setInputFiles({
    ...pdf('invalid.pdf'),
    buffer: Buffer.from('invalid'),
  });
  await expect(page.getByRole('alert')).toHaveText(
    '읽을 수 있는 PDF 파일을 선택해주세요.',
  );
  await picker.setInputFiles({
    ...pdf('large.pdf'),
    buffer: Buffer.alloc(20 * 1024 * 1024 + 1),
  });
  await expect(page.getByRole('alert')).toHaveText(
    '파일당 20MB 이하의 PDF를 선택해주세요.',
  );
  await picker.setInputFiles([pdf('a.pdf'), pdf('b.pdf'), pdf('c.pdf')]);
  await expect(page.getByRole('alert')).toHaveText(
    'PDF는 최대 2개까지 첨부할 수 있어요.',
  );
  await expect(register).toBeDisabled();
  await picker.setInputFiles([pdf('a.pdf'), pdf('b.pdf')]);
  await expect(page.getByText(/첨부 완료/)).toHaveCount(2);
  await expect(page.getByText('14B · 첨부 완료', { exact: true })).toHaveCount(
    2,
  );
  await page.getByRole('button', { name: 'a.pdf 삭제' }).click();
  await expect(page.getByText(/첨부 완료/)).toHaveCount(1);
  await expect(register).toBeEnabled();
  await page.getByRole('button', { name: '건너뛰기' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '완료' }).click();
  await expect(page).toHaveURL(/\/signup\/pass$/);
});

test('기본 경력을 직접 선택하면 지원 정보만으로 등록할 수 있다', async ({
  page,
}) => {
  const career = page.getByRole('radio', { name: '신입', exact: true });
  const register = page.getByRole('button', { name: '등록하고 시작하기' });
  await expect(career).toBeChecked();
  await expect(register).toBeDisabled();
  await career.press('Space');
  await expect(register).toBeEnabled();
  await register.click();
  const dialog = page.getByRole('dialog', { name: '여기까지만 작성할까요?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '완료' }).click();
  await expect(page).toHaveURL(/\/signup\/pass$/);
});

test('완성한 답변만 등록하고 미완성 경험은 초안으로 보관한다', async ({
  page,
}) => {
  const title = page.getByRole('textbox', { name: '경험 제목' });
  const register = page.getByRole('button', { name: '등록하고 시작하기' });
  const dialog = page.getByRole('dialog', { name: '여기까지만 작성할까요?' });
  await title.fill('작성 중인 경험');
  await expect(register).toBeDisabled();
  await page
    .getByRole('textbox', { name: '문항 1 답변' })
    .fill('팀과 진행 상황을 공유했습니다.');
  await expect(register).toBeEnabled();
  await register.click();
  await dialog.getByRole('button', { name: '좀 더 쓸게요' }).click();
  await expect(dialog).toBeHidden();
  await expect(register).toBeFocused();
  await register.click();
  await dialog.getByRole('button', { name: '완료' }).click();
  await expect(page).toHaveURL(/\/signup\/pass$/);
  const stored = await page.evaluate(
    async ({ modulePath, email }) => {
      const { readSignupProgress } = await import(modulePath);
      const { draft, resume }: StoredResume = await readSignupProgress(email);
      return {
        draftTitle: draft?.experiences[0]?.draft.title,
        submittedExperiences: resume?.experiences.map(({ title }) => title),
        submittedAnswers: resume?.answers.map(({ text }) => text),
      };
    },
    {
      modulePath: '/src/stores/signup/signupStorage.ts',
      email: 'tester@example.com',
    },
  );
  expect(stored).toEqual({
    draftTitle: '작성 중인 경험',
    submittedExperiences: [],
    submittedAnswers: ['팀과 진행 상황을 공유했습니다.'],
  });
});

test('빈 경험을 취소하고 다시 추가한 뒤 건너뛰기 팝업에서 작성을 이어가거나 완료한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const experience = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: '경험 · 경력' }) });
  await experience.getByRole('button', { name: '취소' }).click();
  await expect(experience.getByText('0개', { exact: true })).toBeVisible();
  await expect(experience.getByRole('textbox')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: '문항 1 답변' })).toHaveValue(
    '',
  );
  await expect(
    page.getByRole('button', { name: '등록하고 시작하기' }),
  ).toBeDisabled();
  await experience.getByRole('button', { name: '+ 경험 추가' }).click();
  const title = experience.getByRole('textbox', { name: '경험 제목' });
  await title.fill('작성 중인 경험');
  const skip = page.getByRole('button', { name: '건너뛰기' });
  const dialog = page.getByRole('dialog', { name: '여기까지만 작성할까요?' });
  await skip.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '좀 더 쓸게요' }).click();
  await expect(dialog).toBeHidden();
  await expect(title).toHaveValue('작성 중인 경험');
  await expect(skip).toBeFocused();
  await skip.click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await skip.click();
  await dialog.getByRole('button', { name: '완료' }).click();
  await expect(page).toHaveURL(/\/signup\/pass$/);
});
