import { expect, test } from '@playwright/test';

test('받은 평가는 직접 열어 조회할 수 있고 작성 시간을 시작하지 않는다', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/received-review');
  await expect(
    page.getByRole('heading', { name: '받은 키워드' }),
  ).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveCount(0);
  const menu = page.getByRole('navigation', { name: '주 메뉴' });
  await expect(menu.getByRole('button', { name: '로비' })).toBeDisabled();
  await expect(menu.getByRole('button', { name: '마이페이지' })).toBeDisabled();
  await expect(menu.getByRole('button', { name: /알림/ })).toBeDisabled();
  await expect(
    page.getByRole('button', { name: '면접방 예약' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: '다른 면접 예약' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: '로비로 돌아가기' }),
  ).toBeDisabled();
  await page.getByText('면접관 2', { exact: true }).click();
  await expect(page.getByText(/다음에는 선택의 근거도/)).toBeVisible();
  await page.getByText('2부 커스텀 질문', { exact: true }).click();
  await page.getByText(/Q1\. A\/B 테스트의 결과/).click();
  await expect(page.getByText(/가설 → 성공 지표/)).toBeVisible();
  await page.clock.fastForward(6 * 60_000);
  await page.goto('/write-review');
  await expect(page.getByRole('textbox')).toBeEditable();
  await expect(page.getByRole('timer')).toBeVisible();
});

test('좁은 화면에서 제출 후 누락 항목 또는 다음 면접자 탭으로 이동한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/write-review');
  const submit = page.getByRole('button', { name: '제출하기' });
  await page.getByText('구체적인 사례', { exact: true }).click();
  await submit.click();
  await expect(
    page.getByRole('checkbox', { name: '답변이 길어요' }),
  ).toBeFocused();
  await expect(page.getByRole('alert')).toBeInViewport();
  await page.getByText('없어요', { exact: true }).click();
  await submit.click();
  const next = page.getByRole('tab', { name: '면접자 B' });
  await expect(next).toBeFocused();
  await expect(next).toBeInViewport();
});

test('키보드로 평가 탭을 이동해도 면접자별 미저장 입력을 유지한다', async ({
  page,
}) => {
  await page.goto('/write-review');
  const first = page.getByRole('tab', { name: '면접자 A' });
  const second = page.getByRole('tab', { name: '면접자 B' });
  const comment = page.getByRole('textbox');
  await comment.fill('첫 번째 면접자');
  await first.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(comment).toBeEmpty();
  await comment.fill('두 번째 면접자');
  await second.focus();
  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
  await expect(second).toHaveAttribute('tabindex', '-1');
  await expect(comment).toHaveValue('첫 번째 면접자');
  await page.keyboard.press('End');
  await expect(second).toBeFocused();
  await expect(comment).toHaveValue('두 번째 면접자');
});

test('필수 키워드와 한 줄 평을 검사하고 두 면접자의 평가를 각각 제출한다', async ({
  page,
}) => {
  await page.goto('/write-review');
  const submit = page.getByRole('button', { name: '제출하기' });
  const comment = page.getByLabel('한 줄 평 (선택)');
  await submit.click();
  await expect(page.getByText('1개 이상 선택해주세요.')).toHaveCount(2);
  await page.getByText('구체적인 사례', { exact: true }).click();
  await page.getByText('근거가 부족해요', { exact: true }).click();
  await page.getByText('없어요', { exact: true }).click();
  await expect(page.getByLabel('근거가 부족해요')).not.toBeChecked();
  await comment.fill('가'.repeat(101));
  await expect(
    page.getByText('한 줄 평은 100자 이내로 작성해주세요.'),
  ).toBeVisible();
  await expect(submit).toBeDisabled();
  for (const word of ['시발', '바보멍청이똥개']) {
    await comment.fill(word);
    await expect(comment).toHaveAttribute('aria-invalid', 'true');
    await expect(submit).toBeDisabled();
  }
  await comment.fill('구체적으로 설명해 주셔서 좋았어요.');
  await submit.click();
  await expect(page.getByRole('tab', { name: '면접자 B' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(comment).toBeEmpty();
  await expect(
    page.getByText('1 / 2명', { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole('tab', { name: /면접자 A/ }).click();
  await expect(comment).toBeDisabled();
  await expect(comment).toHaveValue('구체적으로 설명해 주셔서 좋았어요.');
  await page.getByRole('tab', { name: '면접자 B' }).click();
  await page.getByText('논리적인 답변', { exact: true }).click();
  await page.getByText('답변이 길어요', { exact: true }).click();
  await submit.click();
  const complete = page.getByText('모든 면접자의 평가를 제출했어요.');
  await expect(complete).toBeVisible();
  await expect(page).toHaveURL('/write-review');
  await page.reload();
  await expect(complete).toBeVisible();
  await expect(page.getByRole('button', { name: '제출 완료' })).toBeDisabled();
  await expect(comment).toHaveValue('구체적으로 설명해 주셔서 좋았어요.');
  await expect(comment).toBeDisabled();
  await expect(page.getByRole('timer')).toHaveCount(0);
});

test('임시 저장과 이탈 확인은 면접자별 입력을 보존한다', async ({ page }) => {
  await page.goto('/write-review');
  const comment = page.getByLabel('한 줄 평 (선택)');
  await comment.fill('첫 번째 면접자의 의견');
  await page.getByRole('button', { name: '임시 저장' }).click();
  await page.reload();
  await expect(comment).toHaveValue('첫 번째 면접자의 의견');
  await page.getByRole('tab', { name: '면접자 B' }).click();
  await comment.fill('두 번째 면접자의 의견');
  await page.getByRole('link', { name: 'MOING 홈' }).click();
  const dialog = page.getByRole('dialog', { name: /피드백은 꼭/ });
  await dialog.getByRole('button', { name: '계속 작성하기' }).click();
  await expect(comment).toHaveValue('두 번째 면접자의 의견');
  await page.getByRole('link', { name: 'MOING 홈' }).click();
  await dialog.getByRole('button', { name: '나가기' }).click();
  await expect(page).toHaveURL('/');
  await page.goBack();
  await expect(page).toHaveURL('/write-review');
  await expect(comment).toHaveValue('첫 번째 면접자의 의견');
  await page.getByRole('tab', { name: '면접자 B' }).click();
  await expect(comment).toHaveValue('두 번째 면접자의 의견');
});

test('새로고침과 이탈 팝업이 마감 시간을 연장하지 않는다', async ({ page }) => {
  await page.clock.install();
  await page.goto('/write-review');
  await expect(page.getByRole('timer')).toBeVisible();
  await page.clock.fastForward(240_000);
  await page.reload();
  await expect(page.getByRole('timer')).toContainText(/0[01]:/);
  await page.getByRole('link', { name: 'MOING 홈' }).click();
  await expect(page.getByRole('dialog', { name: /피드백은 꼭/ })).toBeVisible();
  await page.clock.fastForward(61_000);
  const expired = page.getByRole('dialog', { name: /시간이 종료/ });
  await expect(expired).toBeVisible();
  await expired.getByRole('button', { name: '확인' }).click();
  await expect(expired).not.toBeVisible();
  await expect(page).toHaveURL('/write-review');
  await expect(page.getByRole('button', { name: '제출하기' })).toBeDisabled();
  await expect(page.getByLabel('한 줄 평 (선택)')).toBeDisabled();
  await page.reload();
  await expect(expired).toBeVisible();
});
