import { PlaywrightRunner } from "../src/playwright/playwright.runner";

async function main() {

  const runner = new PlaywrightRunner();

  await runner.run();

}

main();