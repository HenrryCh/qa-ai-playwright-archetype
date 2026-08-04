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

  await jira.moveIssueToStatus(
    issue.key,
    env.jira.statusTestDoing
  );

  console.log("✅ Historia movida correctamente.");

  const prompt = new PromptBuilder().build(issue);

  console.log("\n==========================================");
  console.log("PROMPT PARA GITHUB COPILOT");
  console.log("==========================================\n");
  console.log(prompt);

  const runner = new PlaywrightRunner();

  console.log("\nEjecutando Playwright...\n");

  const testResult = await runner.run(
    `${issue.key}.spec.ts`
  );

  const evidencePath = `${env.evidencePath}/${issue.key}`;

  const reportPath = new ReportService().createReport({
    issueKey: issue.key,
    summary: issue.summary,
    evidencePath,
    passed: testResult.passed,
    failed: testResult.failed,
    tests: testResult.tests,
  });

  console.log("\n==========================================");
  console.log("RESULTADO DE AUTOMATIZACIÓN");
  console.log("==========================================");

  console.log(
    `Estado: ${
      testResult.failed === 0
        ? "EXITOSA"
        : "FALLIDA"
    }`
  );

  console.log(`Pruebas aprobadas: ${testResult.passed}`);
  console.log(`Pruebas fallidas: ${testResult.failed}`);

  console.log(`Reporte: ${reportPath}`);
  console.log(`Evidencias: ${evidencePath}/`);

  const jiraComment = [
    `🤖 Automatización QA - ${issue.key}`,
    "",
    `Estado: ${
      testResult.failed === 0
        ? "🟢 EXITOSA"
        : "🔴 FALLIDA"
    }`,
    `Pruebas ejecutadas: ${
      testResult.passed + testResult.failed
    }`,
    `Pruebas aprobadas: ${testResult.passed}`,
    `Pruebas fallidas: ${testResult.failed}`,
    "",
    "Criterios / pruebas:",
    ...testResult.tests.map(
      (test) =>
        `- ${
          test.status === "passed"
            ? "🟢"
            : "🔴"
        } ${test.name}`
    ),
    "",
    `Reporte: ${reportPath}`,
    `Evidencias: ${evidencePath}/`,
  ].join("\n");

  await jira.addComment(
    issue.key,
    jiraComment
  );

  if (testResult.failed > 0) {
    console.log(
      `\n⚠️ La HU permanece en ${env.jira.statusTestDoing} porque existen pruebas fallidas.`
    );

    return;
  }

  console.log(
    `\nMoviendo a ${env.jira.statusTestDone}...\n`
  );

  await jira.moveIssueToStatus(
    issue.key,
    env.jira.statusTestDone
  );

  console.log("✅ Automatización finalizada.");
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.error(
    `La automatización no pudo completarse: ${message}`
  );

  process.exitCode = 1;
});