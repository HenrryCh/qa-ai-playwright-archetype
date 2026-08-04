import { AIClient } from "../ai/ai.client";
import { JiraIssue } from "../types/jira.types";

export class PlaywrightGenerator {
  private readonly ai = new AIClient();

  async generate(issue: JiraIssue): Promise<string> {
    return await this.ai.generateTest(issue);
  }
}