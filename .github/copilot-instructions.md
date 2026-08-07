# QA AI Playwright Archetype

Estas instrucciones aplican a todo el repositorio.

## Objetivo

Este proyecto implementa un framework de automatización QA basado en agentes utilizando:

- GitHub Copilot Agent
- QA-Orchestrator
- Jira-Agent
- Playwright-Agent
- Playwright MCP
- Jira Cloud REST API
- Playwright
- TypeScript

El objetivo es automatizar Historias de Usuario de Jira mediante un flujo controlado, reutilizable y trazable.

---

# Arquitectura

El flujo principal del proyecto es:

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
│             │
│             ▼
│       Playwright MCP
│             │
└──────┬──────┘
       ▼
tests/generated/
       │
       ▼
evidence / reports
       │
       ▼
Actualización Jira

---

# Inicio del flujo

La automatización debe iniciarse desde GitHub Copilot Chat.

Ejemplo:

Automatiza la HU SCRUM-11

El usuario no debe ejecutar manualmente scripts internos para completar el flujo principal.

El QA-Orchestrator debe coordinar la ejecución utilizando los agentes especializados y la funcionalidad existente del proyecto.

---

# Responsabilidades de los agentes

## QA-Orchestrator

Es responsable de coordinar el flujo completo.

Debe:

- interpretar la solicitud;
- validar la información mínima necesaria;
- inspeccionar la estructura existente del proyecto;
- reutilizar la funcionalidad existente;
- delegar las operaciones de Jira al Jira-Agent;
- delegar la inspección y automatización al Playwright-Agent;
- consolidar los resultados;
- informar el resultado final.

No debe:

- generar directamente pruebas Playwright;
- inspeccionar directamente la aplicación;
- consumir directamente la API de Jira;
- crear scripts temporales;
- duplicar funcionalidades existentes.

---

## Jira-Agent

Es responsable de las operaciones relacionadas con Jira.

Debe encargarse de:

- consultar la Historia de Usuario;
- obtener la información necesaria para la automatización;
- mover la incidencia entre estados;
- agregar comentarios;
- actualizar el flujo de trabajo de Jira.

Debe reutilizar las clases y servicios existentes del proyecto.

---

## Playwright-Agent

Es responsable de la automatización funcional.

Debe encargarse de:

- analizar la Historia de Usuario;
- inspeccionar la aplicación mediante Playwright MCP;
- identificar selectores reales;
- validar los criterios de aceptación;
- generar la prueba Playwright;
- ejecutar la prueba;
- generar evidencias;
- generar el reporte;
- informar el resultado al QA-Orchestrator.

La inspección mediante Playwright MCP es obligatoria antes de generar una nueva prueba.

El servidor MCP que debe utilizarse es:

playwright

Las herramientas de inspección deben utilizar las herramientas disponibles bajo:

playwright/browser_*

Si Playwright MCP no está disponible, no responde correctamente o no puede utilizarse, el Playwright-Agent debe detener la automatización e informar claramente el problema.

La ejecución de Playwright mediante `npx playwright test` no sustituye la inspección mediante Playwright MCP.

Antes de generar el `.spec.ts`, el Playwright-Agent debe haber realizado y poder informar la inspección MCP realizada sobre la aplicación.

---

# Playwright MCP

Playwright MCP es obligatorio para la inspección de la aplicación.

Antes de generar una prueba:

1. Navegar a la URL de la aplicación utilizando Playwright MCP.
2. Obtener un snapshot inicial de la interfaz.
3. Identificar los elementos necesarios para el flujo.
4. Interactuar con la aplicación mediante las herramientas MCP necesarias.
5. Obtener snapshots posteriores después de las interacciones relevantes.
6. Validar los estados necesarios para los criterios de aceptación.
7. Confirmar los selectores reales.
8. Informar al QA-Orchestrator qué elementos fueron encontrados y qué selectores fueron validados.
9. Solo después de completar la inspección, generar la prueba.

La inspección debe realizarse desde cero para la Historia de Usuario solicitada.

No se debe considerar una inspección anterior como sustituto de la inspección requerida para la ejecución actual.

No se deben inventar selectores basándose únicamente en la Historia de Usuario, código existente o ejecuciones anteriores.

La prueba debe generarse a partir de:

- Historia de Usuario;
- criterios de aceptación;
- datos de prueba disponibles;
- componentes existentes;
- inspección realizada mediante Playwright MCP.

La evidencia de inspección debe corresponder a la ejecución actual.

La ejecución de una prueba Playwright existente no demuestra que se haya utilizado Playwright MCP.

La generación de un `.spec.ts` tampoco demuestra que se haya utilizado Playwright MCP.

---

# Generación de pruebas

Las pruebas automatizadas deben escribirse en TypeScript utilizando Playwright.

Las pruebas generadas deben almacenarse únicamente en:

tests/generated/

El nombre esperado es:

tests/generated/<ISSUE>.spec.ts

Ejemplo:

tests/generated/SCRUM-11.spec.ts

Antes de generar código nuevo se debe verificar si existen:

- Page Objects;
- fixtures;
- helpers;
- utilidades;
- componentes reutilizables;
- pruebas relacionadas.

Debe priorizarse siempre la reutilización.

No se deben modificar archivos compartidos del arquetipo para adaptar una única Historia de Usuario o una única aplicación, salvo que el cambio haya sido solicitado explícitamente como una corrección del propio arquetipo.

---

# Ejecución

Después de generar la prueba:

1. Ejecutar la prueba generada mediante el flujo existente del proyecto.
2. Analizar el resultado.
3. Generar el resultado estructurado.
4. Generar evidencias.
5. Generar el reporte.
6. Informar el resultado al QA-Orchestrator.

Si existe un error sencillo de automatización, puede realizarse un único intento de corrección.

No deben realizarse intentos ilimitados.

El resultado estructurado de Playwright debe almacenarse en:

reports/playwright-results.json

Este archivo debe ser generado mediante el reporter JSON configurado en:

playwright.config.ts

No se deben crear archivos alternativos para representar el resultado de Playwright.

---

# Evidencias

Las evidencias deben almacenarse únicamente en:

evidence/

Cada Historia de Usuario debe tener su propia carpeta.

Ejemplo:

evidence/SCRUM-11/

Las evidencias pueden incluir:

- capturas de pantalla;
- información relevante de ejecución;
- artefactos generados por Playwright.

Las evidencias deben corresponder a la ejecución actual.

---

# Reportes

El reporte de entrega debe almacenarse únicamente en:

reports/

Formato:

reports/<ISSUE>-ENTREGA.md

Ejemplo:

reports/SCRUM-11-ENTREGA.md

El reporte debe contener como mínimo:

- Historia de Usuario;
- resultado de ejecución;
- cantidad de pruebas aprobadas;
- cantidad de pruebas fallidas;
- criterios o pruebas validadas;
- evidencias;
- artefactos generados;
- fecha de ejecución;
- modo de ejecución;
- observaciones relevantes.

No se deben generar reportes duplicados.

---

# Jira

El flujo debe utilizar las clases existentes del proyecto para interactuar con Jira.

No se deben crear clientes alternativos ni scripts temporales para realizar operaciones que ya estén implementadas.

El flujo esperado es:

1. Obtener la Historia de Usuario.
2. Moverla a "Pruebas Doing".
3. Realizar la inspección de la aplicación mediante Playwright MCP.
4. Generar la prueba.
5. Ejecutar la automatización.
6. Generar evidencias.
7. Generar el reporte.
8. Agregar o actualizar el comentario de automatización en Jira.
9. Si todas las pruebas son exitosas, mover a "Pruebas Done".
10. Si existen pruebas fallidas, mantener la Historia en "Pruebas Doing".

Los nombres de los estados deben obtenerse de la configuración del proyecto.

El comentario de automatización no debe duplicarse si ya existe un comentario correspondiente a la ejecución de automatización. Cuando corresponda, debe actualizarse el comentario existente utilizando la funcionalidad disponible en `JiraClient`.

---

# Configuración

Las variables de entorno deben gestionarse mediante:

config/env.ts

La configuración utilizada por Playwright debe mantenerse alineada con `config/env.ts` y `playwright.config.ts`.

No se deben crear configuraciones paralelas o contradictorias para:

- URL base;
- navegador;
- modo headless;
- rutas de evidencias;
- rutas de reportes.

No se deben hardcodear:

- credenciales;
- tokens;
- URLs de ambientes;
- configuraciones sensibles.

Los secretos deben permanecer fuera del código fuente.

---

# Reutilización

Antes de crear cualquier archivo o implementación:

1. Inspeccionar la estructura existente.
2. Identificar funcionalidades reutilizables.
3. Reutilizar clases, servicios, modelos y utilidades existentes.
4. Evitar duplicar funcionalidad.

No crear una nueva implementación cuando ya exista una equivalente.

---

# Archivos temporales

Está prohibido crear archivos temporales o scripts auxiliares para resolver una tarea que ya puede realizarse mediante la arquitectura existente.

No crear archivos como:

- get-issue.ts
- query.ts
- debug.ts
- temp.ts
- test-*.ts

cuando su funcionalidad ya exista en el proyecto.

---

# Datos faltantes

Si la Historia de Usuario no contiene información necesaria para ejecutar la automatización, el agente debe solicitar únicamente los datos faltantes.

Por ejemplo:

- URL;
- usuario;
- contraseña;
- ambiente;
- datos de prueba.

Nunca inventar información.

Las credenciales nunca deben escribirse directamente en el código fuente ni en los archivos `.spec.ts`.

Cuando el proyecto utilice variables de entorno para datos sensibles, se deben utilizar mediante la configuración existente del arquetipo.

---

# Archivos generados

El flujo principal puede generar únicamente los siguientes artefactos:

tests/generated/<ISSUE>.spec.ts

evidence/<ISSUE>/

reports/<ISSUE>-ENTREGA.md

reports/playwright-results.json

No generar archivos adicionales fuera del alcance de la automatización.

---

# Criterios de éxito

Una automatización se considera exitosa cuando:

- la Historia de Usuario fue obtenida correctamente;
- la aplicación fue inspeccionada mediante Playwright MCP;
- la inspección corresponde a la ejecución actual;
- los elementos y selectores fueron validados mediante la inspección;
- la prueba fue generada correctamente;
- la prueba fue ejecutada;
- se generaron las evidencias;
- se generó el reporte;
- se agregó o actualizó el resultado en Jira;
- el estado de Jira fue actualizado correctamente.

La ejecución de Playwright por sí sola no demuestra que Playwright MCP haya sido utilizado.

La existencia de un `.spec.ts` funcional tampoco demuestra que la inspección MCP se haya realizado.

---

# Restricciones

Nunca:

- inventar selectores;
- inventar datos;
- hardcodear credenciales;
- omitir Playwright MCP;
- generar una prueba sin inspeccionar primero la aplicación;
- considerar una inspección de una ejecución anterior como sustituto de la inspección actual;
- crear scripts temporales;
- duplicar funcionalidades;
- crear clientes alternativos de Jira;
- modificar archivos fuera del alcance solicitado;
- generar artefactos innecesarios;
- modificar la configuración compartida del arquetipo únicamente para adaptar una aplicación concreta.

Siempre reutilizar la arquitectura existente.

---

# Resultado final

Al finalizar la automatización, el QA-Orchestrator debe informar:

- Historia procesada;
- agentes utilizados;
- confirmación de que Playwright MCP fue utilizado;
- resumen de la inspección realizada;
- elementos/selectores relevantes encontrados;
- resultado de las pruebas;
- pruebas aprobadas;
- pruebas fallidas;
- evidencias generadas;
- reporte generado;
- archivos generados;
- estado final de Jira;
- cualquier problema o recomendación relevante.