import { existsSync } from "fs";
import { join } from "path";

import { JiraClient } from "../src/jira/jira.client";
import { PlaywrightRunner } from "../src/playwright/playwright.runner";
import { ReportService } from "../src/report/report.service";
import { env } from "../config/env";

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    throw new Error(
      "Debe indicar una Historia de Usuario. Ejemplo: SCRUM-11"
    );
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

  /*
   * La generación e inspección mediante Playwright MCP
   * corresponde al Playwright-Agent.
   *
   * Este script solamente continúa cuando el spec
   * ya existe en tests/generated.
   */

  const specFile = join(
    "tests",
    "generated",
    `${issue.key}.spec.ts`
  );

  if (!existsSync(specFile)) {
    throw new Error(
      `El archivo de prueba no existe: ${specFile}\n` +
        "El Playwright-Agent debe inspeccionar la aplicación mediante " +
        "Playwright MCP y generar primero el spec."
    );
  }

  /*
   * La Historia debe estar en Pruebas Doing
   * antes de ejecutar la automatización.
   */
  if (issue.status !== env.jira.statusTestDoing) {
    console.log(
      `\nMoviendo ${issue.key} a ${env.jira.statusTestDoing}...\n`
    );

    await jira.moveIssueToStatus(
      issue.key,
      env.jira.statusTestDoing
    );

    console.log("✅ Historia movida correctamente.");
  } else {
    console.log(
      `\nLa historia ya se encuentra en ${env.jira.statusTestDoing}.`
    );
  }

  const runner = new PlaywrightRunner();

  /*
   * Validación básica del spec antes de ejecutarlo.
   */
  const specValidation = await runner.validateSpec(specFile);

  if (!specValidation.isValid) {
    throw new Error(
      `El spec generado no es válido: ${specValidation.error}`
    );
  }

  console.log("\nEjecutando Playwright...\n");

  /*
   * Ejecutamos solamente el spec correspondiente
   * a la Historia de Usuario actual.
   */
  const testResult = await runner.run(
    `${issue.key}.spec.ts`
  );

  const evidencePath = join(
    env.evidencePath,
    issue.key
  );

  /*
   * Generación del reporte de entrega.
   */
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

  const total =
    testResult.passed + testResult.failed;

  if (total === 0) {
    throw new Error(
      "Playwright no ejecutó ninguna prueba. " +
        "Verifica que el spec contenga tests válidos."
    );
  }

  /*
   * Comentario único de automatización.
   *
   * Si ya existe, se actualiza en lugar de crear otro.
   */
  const jiraComment = [
    `🤖 Automatización QA - ${issue.key}`,
    "",
    `Estado: ${
      testResult.failed === 0
        ? "🟢 EXITOSA"
        : "🔴 FALLIDA"
    }`,
    `Pruebas ejecutadas: ${total}`,
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

  const existingCommentId =
    await jira.findAutomationComment(issue.key);

  if (existingCommentId) {
    await jira.updateComment(
      issue.key,
      existingCommentId,
      jiraComment
    );

    console.log(
      "✅ Comentario de automatización actualizado."
    );
  } else {
    await jira.addComment(
      issue.key,
      jiraComment
    );

    console.log(
      "✅ Comentario de automatización publicado."
    );
  }

  /*
   * Si existe al menos una prueba fallida,
   * la Historia permanece en Pruebas Doing.
   */
  if (testResult.failed > 0) {
    console.log(
      `\n⚠️ La HU permanece en ${env.jira.statusTestDoing} porque existen pruebas fallidas.`
    );

    return;
  }

  /*
   * Solo después de una ejecución completamente exitosa
   * movemos la Historia a Pruebas Done.
   */
  const issueAfterTests =
    await jira.getIssue(issue.key);

  console.log(
    `Estado actual en Jira después de ejecutar pruebas: ${issueAfterTests.status}`
  );

  if (
    issueAfterTests.status !==
    env.jira.statusTestDone
  ) {
    console.log(
      `\nMoviendo ${issue.key} a ${env.jira.statusTestDone}...\n`
    );

    await jira.moveIssueToStatus(
      issue.key,
      env.jira.statusTestDone
    );

    console.log(
      "✅ Automatización finalizada correctamente."
    );
  } else {
    console.log(
      `\nLa historia ya se encuentra en ${env.jira.statusTestDone}.`
    );
  }
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