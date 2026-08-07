import { expect, test, type Page } from '@playwright/test';
import { env } from '../../config/env';

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`La variable de entorno ${name} es obligatoria para esta automatización.`);
  }

  return value;
}

function buildAppUrl(path: string): string {
  return new URL(path, env.baseUrl).toString();
}

async function openLoginPage(page: Page) {
  await page.goto(buildAppUrl('login'), { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Iniciar sesión', exact: true })).toBeVisible();
}

test('BOOTCAMP-2: Inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
  await test.step('Abrir la pantalla de inicio de sesión', async () => {
    await openLoginPage(page);
  });

  await test.step('Ingresar credenciales válidas y entrar', async () => {
    await page.getByLabel('Correo', { exact: true }).fill(requireEnvironmentVariable('RESERVALAB_EMAIL'));
    await page.getByLabel('Contraseña', { exact: true }).fill(requireEnvironmentVariable('RESERVALAB_PASSWORD'));
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  });

  await test.step('Validar acceso a la página principal', async () => {
    await expect(page.getByRole('heading', { name: 'Reservar una cita', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión', exact: true })).toBeVisible();
  });
});

test('BOOTCAMP-2: Inicio de sesión con credenciales inválidas muestra error', async ({ page }) => {
  await test.step('Abrir la pantalla de inicio de sesión', async () => {
    await openLoginPage(page);
  });

  await test.step('Ingresar credenciales inválidas y entrar', async () => {
    await page.getByLabel('Correo', { exact: true }).fill('usuario@invalido.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('passwordincorrecto');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  });

  await test.step('Validar bloqueo del acceso y mensaje de error', async () => {
    await expect(page.getByText('Email o contraseña incorrectos', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Iniciar sesión', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
  });
});
