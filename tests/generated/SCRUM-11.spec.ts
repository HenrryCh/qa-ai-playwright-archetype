import { expect, test } from '@playwright/test';

const baseUrl = process.env.BASE_URL;
const email = process.env.RESERVALAB_EMAIL;
const password = process.env.RESERVALAB_PASSWORD;
const evidenceDirectory = 'evidence/SCRUM-11';

function requireEnvironmentVariable(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`La variable de entorno ${name} es obligatoria para SCRUM-11.`);
  }

  return value;
}

test.beforeEach(async ({ page }) => {
  await page.goto(requireEnvironmentVariable('BASE_URL', baseUrl), {
    waitUntil: 'domcontentloaded',
  });
});

test('SCRUM-11 CA1: inicia sesión y redirige a la página principal', async ({ page }) => {
  await test.step('Completar el formulario con credenciales válidas', async () => {
    await page.getByLabel('Correo', { exact: true }).fill(
      requireEnvironmentVariable('RESERVALAB_EMAIL', email),
    );
    await page.getByLabel('Contraseña', { exact: true }).fill(
      requireEnvironmentVariable('RESERVALAB_PASSWORD', password),
    );
  });

  await test.step('Entrar y validar el acceso a la página principal', async () => {
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(
      page.getByRole('heading', { name: 'Reservar una cita', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Iniciar sesión', exact: true })).toBeHidden();
    await page.screenshot({
      path: `${evidenceDirectory}/CA1-login-exitoso.png`,
      fullPage: true,
    });
  });
});

test('SCRUM-11 CA2: muestra error y permanece en login con credenciales incorrectas', async ({ page }) => {
  await test.step('Completar el formulario con credenciales inválidas', async () => {
    await page.getByLabel('Correo', { exact: true }).fill('invalid.user@theproject.ec');
    await page.getByLabel('Contraseña', { exact: true }).fill('invalid-password');
  });

  await test.step('Entrar y validar el mensaje de error', async () => {
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();

    await expect(page.getByRole('alert')).toHaveText('Email o contraseña incorrectos');
    await expect(page).toHaveURL(requireEnvironmentVariable('BASE_URL', baseUrl));
    await expect(page.getByRole('heading', { name: 'Iniciar sesión', exact: true })).toBeVisible();
    await page.screenshot({
      path: `${evidenceDirectory}/CA2-credenciales-incorrectas.png`,
      fullPage: true,
    });
  });
});