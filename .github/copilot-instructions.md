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
                  │
                  ▼
           Playwright MCP
                  │
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
- delegar la automatización al Playwright-Agent;
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

Si Playwright MCP no está disponible, el agente debe detener la automatización e informar claramente el problema.

---

# Playwright MCP

Playwright MCP es obligatorio para la inspección de la aplicación.

Antes de generar una prueba:

1. Abrir la aplicación.
2. Inspeccionar la interfaz.
3. Identificar los elementos necesarios.
4. Verificar los selectores reales.
5. Validar el flujo funcional.
6. Confirmar los criterios de aceptación.
7. Generar la prueba.

No se deben inventar selectores basándose únicamente en la Historia de Usuario.

La prueba debe generarse a partir de:

- Historia de Usuario;
- criterios de aceptación;
- datos de prueba disponibles;
- componentes existentes;
- inspección realizada mediante Playwright MCP.

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

---

# Ejecución

Después de generar la prueba:

1. Ejecutar Playwright.
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
3. Ejecutar la automatización.
4. Generar evidencias.
5. Generar el reporte.
6. Agregar un comentario con el resultado.
7. Si todas las pruebas son exitosas, mover a "Pruebas Done".
8. Si existen pruebas fallidas, mantener la Historia en "Pruebas Doing".

Los nombres de los estados deben obtenerse de la configuración del proyecto.

---

# Configuración

Las variables de entorno deben gestionarse mediante:

config/env.ts

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
- los selectores fueron validados mediante la inspección;
- la prueba fue generada correctamente;
- la prueba fue ejecutada;
- se generaron las evidencias;
- se generó el reporte;
- se agregó el resultado a Jira;
- el estado de Jira fue actualizado correctamente.

La ejecución de Playwright por sí sola no demuestra que Playwright MCP haya sido utilizado.

---

# Restricciones

Nunca:

- inventar selectores;
- inventar datos;
- hardcodear credenciales;
- omitir Playwright MCP cuando esté disponible;
- generar una prueba sin inspeccionar primero la aplicación;
- crear scripts temporales;
- duplicar funcionalidades;
- crear clientes alternativos de Jira;
- modificar archivos fuera del alcance solicitado;
- generar artefactos innecesarios.

Siempre reutilizar la arquitectura existente.

---

# Resultado final

Al finalizar la automatización, el QA-Orchestrator debe informar:

- Historia procesada;
- agentes utilizados;
- resultado de las pruebas;
- pruebas aprobadas;
- pruebas fallidas;
- evidencias generadas;
- reporte generado;
- archivos generados;
- estado final de Jira;
- cualquier problema o recomendación relevante.