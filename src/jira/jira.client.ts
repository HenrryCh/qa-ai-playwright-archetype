import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env";
import { JiraIssue } from "../types/jira.types";

export class JiraClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${env.jira.baseUrl}/rest/api/3`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${env.jira.email}:${env.jira.apiToken}`
          ).toString("base64"),
      },
    });
  }

  /**
   * Verifica la conexión con Jira.
   */
  async testConnection() {
    const response = await this.client.get("/myself");

    return {
      displayName: response.data.displayName,
      email: response.data.emailAddress,
      accountId: response.data.accountId,
    };
  }

  /**
   * Obtiene una Historia de Usuario por su clave.
   */
  async getIssue(issueKey: string): Promise<JiraIssue> {
    try {
      const response = await this.client.get(`/issue/${issueKey}`);

      return this.mapIssue(response.data);
    } catch (error: any) {
      console.error("Error Jira:");
      console.error(error.response?.status);
      console.error(error.response?.data || error.message);

      throw new Error(
        `No fue posible obtener la incidencia ${issueKey}.`
      );
    }
  }

  /**
   * Busca incidencias mediante JQL.
   */
  async searchIssues(jql: string): Promise<JiraIssue[]> {
    try {
      const response = await this.client.post("/search/jql", {
        jql,
        maxResults: 50,
        fields: [
          "summary",
          "description",
          "status",
          "labels",
        ],
      });

      return response.data.issues.map((issue: any) =>
        this.mapIssue(issue)
      );
    } catch (error: any) {
      console.error("Error Jira:");
      console.error(error.response?.data || error.message);

      throw new Error(
        "No fue posible ejecutar la consulta JQL."
      );
    }
  }

  /**
   * Obtiene todas las transiciones disponibles
   * para una incidencia.
   */
  async getTransitions(issueKey: string) {
    const response = await this.client.get(
      `/issue/${issueKey}/transitions`
    );

    return response.data.transitions;
  }

  /**
   * Mueve una incidencia al estado indicado.
   */
  async moveIssueToStatus(
    issueKey: string,
    targetStatus: string
  ): Promise<void> {
    const transitions = await this.getTransitions(issueKey);

    const transition = transitions.find(
      (t: any) =>
        t.name.toLowerCase() ===
        targetStatus.toLowerCase()
    );

    if (!transition) {
      throw new Error(
        `No existe una transición llamada "${targetStatus}" para ${issueKey}.`
      );
    }

    await this.client.post(
      `/issue/${issueKey}/transitions`,
      {
        transition: {
          id: transition.id,
        },
      }
    );

    console.log(
      `✓ ${issueKey} movida a "${targetStatus}".`
    );
  }

  /**
   * Agrega el resumen de la automatización a la incidencia.
   */
  async addComment(issueKey: string, comment: string): Promise<void> {
    await this.client.post(`/issue/${issueKey}/comment`, {
      body: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: comment }],
          },
        ],
      },
    });
  }

  /**
   * Convierte la respuesta de Jira
   * al modelo interno del framework.
   */
  private mapIssue(issue: any): JiraIssue {
    const description = this.extractPlainText(
      issue.fields.description?.content
    ).trim();

    return {
      key: issue.key,
      summary: issue.fields.summary,
      description,
      status: issue.fields.status.name,
      labels: issue.fields.labels ?? [],
      url: `${env.jira.baseUrl}/browse/${issue.key}`,
    };
  }

  /**
   * Convierte Atlassian Document Format (ADF)
   * a texto plano.
   */
  private extractPlainText(node: any): string {
    if (!node) {
      return "";
    }

    if (Array.isArray(node)) {
      return node
        .map((item) => this.extractPlainText(item))
        .filter(Boolean)
        .join("\n");
    }

    if (node.type === "text") {
      return node.text ?? "";
    }

    if (node.content) {
      return this.extractPlainText(node.content);
    }

    return "";
  }
}