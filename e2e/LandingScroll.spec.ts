import { expect, type Locator, test } from '@playwright/test';

function sectionEdge(section: Locator, edge: 'top' | 'bottom') {
  return section.evaluate(
    (element, edge) => element.getBoundingClientRect()[edge],
    edge,
  );
}

test('휠로 위아래로 이동하면 섹션의 시작점에 정렬한다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const hero = page.locator('#top');
  const steps = page.locator('#how-it-works');

  await expect(hero).toBeInViewport();
  await page.mouse.move(640, 400);
  await page.mouse.wheel(0, 550);
  await expect.poll(() => sectionEdge(steps, 'top')).toBe(0);
  await page.mouse.wheel(0, -550);
  await expect.poll(() => sectionEdge(hero, 'top')).toBe(0);

  await page.keyboard.press('PageDown');
  await expect.poll(() => sectionEdge(steps, 'top')).toBe(0);
});

test('작은 화면에서는 긴 섹션의 마지막 카드까지 스크롤할 수 있다', async ({
  page,
}) => {
  const viewport = { width: 320, height: 480 };
  await page.setViewportSize(viewport);
  await page.goto('/');
  const serviceLink = page.locator('header a[href="#service"]');
  await expect(serviceLink).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await serviceLink.click();
  await expect(page).toHaveURL('/#service');
  const service = page.locator('#service');
  await expect.poll(() => sectionEdge(service, 'top')).toBeCloseTo(0, 0);
  const overflow = (await sectionEdge(service, 'bottom')) - viewport.height;
  expect(overflow).toBeGreaterThan(0);
  const lastCard = service.getByRole('listitem').last();
  await expect(lastCard).not.toBeInViewport();
  await page.mouse.move(160, 240);
  await page.mouse.wheel(0, overflow);
  await expect
    .poll(() => sectionEdge(service, 'bottom'))
    .toBeCloseTo(viewport.height, 0);
  await expect(lastCard).toBeInViewport({ ratio: 1 });
});
