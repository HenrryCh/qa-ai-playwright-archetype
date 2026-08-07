import {
  mkdirSync,
  writeFileSync,
} from "fs";

import { join } from "path";

import { env } from "../../config/env";

export interface AutomationTestResult {
  name: string;
  status: "passed" | "failed";
}

export interface AutomationReportData {
  issueKey: string;
  summary: string;
  evidencePath: string;
  passed: number;
  failed: number;
  tests: AutomationTestResult[];
}

export class ReportService {
  createReport(
    data: AutomationReportData
  ): string {
    const reportsDirectory =
      env.reportsPath;

    const reportPath = join(
      reportsDirectory,
      `${data.issueKey}-ENTREGA.md`
    );

    const generatedAt =
      new Date().toISOString();

    const total =
      data.passed + data.failed;

    const success =
      data.failed === 0 &&
      total > 0;

    mkdirSync(
      reportsDirectory,
      {
        recursive: true,
      }
    );

    const acceptanceCriteria =
      data.tests.length
        ? data.tests.map(
            (test) =>
              `| ${test.name} | ${
                test.status === "passed"
                  ? "🟢 PASS"
                  : "🔴 FAIL"
              } |`
          )
        : [
            "| No se encontraron resultados de pruebas | ⚠️ N/A |",
          ];

    const report = [
      `# 🤖 Reporte de Automatización QA - ${data.issueKey}`,
      "",
      "## 📋 Historia de Usuario",
      "",
      `**${data.issueKey}** - ${data.summary}`,
      "",
      "## 📊 Resultado de Ejecución",
      "",
      "| Métrica | Resultado |",
      "|---|---:|",
      `| Estado | ${
        success
          ? "🟢 EXITOSO"
          : "🔴 FALLIDO"
      } |`,
      `| Pruebas ejecutadas | ${total} |`,
      `| Pruebas aprobadas | ${data.passed} |`,
      `| Pruebas fallidas | ${data.failed} |`,
      `| Navegador | ${env.browser} |`,
      "",
      "## ✅ Criterios de Aceptación",
      "",
      "| Criterio / Prueba | Resultado |",
      "|---|---|",
      ...acceptanceCriteria,
      "",
      "## 📁 Evidencias",
      "",
      `- **Directorio:** \`${data.evidencePath}/\``,
      "",
      "## 📄 Artefactos",
      "",
      `- **Prueba automatizada:** \`tests/generated/${data.issueKey}.spec.ts\``,
      `- **Reporte:** \`${reportPath}\``,
      `- **Evidencias:** \`${data.evidencePath}/\``,
      "",
      "## 🕐 Ejecución",
      "",
      `- **Fecha:** ${generatedAt}`,
      `- **Modo:** ${
        env.headless
          ? "Headless"
          : "Visible"
      }`,
      "",
      "---",
      "",
      success
        ? "✅ La automatización finalizó correctamente."
        : "❌ La automatización finalizó con errores.",
      "",
    ].join("\n");

    writeFileSync(
      reportPath,
      report,
      "utf8"
    );

    return reportPath;
  }
}