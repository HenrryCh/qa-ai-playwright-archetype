import { JiraClient } from "../src/jira/jira.client";
import { PromptBuilder } from "../src/ai/prompt.builder";
import { PlaywrightRunner } from "../src/playwright/playwright.runner";
import { ReportService } from "../src/report/report.service";
import { env } from "../config/env";

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    throw new Error("Debe indicar una Historia de Usuario.");
  }

  const jira = new JiraClient();

  console.log(`\nObteniendo información de ${issueKey}...\n`);

  const issue = await jira.getIssue(issueKey);

  console.log("Historia de Usuario cargada correctamente.\n");

  console.log({
    key: issue.key,
    summary: issue.summary,
    status: issue.status,
    url: issue.url,
  });

  console.log(`\nMoviendo a ${env.jira.statusTestDoing}...\n`);

  await jira.moveIssueToStatus(issue.key, env.jira.statusTestDoing);

  console.log("✅ Historia movida correctamente.");

  const prompt = new PromptBuilder().build(issue);

  console.log("\n==========================================");
  console.log("PROMPT PARA GITHUB COPILOT");
  console.log("==========================================\n");
  console.log(prompt);

  const runner = new PlaywrightRunner();

  console.log("\nEjecutando Playwright...\n");

  const testResult = await runner.run(`${issue.key}.spec.ts`);

  const evidencePath = `${env.evidencePath}/${issue.key}`;
  const reportPath = new ReportService().createSuccessReport(
    issue.key,
    issue.summary,
    evidencePath,
    testResult.passed,
  );

  await jira.addComment(
    issue.key,
    `Automatización completada: ${testResult.passed} pruebas aprobadas y ${testResult.failed} fallidas. Reporte: ${reportPath}. Evidencias: ${evidencePath}/.`,
  );

  console.log(`\nMoviendo a ${env.jira.statusTestDone}...\n`);

  await jira.moveIssueToStatus(issue.key, env.jira.statusTestDone);

  console.log("✅ Automatización finalizada.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`La automatización no pudo completarse: ${message}`);
  process.exitCode = 1;
});