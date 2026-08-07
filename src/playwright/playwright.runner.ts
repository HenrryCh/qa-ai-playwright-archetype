import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

export interface SpecValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PlaywrightTestResult {
  name: string;
  status: "passed" | "failed";
}

export interface PlaywrightRunResult {
  passed: number;
  failed: number;
  tests: PlaywrightTestResult[];
}

interface PlaywrightJsonResult {
  suites?: PlaywrightSuite[];
}

interface PlaywrightSuite {
  specs?: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
}

interface PlaywrightSpec {
  title: string;
  tests?: PlaywrightTest[];
}

interface PlaywrightTest {
  status?: string;
  results?: PlaywrightTestExecution[];
}

interface PlaywrightTestExecution {
  status?: string;
}

export class PlaywrightRunner {
  private readonly resultsPath = "reports/playwright-results.json";

  async validateSpec(specFile: string): Promise<SpecValidationResult> {
    if (!existsSync(specFile)) {
      return { isValid: false, error: `No existe el archivo ${specFile}` };
    }

    const content = readFileSync(specFile, "utf8");

    if (!content.includes("test(")) {
      return { isValid: false, error: "El spec no contiene tests Playwright válidos." };
    }

    if (!content.includes("@playwright/test")) {
      return { isValid: false, error: "El spec no importa '@playwright/test'." };
    }

    if (content.includes("process.env") && !content.includes("requireEnvironmentVariable")) {
      return {
        isValid: false,
        error: "El spec usa variables de entorno de forma no compatible con el arquetipo. Usa el patrón de configuración existente y evita depender de una app específica.",
      };
    }

    if (content.includes("env.reservalab") || content.includes("env.jira") || content.includes("env.baseUrl") && !content.includes("from '../../config/env'")) {
      return {
        isValid: false,
        error: "El spec intenta usar una configuración de entorno no compatible con el arquetipo. Mantén el contrato genérico del proyecto.",
      };
    }

    return { isValid: true };
  }

  async run(testFile?: string): Promise<PlaywrightRunResult> {
    const args = testFile
      ? ["playwright", "test", testFile]
      : ["playwright", "test"];

    const command = testFile
      ? `${npxCommand} playwright test ${testFile}`
      : `${npxCommand} playwright test`;

    console.log(`\nEjecutando: ${command}\n`);

    try {
      const { stdout, stderr, code } = await this.runCommand(args);

      this.printOutput(stdout, stderr);

      if (code !== 0) {
        console.warn(`Playwright finalizó con código ${code}.`);
      }

      return this.readResults();
    } catch (error: unknown) {
      const executionError = error as {
        stdout?: string;
        stderr?: string;
      };

      this.printOutput(
        executionError.stdout ?? "",
        executionError.stderr ?? ""
      );

      return this.readResults();
    }
  }

  private runCommand(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
    return new Promise((resolve, reject) => {
      const child = spawn(npxCommand, args, {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr?.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("error", reject);

      child.on("close", (code) => {
        resolve({ stdout, stderr, code: code ?? 1 });
      });
    });
  }

  private printOutput(stdout: string, stderr: string): void {
    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }
  }

  private readResults(): PlaywrightRunResult {
    if (!existsSync(this.resultsPath)) {
      throw new Error(
        `No se encontró el reporte JSON de Playwright: ${this.resultsPath}`
      );
    }

    const content = readFileSync(this.resultsPath, "utf8");
    const report = JSON.parse(content) as PlaywrightJsonResult;

    const tests = this.extractTests(report.suites ?? []);

    const passed = tests.filter(
      (test) => test.status === "passed"
    ).length;

    const failed = tests.filter(
      (test) => test.status === "failed"
    ).length;

    return {
      passed,
      failed,
      tests,
    };
  }

  private extractTests(
    suites: PlaywrightSuite[]
  ): PlaywrightTestResult[] {
    const results: PlaywrightTestResult[] = [];

    for (const suite of suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          const test = spec.tests?.[0];

          if (!test) {
            continue;
          }

          const execution = test.results?.[test.results.length - 1];

          const status =
            execution?.status === "passed"
              ? "passed"
              : "failed";

          results.push({
            name: spec.title,
            status,
          });
        }
      }

      if (suite.suites) {
        results.push(...this.extractTests(suite.suites));
      }
    }

    return results;
  }
}