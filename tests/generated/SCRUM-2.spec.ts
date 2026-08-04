import { expect, test } from '@playwright/test';

const baseUrl = 'https://codemify.com/';
const evidencePath = 'evidence/SCRUM-2/menu-qa-courses.png';

test('SCRUM-2: QA Courses muestra las opciones definidas', async ({ page }) => {
  await test.step('Abrir la pagina de Codemify', async () => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  });

  await test.step('Abrir el menu QA Courses y validar sus opciones', async () => {
    const qaCoursesMenu = page.getByRole('link', {
      name: 'QA Courses',
      exact: true,
    });

    await expect(qaCoursesMenu).toBeVisible();

    try {
      await qaCoursesMenu.hover();
      await expect(page.getByRole('menuitem', { name: 'Schedule', exact: true })).toBeVisible();
      await expect(
        page.getByRole('menuitem', { name: 'Manual QA Course', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('menuitem', { name: 'QA AI Automation Course', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('menuitem', { name: 'Master QA (Both)', exact: true }),
      ).toBeVisible();
    } catch (error) {
      await page.screenshot({ path: evidencePath, fullPage: true });
      throw error;
    }
  });

});

test('SCRUM-2: Master QA (Both) abre Complete QA Course', async ({ page }) => {
  await test.step('Abrir la pagina de Codemify', async () => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  });

  await test.step('Abrir Master QA (Both) y validar la pagina de destino', async () => {
    await page.getByRole('link', { name: 'QA Courses', exact: true }).hover();
    await page.getByRole('menuitem', { name: 'Master QA (Both)', exact: true }).click();
    await expect(page).toHaveURL(/\/complete-qa-course\/?$/);
    await expect(page).toHaveTitle('Complete QA Course');
    await expect(
      page.getByRole('heading', { name: 'Our courses', exact: true }),
    ).toBeVisible();
  });
});