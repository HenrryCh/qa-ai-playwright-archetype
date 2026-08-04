import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export class ReportService {
	createSuccessReport(
		issueKey: string,
		summary: string,
		evidencePath: string,
		passed: number,
	): string {
		const reportsDirectory = 'reports';
		const reportPath = join(reportsDirectory, `${issueKey}-ENTREGA.md`);
		const generatedAt = new Date().toISOString();

		mkdirSync(reportsDirectory, { recursive: true });
		writeFileSync(
			reportPath,
			[
				`# Entrega de Automatización ${issueKey}`,
				'',
				`- Historia: ${summary}`,
				'- Estado: Pruebas ejecutadas correctamente.',
				`- Resultado: ${passed} pruebas aprobadas, 0 fallidas.`,
				'- Criterios validados: consulte los resultados de la ejecución de Playwright.',
				`- Evidencias: ${evidencePath}/`,
				`- Generado: ${generatedAt}`,
				'',
			].join('\n'),
			'utf8',
		);

		return reportPath;
	}
}
