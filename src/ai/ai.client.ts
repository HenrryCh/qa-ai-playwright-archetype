import { JiraIssue } from "../types/jira.types";

export class AIClient {

  async generateTest(issue: JiraIssue): Promise<string> {

    const prompt = this.buildPrompt(issue);

    // Próximo paso:
    // enviar este prompt a GitHub Models

    console.log("\n========== PROMPT ==========\n");
    console.log(prompt);
    console.log("\n============================\n");

    return `
import { test, expect } from '@playwright/test';

test('${issue.summary}', async ({ page }) => {

  // Historia: ${issue.key}

  // TODO: Código generado por GitHub Models

});
`.trim();

  }

  private buildPrompt(issue: JiraIssue): string {

    return `
Genera una prueba End-to-End utilizando Playwright.

Historia de Usuario:
${issue.summary}

Descripción:
${issue.description}

Estado:
${issue.status}

Genera código TypeScript listo para ejecutar.

No expliques el código.
Devuelve únicamente el archivo .spec.ts
`;

  }

}