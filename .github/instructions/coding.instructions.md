# Estándares Generales del Proyecto

Estas reglas aplican a todos los agentes del proyecto.

---

# Objetivo

Automatizar pruebas End-to-End utilizando GitHub Copilot Agent, Playwright MCP y Jira, manteniendo una arquitectura simple, reutilizable y fácil de mantener.

---

# Principios de desarrollo

Todo el código generado debe seguir:

- SOLID
- DRY
- KISS
- Clean Code
- Separation of Concerns

Prioriza siempre la simplicidad y la legibilidad.

---

# TypeScript

- Utiliza TypeScript.
- Evita `any` cuando exista un tipo conocido.
- Utiliza nombres descriptivos.
- Mantén funciones pequeñas.
- Una función debe tener una única responsabilidad.

---

# Reutilización

Antes de crear código nuevo verifica si ya existen:

- Page Objects
- Fixtures
- Helpers
- Utilidades
- Modelos

Si existen, reutilízalos.

No dupliques código.

---

# Gestión de archivos

Solo está permitido generar archivos en las siguientes ubicaciones:

tests/generated/

tests/evidence/

tests/reports/

No crees archivos temporales.

No generes archivos de depuración.

No escribas archivos fuera de estas carpetas.

---

# Manejo de errores

Los errores deben:

- Explicar claramente el problema.
- Facilitar el diagnóstico.
- Evitar ocultar excepciones.

Nunca ignores errores silenciosamente.

---

# Información faltante

Si la información disponible no es suficiente para completar una automatización, solicita al usuario únicamente los datos necesarios.

Por ejemplo:

- URL
- Usuario
- Contraseña
- Token
- Ambiente
- Datos de prueba

Nunca inventes información.

---

# Seguridad

Nunca:

- Hardcodees credenciales.
- Hardcodees tokens.
- Hardcodees URLs específicas del cliente.

Toda configuración debe obtenerse desde variables de entorno o archivos de configuración.

---

# Jira

Las operaciones sobre Jira deben realizarse exclusivamente mediante el Jira-Agent.

---

# Playwright

La automatización debe realizarse exclusivamente mediante el Playwright-Agent.

La inspección previa utilizando Playwright MCP es obligatoria.

---

# Calidad

Todo el código generado debe ser:

- Legible.
- Reutilizable.
- Fácil de mantener.
- Fácil de extender.

Antes de finalizar una tarea verifica que el resultado compile correctamente y sea consistente con la estructura del proyecto.