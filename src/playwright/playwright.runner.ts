import { exec } from "child_process";
import { promisify } from "util";
import { existsSync, readFileSync } from "fs";

const execAsync = promisify(exec);
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

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

  async run(testFile?: string): Promise<PlaywrightRunResult> {
    const command = testFile
      ? `${npxCommand} playwright test ${testFile}`
      : `${npxCommand} playwright test`;

    console.log(`\nEjecutando: ${command}\n`);

    try {
      const { stdout, stderr } = await execAsync(command);

      this.printOutput(stdout, stderr);

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