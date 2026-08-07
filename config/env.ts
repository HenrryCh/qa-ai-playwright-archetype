import dotenv from 'dotenv';

dotenv.config();

function getEnv(name: string, required = false): string {
  const value = process.env[name];

  if (required && (!value || value.trim() === '')) {
    throw new Error(`La variable de entorno "${name}" es obligatoria.`);
  }

  return value ?? '';
}

export const env = {
  // Playwright
  baseUrl: getEnv('BASE_URL'),
  browser: getEnv('BROWSER') || 'chromium',

  // Por defecto Playwright se ejecuta en headless.
  // Para ejecución visible: HEADLESS=false
  headless: getEnv('HEADLESS') !== 'false',

  reportsPath: getEnv('REPORTS_PATH') || 'reports',
  evidencePath: getEnv('EVIDENCE_PATH') || 'evidence',

  // Jira
  jira: {
    baseUrl: getEnv('JIRA_BASE_URL', true),
    email: getEnv('JIRA_EMAIL', true),
    apiToken: getEnv('JIRA_API_TOKEN', true),

    // Opcional
    projectKey: getEnv('JIRA_PROJECT_KEY'),

    // Estados configurables
    statusTestDoing:
      getEnv('JIRA_STATUS_TEST_DOING') || 'Pruebas Doing',

    statusTestDone:
      getEnv('JIRA_STATUS_TEST_DONE') || 'Pruebas Done',
  },
};