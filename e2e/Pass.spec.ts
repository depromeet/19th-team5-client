import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/signup/avatar');
  await page.getByRole('textbox', { name: '닉네임' }).fill('검증수달');
  await page.getByRole('radio', { name: '남자 아바타' }).press('Space');
  await page.getByRole('button', { name: '이 모습으로 할게요' }).click();
  await expect(page).toHaveURL(/\/signup\/resume-guide$/);
});

test('3D 텍스처를 기다리는 동안 발급된 방문증을 보여주고 준비되면 전환한다', async ({
  page,
}) => {
  const texture = '**/images/signup/pass-strap.svg';
  const request = page.waitForRequest(texture);
  let resumeTexture: (() => void) | undefined;
  const gate = new Promise<void>((resolve) => {
    resumeTexture = resolve;
  });
  await page.route(texture, async (route) => {
    await gate;
    await route.continue();
  });

  const preview = page.getByRole('img', {
    name: /검증수달님의 MOING 방문 출입증/,
  });
  const card = preview.locator('[data-pass-card="visitor-L"]');
  const scene = preview.locator('canvas[data-pass3d]');
  try {
    await page.getByRole('button', { name: '건너뛰기' }).click();
    await request;
    await expect(card).toBeVisible();
    await expect(card).toHaveJSProperty('naturalWidth', 864);
    await expect(scene).toHaveCount(0);
  } finally {
    resumeTexture?.();
  }
  await expect(scene).toBeVisible();
  await expect(card).toBeHidden();
});

test('3D 모듈을 받지 못해도 가입 화면에 같은 방문증이 표시된다', async ({
  page,
}) => {
  let blocked = false;
  await page.route(/\/lanyard\/Lanyard\.jsx(?:\?.*)?$/, async (route) => {
    blocked = true;
    await route.abort();
  });
  await page.getByRole('button', { name: '건너뛰기' }).click();
  await expect(
    page.getByRole('heading', { name: /출입증 나왔어요/ }),
  ).toBeVisible();
  const card = page.locator(
    '[data-pass-fallback="module"] [data-pass-card="visitor-L"]',
  );
  await expect(card).toBeVisible();
  await expect(card).toHaveJSProperty('complete', true);
  expect(blocked).toBe(true);
  await expect(
    page.getByRole('button', { name: '로비로 입장하기' }),
  ).toBeVisible();
});

test('WebGL을 사용할 수 없으면 정적 방문증의 사진과 비율을 유지한다', async ({
  page,
}) => {
  await page.evaluate(() => {
    const prototype = HTMLCanvasElement.prototype;
    prototype.getContext = new Proxy(prototype.getContext, {
      apply(target, canvas, args) {
        return args[0] === 'webgl2'
          ? null
          : Reflect.apply(target, canvas, args);
      },
    });
  });
  const module = page.waitForResponse(/\/lanyard\/Lanyard\.jsx(?:\?.*)?$/);
  await page.getByRole('button', { name: '건너뛰기' }).click();
  await module;
  const card = page.locator(
    '[data-pass-fallback="webgl"] [data-pass-card="visitor-L"]',
  );
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('width', '288');
  await expect(card).toHaveAttribute('height', '392');
  await expect(card).toHaveJSProperty('naturalWidth', 864);
  await expect(page.locator('[data-pass3d]')).toHaveCount(0);
});
