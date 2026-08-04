# QA AI Playwright Archetype

Arquetipo de automatización QA basado en **GitHub Copilot Agent**, **Playwright MCP** y **Jira Cloud**, capaz de generar y ejecutar pruebas End-to-End automáticamente a partir de una Historia de Usuario.

---

# Características

- Automatización End-to-End con Playwright.
- Inspección automática mediante Playwright MCP.
- Integración con Jira Cloud.
- Generación automática de pruebas.
- Ejecución automática.
- Generación de evidencias y reportes.
- Actualización automática del flujo de trabajo en Jira.

---

# Tecnologías

- TypeScript
- Node.js
- Playwright
- Playwright MCP
- Jira Cloud REST API
- GitHub Copilot Agent

---

# Requisitos

Instalar previamente:

- Node.js 22+
- Git
- Visual Studio Code
- GitHub Copilot
- Playwright
- Playwright MCP
- Cuenta de Jira Cloud

---

# Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>

cd qa-ai-playwright-archetype
```

Instalar dependencias:

```bash
npm install
```

Instalar Playwright:

```bash
npx playwright install
```

Crear el archivo `.env` utilizando el archivo `.env.example`.

---

# Configuración

Completar las variables de entorno:

```text
JIRA_BASE_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=

STATUS_TEST_DOING=
STATUS_TEST_DONE=
```

---

# Arquitectura

```
Usuario
    │
    ▼
GitHub Copilot Agent
    │
    ▼
QA-Orchestrator
    │
 ┌──┴──────────┐
 ▼             ▼
Jira-Agent   Playwright-Agent
                  │
                  ▼
           Playwright MCP
                  │
                  ▼
         tests/generated
                  │
                  ▼
       evidence / reports
                  │
                  ▼
          Actualización Jira
```

---

# Estructura del proyecto

```
.github/
    agents/
    instructions/
    copilot-instructions.md

scripts/

src/
    ai/
    config/
    core/
    jira/
    playwright/
    types/

tests/
    generated/

evidence/

reports/
```

---

# Archivos principales

| Archivo | Responsabilidad |
|----------|-----------------|
| run-automation.ts | Flujo principal de automatización |
| jira.client.ts | Comunicación con Jira |
| prompt.builder.ts | Construcción del prompt enviado al agente |
| playwright.generator.ts | Generación de pruebas |
| playwright.runner.ts | Ejecución de Playwright |
| file-manager.ts | Escritura de archivos |

---

# Flujo de automatización

1. Obtener la Historia de Usuario.
2. Validar la información disponible.
3. Si falta información (URL, usuario, contraseña o datos de prueba), solicitarla al usuario.
4. Inspeccionar la aplicación utilizando Playwright MCP.
5. Generar la prueba.
6. Ejecutar Playwright.
7. Generar evidencias.
8. Generar el reporte.
9. Agregar un comentario en Jira.
10. Mover la Historia de Usuario a **Pruebas Done**.

---

# Uso

Abrir GitHub Copilot en **modo Agent**.

Escribir:

```
Automatiza la HU SCRUM-15
```

El agente ejecutará automáticamente el flujo completo.

---

# Comandos útiles

Ejecutar una automatización:

```bash
npx ts-node scripts/run-automation.ts SCRUM-15
```

Ejecutar una prueba específica:

```bash
npx playwright test tests/generated/SCRUM-15.spec.ts
```

Ejecutar todas las pruebas:

```bash
npx playwright test
```

Abrir el reporte de Playwright:

```bash
npx playwright show-report
```

---

# Archivos generados

Las pruebas se almacenan en:

```
tests/generated/
```

Las evidencias se almacenan en:

```
evidence/<ISSUE>/
```

Los reportes se almacenan en:

```
reports/<ISSUE>-ENTREGA.md
```

---

# Agentes

El proyecto utiliza tres agentes:

- **QA-Orchestrator:** Coordina el flujo completo.
- **Jira-Agent:** Gestiona la interacción con Jira.
- **Playwright-Agent:** Inspecciona la aplicación, genera y ejecuta las pruebas.

Las reglas comunes se encuentran en:

```
.github/instructions/
```

Las reglas específicas para GitHub Copilot se encuentran en:

```
.github/copilot-instructions.md
```

---

# Buenas prácticas

- Reutilizar siempre el código existente.
- No crear scripts temporales.
- No duplicar funcionalidad.
- No inventar datos faltantes.
- Utilizar Playwright MCP antes de generar cualquier prueba.
- Mantener las pruebas simples y reutilizables.

---

# Autor

Henrry Chariguaman