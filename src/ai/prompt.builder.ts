import { JiraIssue } from "../types/jira.types";

export class PromptBuilder {
  build(issue: JiraIssue): string {
    return `
# QA-Orchestrator

Automatiza la siguiente Historia de Usuario.

## Información

Historia: ${issue.key}

Título:
${issue.summary}

Descripción:
${issue.description}

## Instrucciones

- Utiliza Playwright MCP para inspeccionar la aplicación.
Sigue las reglas definidas en:
- .github/copilot-instructions.md
- .github/instructions/coding.instructions.md
- .github/instructions/playwright.instructions.md
- Reutiliza Page Objects, utilidades y código existente antes de crear nuevos elementos.
- No modifiques la arquitectura del framework.
- Genera únicamente la prueba correspondiente a esta Historia de Usuario.

## Archivo de salida

tests/generated/${issue.key}.spec.ts

## Ejecución

- Ejecuta únicamente la prueba generada.
- Si existe un error sencillo, corrígelo una sola vez.
- Si el problema pertenece a la aplicación, repórtalo sin modificar la lógica del negocio.

## Respuesta

Devuelve únicamente el contenido completo del archivo .spec.ts.
`;
  }
}