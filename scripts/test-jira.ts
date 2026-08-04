import { JiraClient } from '../src/jira/jira.client';

async function main() {

    const jira = new JiraClient();

    const issue = await jira.getIssue("SCRUM-2");

    console.log(issue);

}

main();