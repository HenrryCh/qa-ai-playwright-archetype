import { JiraClient } from "../src/jira/jira.client";
import { env } from "../config/env";

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    console.error("Uso:");
    console.error("npx ts-node scripts/test-move.ts <ISSUE_KEY>");
    process.exit(1);
  }

  const jira = new JiraClient();

  console.log(`Moviendo ${issueKey} a "${env.jira.statusTestDoing}"...\n`);

  await jira.moveIssueToStatus(
    issueKey,
    env.jira.statusTestDoing
  );

  console.log("\nProceso finalizado correctamente.");
}

main().catch(console.error);