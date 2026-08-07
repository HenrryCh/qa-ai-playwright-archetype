# QA AI Playwright Archetype

Arquetipo de automatización QA impulsado por **GitHub Copilot Agent**, **Playwright MCP** y **Jira Cloud**. Permite automatizar de forma autónoma Historias de Usuario mediante inspección visual de la aplicación, generación de pruebas E2E en TypeScript, ejecución, captura de evidencias, reportes y actualización del flujo de trabajo en Jira.

---

## 🚀 Características Principales

- 🤖 **Orquestación basada en Agentes**: Coordinación entre agentes especializados (`QA-Orchestrator`, `Jira-Agent`, `Playwright-Agent`).
- 🔍 **Inspección Real con Playwright MCP**: Captura selectores y valida la interfaz antes de escribir cualquier código de prueba.
- 🔄 **Integración Bidireccional con Jira Cloud**: Transiciona automáticamente estados (*Desarrollo Done* → *Pruebas Doing* → *Pruebas Done*) y registra comentarios formateados con métricas.
- 📊 **Generación Autónoma de Artefactos**: Produce specs independientes en TypeScript (`tests/generated/`), capturas de evidencia (`evidence/`) y reportes consolidados en Markdown (`reports/`).
- 🛠️ **Ejecución Flexible**: Soporta ejecución guiada desde Copilot Chat (Agent Mode) o técnica mediante CLI.

---

## 🛠️ Tecnologías y Requisitos

- **Node.js**: `>=22.0.0`
- **Lenguaje**: TypeScript (`^5.x`)
- **Testing**: Playwright (`^1.x`)
- **Protocolo AI**: Playwright MCP
- **Integración**: Jira Cloud REST API (v3)

---

## 🏗️ Arquitectura y Agentes

```text
               ┌──────────────────────────────┐
               │    GitHub Copilot Agent      │
               └──────────────┬───────────────┘
                              │ "Automatiza la HU SCRUM-11"
                              ▼
                   ┌─────────────────────┐
                   │   QA-Orchestrator   │
                   └──────────┬──────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
  ┌───────────────┐                       ┌───────────────┐
  │  Jira-Agent   │                       │Playwright-Ag. │
  └───────┬───────┘                       └───────┬───────┘
          │ (Obtener HU / Mover Doing)            │ (Inspección MCP)
          ▼                                       ▼
  Jira Cloud REST                         web.theproject.ec
          │                                       │
          │                                       ▼
          │                            tests/generated/*.spec.ts
          │                                       │
          └───────────────────┬───────────────────┘
                              ▼
                  npx ts-node run-automation.ts
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
       evidence/           reports/          Jira Comment
    (Screenshots)        (*-ENTREGA.md)    & Status Transition
                                         (Done / Doing if fail)
```

### Roles de los Agentes

| Agente | Responsabilidad |
|---|---|
| **`QA-Orchestrator`** | Coordina el flujo completo, evalúa la disponibilidad de MCP y asegura el cumplimiento del proceso. |
| **`Jira-Agent`** | Consulta información de la HU, realiza las transiciones de estado (*Doing* / *Done*) y publica comentarios. |
| **`Playwright-Agent`** | Inspecciona la app mediante Playwright MCP, genera la prueba TypeScript y ejecuta validaciones locales. |

---

## 📁 Estructura del Proyecto

```text
qa-ai-playwright-archetype/
├── .github/
│   ├── agents/            # Prompts/Definiciones de Agentes (orchestrator, jira, playwright)
│   ├── instructions/      # Instrucciones de codificación y Playwright para la IA
│   └── copilot-instructions.md
├── config/                # Carga y validación de variables de entorno (env.ts)
├── src/
│   ├── ai/                # PromptBuilder para generar las instrucciones de prueba
│   ├── jira/              # JiraClient (REST API v3 para transiciones y comentarios)
│   ├── playwright/        # PlaywrightRunner (ejecución y parsing de resultados JSON)
│   ├── report/            # ReportService (generación de informes en Markdown)
│   └── types/             # Definiciones TypeScript (JiraIssue, etc.)
├── scripts/
│   ├── check-env.ts       # Validador de variables de entorno
│   └── run-automation.ts  # Orquestador técnico principal de la ejecución
├── tests/
│   └── generated/         # Especificaciones de prueba generadas (.spec.ts)
├── evidence/              # Evidencias fotográficas por HU (evidence/<ISSUE>/)
├── reports/               # Reportes de entrega en Markdown (reports/<ISSUE>-ENTREGA.md)
├── playwright.config.ts   # Configuración de Playwright (reporters, baseURL, etc.)
└── .env.example           # Plantilla de configuración de entorno
```

---

## ⚙️ Instalación y Configuración

1. **Clonar e instalar dependencias:**
   ```bash
   git clone <URL_REPOSITORIO>
   cd qa-ai-playwright-archetype
   npm install
   npx playwright install
   ```

2. **Configurar el entorno:**
   Copia `.env.example` a `.env` y completa las credenciales:
   ```env
   BASE_URL=https://web.theproject.ec/
   RESERVALAB_EMAIL=student01@theproject.ec
   RESERVALAB_PASSWORD=QaVR68_C51vp

   JIRA_BASE_URL=https://tu-dominio.atlassian.net
   JIRA_EMAIL=tu-email@dominio.com
   JIRA_API_TOKEN=tu-api-token
   JIRA_PROJECT_KEY=SCRUM
   JIRA_STATUS_TEST_DOING=Pruebas Doing
   JIRA_STATUS_TEST_DONE=Pruebas Done
   ```

3. **Validar configuración:**
   ```bash
   npx ts-node scripts/check-env.ts
   ```

---

## 💻 Modo de Uso

### Opción 1: Desde GitHub Copilot (Recomendado)
Abre GitHub Copilot Chat en **Agent Mode** e invoca la automatización:

```text
Automatiza la HU SCRUM-11
```

El flujo ejecutará automáticamente:
1. Transición de la HU en Jira a `Pruebas Doing` (Jira-Agent).
2. Inspección de la aplicación mediante Playwright MCP (Playwright-Agent).
3. Generación del archivo `.spec.ts` en `tests/generated/`.
4. Ejecución del flujo técnico con `scripts/run-automation.ts <ISSUE>`.
5. Publicación del reporte, capturas de evidencia y transición a `Pruebas Done` o retención en `Pruebas Doing` según el resultado.

### Opción 2: Ejecución Manual vía CLI
Para re-ejecutar el flujo técnico sobre una prueba previamente generada:

```bash
# Ejecutar el flujo de automatización completo y actualizar Jira:
npx ts-node scripts/run-automation.ts SCRUM-11

# O ejecutar únicamente el test con Playwright:
npx playwright test tests/generated/SCRUM-11.spec.ts
```

---

## 📋 Reglas y Buenas Prácticas

- **Playwright MCP Obligatorio**: NUNCA se deben inventar selectores o escribir pruebas a ciegas sin haber inspeccionado la app en vivo con el MCP.
- **Seguridad**: No incluir credenciales ni tokens en el código ni subirlos al repositorio. Utilizar siempre el archivo `.env`.
- **Integridad de Jira**: El estado solo transiciona a `Pruebas Done` si **el 100% de las pruebas aprueban**. En caso de fallo, la HU permanece en `Pruebas Doing` y se reportan los errores.
- **Mantenibilidad**: Las pruebas generadas son atómicas, independientes y escritas en TypeScript siguiendo las mejores prácticas de ISTQB y Playwright.

---

## 👤 Autor

Henrry Chariguaman