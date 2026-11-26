import { expect, type Page, test } from '@playwright/test';
import { installFakeMicrophone } from './support/fakeMicrophone.ts';
import { finishMicTest } from './support/waitingRoom.ts';

async function selectOpenRoom(page: Page, index = 0) {
  await page.getByRole('button', { name: '면접방 예약', exact: true }).click();
  await page.getByRole('button', { name: '방 살펴보기' }).nth(index).click();
}

async function bookCandidate(page: Page, remaining: number) {
  await page.getByRole('button', { name: '면접권 1장으로 예약하기' }).click();
  const confirm = page.getByRole('dialog', {
    name: '면접권 1장을 사용할까요?',
  });
  await confirm.getByRole('button', { name: '면접자로 예약하기' }).click();
  const receipt = page.getByRole('dialog', { name: '면접 예약이 완료됐어요' });
  await expect(receipt).toContainText(`남은 면접권 ${remaining}장`);
  await receipt.getByRole('button', { name: '내 예약 보기' }).click();
  await expect(page).toHaveURL('/reservations/mine');
}

test('로비 키오스크에서 예약한 일정과 역할이 출입증에 그대로 남는다', async ({
  page,
}) => {
  await page.goto('/lobby');
  await expect(
    page.getByRole('button', { name: 'Space 예약 키오스크 사용하기' }),
  ).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page).toHaveURL('/reservations');
  await page.getByText('오전', { exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '이 조건에 맞는 면접방이 없어요' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '전체 면접방 보기' }).click();
  await page.getByRole('button', { name: '방 살펴보기' }).first().click();
  const selectedUrl = page.url();
  await bookCandidate(page, 1);
  await expect(page.getByRole('article')).toContainText('인성면접 A룸');
  await expect(page.getByRole('article')).toContainText('18:00');
  await expect(page.getByRole('article')).toContainText('면접자');
  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.goto(selectedUrl);
  await expect(page.getByRole('heading', { name: '내 예약' })).toBeVisible();
  await expect(page.getByRole('banner')).toContainText('1장');
});

test('잔액 0장에서도 빈 면접관 자리를 예약하고 예약 시점에는 보상을 지급하지 않는다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/reservations');
  await selectOpenRoom(page);
  await bookCandidate(page, 1);
  await selectOpenRoom(page);
  await bookCandidate(page, 0);
  await selectOpenRoom(page, 1);
  await page.getByRole('button', { name: '면접권 1장으로 예약하기' }).click();
  const shortage = page.getByRole('dialog', { name: '면접권이 부족해요' });
  await expect(shortage).toContainText('면접관 자리가 1개 남았어요');
  await shortage.getByRole('button', { name: '다른 방 보기' }).click();
  await expect(page).toHaveURL('/reservations');
  await expect(page.getByRole('banner')).toContainText('0장');
  await selectOpenRoom(page, 1);
  await page.getByRole('button', { name: '면접권 1장으로 예약하기' }).click();
  await page
    .getByRole('dialog', { name: '면접권이 부족해요' })
    .getByRole('button', { name: '면접관 자리 선택' })
    .click();
  await page
    .getByRole('dialog', { name: '이번엔 내가 면접관이에요' })
    .getByRole('button', { name: '면접관으로 예약하기' })
    .click();
  const receipt = page.getByRole('dialog', { name: '면접 예약이 완료됐어요' });
  await expect(receipt).toContainText('면접관');
  await expect(receipt).toContainText('남은 면접권 0장');
  await receipt.getByRole('button', { name: '로비로 가기' }).click();
  await selectOpenRoom(page);
  await expect(
    page.getByRole('button', { name: '면접관', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: '면접권 1장으로 예약하기' }).click();
  await expect(
    shortage.getByRole('button', { name: '면접관 자리 선택' }),
  ).toHaveCount(0);
  await shortage.getByRole('button', { name: '다른 방 보기' }).click();
  await expect(page).toHaveURL('/reservations');
});

test('다음 예약 카드를 펼치고 면접관 질문을 1시간 전부터 같은 대기실에 이어 쓴다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.clock.install({ time: new Date('2026-11-26T12:00:00+09:00') });
  await page.goto('/reservations');
  // 늦은 방을 먼저 예약해도 로비에는 가장 가까운 예약이 표시된다.
  await selectOpenRoom(page, 1);
  const candidateRoomId = new URL(page.url()).pathname.split('/').pop();
  await bookCandidate(page, 1);
  await selectOpenRoom(page);
  const roomPath = new URL(page.url()).pathname;
  const roomId = roomPath.split('/').pop();
  await page.getByRole('button', { name: '면접관', exact: true }).click();
  await page.getByRole('button', { name: '면접관 자리 예약하기' }).click();
  await page.getByRole('button', { name: '면접관으로 예약하기' }).click();
  await page
    .getByRole('dialog', { name: '면접 예약이 완료됐어요' })
    .getByRole('button', { name: '로비로 가기' })
    .click();
  const card = page.getByRole('complementary', {
    name: /18:00 · 인성면접 A룸/,
  });
  await expect(card).toContainText('면접관으로 참여 · 면접자 1 · 면접관 2');
  await expect(card.locator('time')).toHaveText(/^29:\d{2}:\d{2}$/);
  await expect(card.getByRole('button', { name: '질문지 작성' })).toHaveCount(
    0,
  );
  await card.getByRole('button', { name: '예약된 면접 카드 닫기' }).click();
  await expect(card).toBeHidden();
  await page.getByRole('button', { name: '예약된 면접 펼치기' }).click();
  await card.getByRole('button', { name: '예약 보기' }).click();
  await expect(page).toHaveURL(roomPath);
  await expect(page.getByRole('button', { name: '질문지 작성' })).toHaveCount(
    0,
  );
  await page.clock.fastForward(29 * 60 * 60_000);
  await expect(page.getByRole('button', { name: '질문지 작성' })).toBeVisible();
  await page.goto('/notifications');
  await page.getByRole('button', { name: '질문지 작성' }).click();
  const sheet = page.getByRole('dialog', { name: '면접 준비해볼까요?' });
  await sheet.getByRole('button', { name: '질문 만들기', exact: true }).click();
  await sheet
    .getByRole('textbox', { name: '질문', exact: true })
    .fill('지원한 직무를 선택한 이유는 무엇인가요?');
  await page.clock.fastForward(45 * 60_000);
  await expect(sheet).toBeVisible();
  await sheet.getByRole('button', { name: '저장하고 로비로' }).click();
  await page.reload();
  await expect(card).toContainText('면접 시작까지');
  await card.getByRole('button', { name: '질문지 작성' }).click();
  const saved = sheet.getByRole('button', {
    name: '지원한 직무를 선택한 이유는 무엇인가요?',
  });
  await expect(saved).toBeVisible();
  await sheet.getByRole('button', { name: '저장하고 로비로' }).click();
  await card.getByRole('button', { name: '대기실 입장' }).click();
  await expect(page).toHaveURL(
    `/interviews/${roomId}/waiting-room?role=interviewer`,
  );
  await finishMicTest(page);
  await page.keyboard.press('q');
  await expect(saved).toBeVisible();
  await page.goto('/lobby');
  await page.clock.fastForward(15 * 60_000);
  const laterCard = page.getByRole('complementary', {
    name: /20:00 · 인성면접 B룸/,
  });
  await expect(laterCard).toContainText('면접자로 참여');
  await page.clock.fastForward(60 * 60_000);
  await expect(
    laterCard.getByRole('button', { name: '질문지 작성' }),
  ).toHaveCount(0);
  await page.goto(`/lobby?questionSheet=${candidateRoomId}`);
  await expect(laterCard).toBeVisible();
  await expect(sheet).toHaveCount(0);
  await page.goto(`/lobby?questionSheet=${roomId}`);
  await expect(laterCard).toBeVisible();
  await expect(sheet).toHaveCount(0);
});

test('개설 요청은 입력값을 반영하고 100자, 월요일 0시, 주 2회 경계를 지킨다', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-11-29T23:58:00+09:00') });
  await page.goto('/reservations/request');
  await expect(
    page.getByRole('complementary').getByText('미선택', { exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByRole('button', { name: '방 요청하기' }),
  ).toBeDisabled();
  for (const title of ['디자인 면접 연습', '디자인 포트폴리오']) {
    await page.getByRole('textbox', { name: '방제' }).fill(title);
    await page.getByText('오후 8시', { exact: true }).click();
    await page.getByText('디자인', { exact: true }).click();
    const reason = page.getByRole('textbox', { name: '개설 요청 이유' });
    const submit = page.getByRole('button', {
      name: '오후 8시 · 디자인 방 요청하기',
    });
    await reason.fill('가'.repeat(101));
    await expect(submit).toBeDisabled();
    await expect(reason).toHaveAttribute('aria-invalid', 'true');
    await reason.fill('가'.repeat(100));
    await submit.click();
    const receipt = page.getByRole('dialog', {
      name: '개설 요청을 접수했어요',
    });
    await expect(receipt).toContainText(title);
    await receipt.getByRole('button', { name: '닫기' }).click();
  }
  await page.reload();
  await page.getByRole('button', { name: '요청 한도 확인' }).click();
  const limit = page.getByRole('dialog', { name: '이번 주 요청권은 여기까지' });
  await expect(limit).toContainText('11월 30일');
  await limit.getByRole('button', { name: '닫기' }).click();
  await expect(page.getByRole('banner')).toContainText('2장');
  await page.clock.fastForward(2 * 60_000);
  await expect(page.getByText('이번 주 2회 남음')).toBeVisible();
});

test('개설 알림에서 예약한 면접은 시작 15분 전에 같은 방의 대기실로 연결된다', async ({
  page,
}) => {
  await installFakeMicrophone(page);
  await page.clock.install({ time: new Date('2026-11-26T12:00:00+09:00') });
  await page.goto('/notifications');
  await page.getByRole('button', { name: '면접방 보기' }).click();
  const roomId = new URL(page.url()).pathname.split('/').pop();
  await bookCandidate(page, 1);
  await page.goto(`/interviews/${roomId}/waiting-room?role=interviewee`);
  await expect(page).toHaveURL(`/reservations/rooms/${roomId}`);
  await page.getByRole('link', { name: /알림/ }).click();
  await expect(page.getByRole('button', { name: '대기실 입장' })).toHaveCount(
    0,
  );
  await page.clock.fastForward(29 * 60 * 60_000);
  await expect(page.getByText('예약 잠금')).toBeVisible();
  await page.clock.fastForward(45 * 60_000);
  await page.getByRole('button', { name: '대기실 입장' }).click();
  await expect(page).toHaveURL(
    `/interviews/${roomId}/waiting-room?role=interviewee`,
  );
  await expect(
    page.getByRole('dialog', { name: '아-아, 마이크 테스트' }),
  ).toBeVisible();
  await expect(
    page.getByText('18:00 인성면접 A룸', { exact: true }),
  ).toBeAttached();
});
