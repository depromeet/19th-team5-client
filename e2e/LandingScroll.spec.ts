import { expect, type Locator, test } from '@playwright/test';

function sectionEdge(section: Locator, edge: 'top' | 'bottom') {
  return section.evaluate(
    (element, edge) => Math.round(element.getBoundingClientRect()[edge]),
    edge,
  );
}

test('휠을 크게 굴려도 인접한 섹션의 시작점에 정렬한다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const hero = page.locator('#top');
  const steps = page.locator('#how-it-works');

  await expect(hero).toBeInViewport();
  await page.mouse.move(640, 400);
  await page.mouse.wheel(0, 2400);
  await expect.poll(() => sectionEdge(steps, 'top')).toBe(0);
  await page.mouse.wheel(0, -2400);
  await expect.poll(() => sectionEdge(hero, 'top')).toBe(0);
});

test('작은 화면에서는 긴 섹션의 마지막 카드까지 스크롤할 수 있다', async ({
  page,
}) => {
  const viewport = { width: 320, height: 480 };
  await page.setViewportSize(viewport);
  await page.goto('/');
  await page.locator('header a[href="#service"]').click();
  const service = page.locator('#service');
  await expect.poll(() => sectionEdge(service, 'top')).toBe(0);
  const overflow = (await sectionEdge(service, 'bottom')) - viewport.height;
  expect(overflow).toBeGreaterThan(0);
  const lastCard = service.getByRole('listitem').last();
  await expect(lastCard).not.toBeInViewport();
  await page.mouse.move(160, 240);
  await page.mouse.wheel(0, overflow);
  await expect.poll(() => sectionEdge(service, 'bottom')).toBe(viewport.height);
  await expect(lastCard).toBeInViewport({ ratio: 1 });
});
