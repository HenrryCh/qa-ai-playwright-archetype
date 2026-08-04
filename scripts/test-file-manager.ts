import { FileManager } from "../src/core/file-manager";
import { JiraClient } from "../src/jira/jira.client";

async function main() {
  const issueKey = process.argv[2] ?? "SCRUM-2";

  const jira = new JiraClient();
  const issue = await jira.getIssue(issueKey);

  const contenido = `import { test, expect } from '@playwright/test';

test('${issue.summary}', async ({ page }) => {
  // TODO: Agente IA generará este código
});
`;

  const fileManager = new FileManager();

  const ruta = await fileManager.saveTest(
    `${issue.key}.spec.ts`,
    contenido
  );

  console.log("\nArchivo generado:");
  console.log(ruta);
}

main().catch(console.error);