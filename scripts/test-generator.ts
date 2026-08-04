import { JiraClient } from "../src/jira/jira.client";
import { PlaywrightGenerator } from "../src/playwright/playwright.generator";
import { FileManager } from "../src/core/file-manager";

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    throw new Error("Debe indicar una Historia de Usuario.");
  }

  console.log(`\nGenerando prueba para ${issueKey}...\n`);

  const jira = new JiraClient();
  const issue = await jira.getIssue(issueKey);

  const generator = new PlaywrightGenerator();
  const contenido = await generator.generate(issue);

  const fileManager = new FileManager();

  const ruta = await fileManager.saveTest(
    `${issue.key}.spec.ts`,
    contenido
  );

  console.log("✅ Test generado correctamente.");
  console.log(ruta);
}

main().catch(console.error);