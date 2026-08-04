import { env } from '../config/env';

console.log('=== Configuración del entorno ===');

console.log('BASE_URL      :', env.baseUrl);
console.log('BROWSER       :', env.browser);
console.log('HEADLESS      :', env.headless);
console.log('REPORTS_PATH  :', env.reportsPath);
console.log('EVIDENCE_PATH :', env.evidencePath);

console.log('');

console.log('=== Configuración Jira ===');

console.log('JIRA_BASE_URL          :', env.jira.baseUrl);
console.log('JIRA_PROJECT_KEY       :', env.jira.projectKey);
console.log('JIRA_STATUS_TEST_DOING :', env.jira.statusTestDoing);
console.log('JIRA_STATUS_TEST_DONE  :', env.jira.statusTestDone);