export interface JiraIssue {
  key: string;
  summary: string;
  description: string;
  status: string;
  labels: string[];
  url?: string;
}