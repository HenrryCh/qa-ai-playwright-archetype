# Estándares de Automatización con Playwright

Estas reglas aplican a toda prueba automatizada generada por el proyecto.

---

# Objetivo

Generar pruebas End-to-End confiables utilizando Playwright y Playwright MCP.

Antes de generar cualquier prueba se debe inspeccionar la aplicación mediante Playwright MCP.

---

# Flujo de automatización

Toda automatización debe seguir este orden:

1. Analizar la Historia de Usuario.
2. Verificar la información disponible.
3. Si falta información necesaria, solicitarla al usuario.
4. Inspeccionar la aplicación utilizando Playwright MCP.
5. Identificar los elementos de la interfaz.
6. Verificar componentes reutilizables.
7. Generar o actualizar la prueba.
8. Ejecutar Playwright.
9. Generar evidencias.
10. Generar el informe final.

No alteres este flujo.

---

# Información obligatoria

Antes de comenzar verifica que exista toda la información necesaria.

Por ejemplo:

- URL
- Usuario
- Contraseña
- Token
- Ambiente
- Datos de prueba

Si falta alguno de estos datos:

- No inventes información.
- Solicítala al usuario.
- Detén la automatización hasta recibirla.

---

# Uso de Playwright MCP

La inspección mediante Playwright MCP es obligatoria.

Antes de generar código debes:

- Abrir la aplicación.
- Navegar por el flujo solicitado.
- Confirmar que los elementos existen.
- Identificar los mejores selectores.

Nunca inventes selectores.

Si Playwright MCP no está disponible, informa el problema y detén la automatización.

---

# Organización

Los archivos generados deben almacenarse únicamente en:

tests/generated/

Las evidencias deben almacenarse en:

tests/evidence/<ISSUE>/

El informe debe almacenarse en:

tests/reports/<ISSUE>-ENTREGA.md

No generes archivos fuera de estas carpetas.

---

# Selectores

Prioriza siempre el siguiente orden:

1. getByRole()

2. getByLabel()

3. getByPlaceholder()

4. getByText()

Utiliza locator() únicamente cuando no exista una mejor alternativa.

Nunca utilices XPath.

---

# Reutilización

Antes de crear código nuevo verifica si existen:

- Page Objects
- Fixtures
- Helpers
- Utilidades
- Datos de prueba

Si existen, reutilízalos.

No dupliques código.

---

# Diseño de pruebas

Toda prueba debe:

- Tener una única responsabilidad.
- Ser independiente.
- Ser reutilizable.
- Poder ejecutarse múltiples veces.
- Ser fácil de mantener.

---

# Validaciones

Todos los criterios de aceptación deben verificarse mediante expect().

Cada comportamiento esperado debe tener una validación explícita.

No finalices una prueba sin validar el resultado esperado.

---

# Organización del código

Utiliza test.step() para representar los pasos funcionales importantes.

Los nombres de los pasos deben ser descriptivos.

Mantén el código limpio y fácil de leer.

---

# Esperas

Prioriza las esperas automáticas de Playwright.

Para cambios de navegación utiliza waitForURL().

Evita esperas fijas innecesarias.

---

# Manejo de errores

Si la ejecución falla por un problema sencillo de automatización:

- Analiza la causa.
- Intenta corregirla una única vez.
- Ejecuta nuevamente la prueba.

Si continúa fallando:

- Detén la automatización.
- Informa claramente el motivo.

No realices intentos ilimitados.

---

# Calidad

Antes de finalizar verifica que:

- La prueba compile.
- La ejecución finalice correctamente.
- Se generen las evidencias.
- Se genere el informe.
- El código siga las buenas prácticas oficiales de Playwright.

No generes código innecesario.