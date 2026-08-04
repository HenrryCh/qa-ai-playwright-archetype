import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

export interface PlaywrightRunResult {
  passed: number;
  failed: number;
}

export class PlaywrightRunner {

  async run(testFile?: string): Promise<PlaywrightRunResult> {

    const command = testFile
      ? `${npxCommand} playwright test ${testFile}`
      : `${npxCommand} playwright test`;

    console.log(`\nEjecutando: ${command}\n`);

    const { stdout, stderr } = await execAsync(command);

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    const passed = Number(/(\d+)\s+passed/.exec(stdout)?.[1] ?? 0);

    return { passed, failed: 0 };
  }

}