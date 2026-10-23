# AGENTS.md

## Proyecto

- Web estática de tres archivos: `index.html`, `styles.css` y `app.js`. Sin frameworks, librerías, build, lint ni tests.
- La estética base es un cuaderno nocturno: fondo casi negro con una grilla oliva muy sutil, paneles oscuros, tipografía editorial y acentos de fruta.
- Hay tres variantes visuales de fruta: lima `#B8E63C` (predeterminada), manzana `#E14B42` y uva `#B18CF5`.
- La fruta cambia únicamente el acento de la interfaz y el icono SVG de la racha. No cambiar estructura, layout, tipografía, espaciado, formulario ni historial al agregar variantes.
- El control de fruta y el selector de idioma viven juntos en la parte superior derecha del masthead. No moverlos a otra zona sin pedido explícito.
- La fruta activa se expresa con `data-fruit` en `<html>`: `lima`, `manzana` o `uva`. Los tokens de acento son `--accent`, `--accent-pale`, `--accent-deep`, `--accent-shade`, `--accent-ink`, `--accent-glow-soft` y `--accent-wash`.
- Los colores fijos de los swatches del selector son `--fruit-lima`, `--fruit-manzana` y `--fruit-uva`; las hojas y tallos conservan verdes naturales con `--leaf`, `--leaf-light` y `--stem`. No usar el acento de la fruta para las hojas.

## Idiomas

- La interfaz está disponible en español (predeterminado) e inglés. El idioma activo se expresa con `lang` en `<html>`.
- Los textos visibles se traducen con el diccionario `TRANSLATIONS` de `app.js` y los atributos `data-i18n`, `data-i18n-placeholder`, `data-i18n-aria-label` y `data-i18n-title`.
- Al cambiar idioma se vuelven a renderizar las fechas, las unidades de racha, el estado vacío y los `aria-label`; no dejar textos dinámicos en español.
- El título del documento, el título del masthead, los formularios, el historial y los controles deben quedar traducidos en ambos idiomas.
- Las etiquetas `ES` y `EN` del selector pueden quedar como abreviaturas, pero sus nombres accesibles deben ser completos en el idioma activo.

## Comandos

- Ver la app: `start index.html` desde esta carpeta en PowerShell, o abrir el archivo con doble clic.
- La verificación es manual: abrir la página y probar las tres frutas, ambos idiomas, el formulario, la racha y la persistencia.

## Datos y lógica

- Persistencia de sesiones en `localStorage` con la clave `diario-de-estudio:sesiones`. No cambiarla sin migrar los datos existentes.
- Persistencia de la fruta en `diario-de-estudio:fruta` y del idioma en `diario-de-estudio:idioma`.
- Las claves antiguas `diario-de-estudio:tema` y `diario-de-estudio:icono` quedaron sin uso; no leerlas ni escribir en ellas.
- Un script temprano en `<head>` aplica la fruta y el idioma guardados antes de pintar para reducir parpadeos.
- Racha: días consecutivos con al menos una sesión; si hoy no hay sesión, arranca desde ayer; se corta en el primer día sin sesión. La lógica está en `calculateStreak()`.
- Mejor racha: máximo histórico de días consecutivos con al menos una sesión. Se calcula sobre fechas únicas y ordenadas, ignorando fechas futuras o inválidas. La regla de "racha viva" solo aplica a la racha actual. La lógica está en `calculateBestStreak()`.
- La mejor racha se deriva de `sessions` en cada render; no se guarda aparte.
- Fechas: siempre locales, con `toISODate()` y `addDays()`. No usar `toISOString()` ni `new Date('YYYY-MM-DD')`: pueden cambiar el día por la zona UTC.
- No probar con Live Server si ya hay datos guardados: `file://` y `http://localhost` son orígenes distintos y no comparten `localStorage`.
