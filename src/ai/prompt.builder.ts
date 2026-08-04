import { JiraIssue } from "../types/jira.types";

export class PromptBuilder {
  build(issue: JiraIssue): string {
    return `
Automatiza la siguiente Historia de Usuario utilizando el agente QA-Orchestrator.

Historia: ${issue.key}

Título:
${issue.summary}

Descripción:
${issue.description}

Requisitos:

- Utiliza Playwright MCP para inspeccionar la aplicación.
- Genera una prueba End-to-End en TypeScript.
- Guarda el archivo en:
tests/generated/${issue.key}.spec.ts
- Ejecuta la prueba.
- Si la prueba falla por un problema sencillo, intenta corregirla una sola vez.
- Devuelve únicamente el archivo generado.
`;
  }
}