# QA AI Playwright Archetype

Estas instrucciones aplican a todo el repositorio.

## Objetivo

Este proyecto implementa un arquetipo de automatización QA basado en agentes utilizando:

- GitHub Copilot Agent
- Playwright MCP
- Jira Cloud REST API
- TypeScript

El objetivo es reutilizar la arquitectura existente y automatizar Historias de Usuario de Jira.

---

# Arquitectura del proyecto

Antes de realizar cualquier acción inspecciona el proyecto.

Debes reutilizar siempre la implementación existente.

No generes nuevas implementaciones cuando ya exista una equivalente.

---

# Flujo del proyecto

El flujo principal ya existe.

Utiliza como punto de entrada:

scripts/run-automation.ts

No generes otros scripts para ejecutar el flujo.

---

# Jira

Para cualquier operación sobre Jira reutiliza:

- JiraClient
- JiraService

No crees scripts temporales para consultar incidencias.

No implementes clientes alternativos.

No consumas directamente la API REST si el proyecto ya dispone de una clase que lo haga.

---

# Playwright

La automatización debe realizarse utilizando Playwright MCP.

Antes de generar una prueba:

- inspecciona la aplicación mediante Playwright MCP;
- identifica selectores reales;
- valida los criterios de aceptación.

No inventes selectores.

No omitas la inspección cuando Playwright MCP esté disponible.

---

# Generación de pruebas

Las pruebas deben almacenarse únicamente en:

tests/generated/

No generes pruebas en otra carpeta.

---

# Evidencias

Las evidencias deben almacenarse únicamente en:

evidence/

Cada ejecución debe generar una carpeta con el identificador de la Historia de Usuario.

Ejemplo:

evidence/SCRUM-2/

---

# Reporte

Al finalizar la ejecución genera un único archivo de resumen dentro de:

reports/

Ejemplo:

reports/SCRUM-2-ENTREGA.md

No generes reportes en la raíz del proyecto.

---

# Reutilización

Antes de crear cualquier archivo verifica si ya existe una implementación equivalente.

Reutiliza siempre:

- servicios
- utilidades
- modelos
- scripts
- Page Objects

No dupliques código.

---

# Archivos temporales

Está prohibido crear archivos temporales para ejecutar tareas.

No generes archivos como:

- get-issue.ts
- get-issue-details.ts
- query.ts
- temp.ts
- debug.ts

Si existe una funcionalidad equivalente en el proyecto debes reutilizarla.

---

# Información faltante

Si la Historia de Usuario no contiene la información necesaria para automatizar:

- URL
- usuario
- contraseña
- ambiente
- datos de prueba

solicita únicamente esa información al usuario.

Nunca inventes datos.

---

# Estado en Jira

Una automatización exitosa debe:

1. Obtener la Historia de Usuario.
2. Mover la incidencia a "Pruebas Doing".
3. Ejecutar la automatización.
4. Generar evidencias.
5. Generar el reporte.
6. Agregar un comentario en Jira con el resumen.
7. Mover la Historia de Usuario a "Pruebas Done".

---

# Restricciones

Nunca:

- crees nuevos scripts para tareas existentes;
- modifiques archivos fuera del alcance solicitado;
- dupliques funcionalidades;
- hardcodees credenciales;
- inventes información;
- omitas Playwright MCP cuando esté disponible.

Siempre reutiliza la arquitectura existente.

No utilices archivos de ejemplo, demostración o pruebas temporales como referencia para generar nuevas automatizaciones.

Genera las pruebas únicamente a partir de la Historia de Usuario, los componentes reutilizables y la inspección realizada mediante Playwright MCP.
Si el proyecto dispone de un generador de pruebas automatizadas, reutilízalo antes de generar una nueva implementación.
Si la prueba correspondiente no existe, créala en tests/generated/.

No busques archivos inexistentes para decidir la estrategia de automatización.