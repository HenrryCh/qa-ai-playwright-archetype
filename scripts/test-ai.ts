import { AIClient } from "../src/ai/ai.client";
import { JiraClient } from "../src/jira/jira.client";

async function main() {
  const jira = new JiraClient();
  const ai = new AIClient();

  const issue = await jira.getIssue("SCRUM-2");

  const code = await ai.generateTest(issue);

  console.log(code);
}

main();