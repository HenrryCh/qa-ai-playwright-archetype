import { JiraClient } from "../src/jira/jira.client";

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    throw new Error("Debe indicar la clave de la incidencia.");
  }

  const jira = new JiraClient();

  const transitions = await jira.getTransitions(issueKey);

  console.table(
    transitions.map((transition: any) => ({
      id: transition.id,
      nombre: transition.name,
      destino: transition.to?.name,
    }))
  );
}

main();