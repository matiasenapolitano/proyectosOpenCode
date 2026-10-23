# AGENTS.md

## Proyecto

- Web estática de tres archivos: `index.html`, `styles.css` y `app.js`. Sin frameworks, librerías, build, lint ni tests.
- La app registra tres categorías independientes: estudio, ejercicio y agua. Cada una tiene su propio formulario, historial y racha.
- La estética base es un cuaderno nocturno: fondo casi negro, grilla tenue teñida por el acento, paneles oscuros, tipografía editorial y acentos de fruta.
- Hay tres variantes visuales de fruta: lima `#B8E63C` (predeterminada), manzana `#E14B42` y uva `#B18CF5`.
- La fruta cambia únicamente el acento de la interfaz y el icono SVG decorativo. No cambiar estructura, layout, tipografía, espaciado, formularios, historial ni lógica al agregar variantes.
- Los neutros de la interfaz (`--paper`, `--panel`, `--ink`, `--ink-soft`, `--muted`, `--line`, `--line-strong`, `--field-border`, `--field`, `--field-focus`) deben ser grises cálidos neutros, nunca oliva ni verdes. Al cambiar a manzana o uva no deben quedar bordes, líneas, textos, iconos, botones ni campos verdes.
- El verde solo puede aparecer en el acento lima (incluida la grilla teñida por ese acento) y en el swatch de lima cuando está activo o en hover. Con manzana o uva activos no debe quedar verde visible: los swatches inactivos se muestran en escala de grises.
- Los iconos de los tres accesos usan `currentColor` y toman el acento activo. El icono de fruta completo (cuerpo, hoja, tallo, venas y detalles) también se colorea con `--accent`, `--accent-deep` y `--accent-pale`; no hay tokens verdes para hojas o tallos.
- El control de fruta y el selector de idioma viven juntos en la parte superior derecha del masthead. No moverlos a otra zona sin pedido explícito.
- La fruta activa se expresa con `data-fruit` en `<html>`: `lima`, `manzana` o `uva`. Los tokens de acento son `--accent`, `--accent-pale`, `--accent-deep`, `--accent-shade`, `--accent-ink`, `--accent-glow-soft` y `--accent-wash`.
- Los colores fijos de los swatches del selector son `--fruit-lima`, `--fruit-manzana` y `--fruit-uva`; los inactivos usan `filter: grayscale(1)` y opacidad reducida. El activo, el hover y el foco visible recuperan su color.

## Interfaz principal

- La tarjeta izquierda se llama `Rachas` y contiene tres paneles de acceso apilados, en este orden: `Estudio`, `Ejercicio`, `Agua`.
- Cada panel es un botón con icono, nombre, racha actual (número grande + unidad) y mejor racha. El panel activo se marca con `aria-pressed="true"` y acento; los demás quedan neutros.
- Al hacer clic en un panel se muestra su formulario a la derecha y se ocultan los otros dos. El formulario, la nota inferior y el título del historial cambian según la categoría.
- La categoría activa vive solo en memoria (`activeCategory`); al recargar vuelve a `Estudio`. Los datos de las tres categorías sí persisten.
- El historial también se filtra por la categoría activa: muestra sesiones de estudio, ejercicios o días de agua.
- La ilustración de fruta se conserva a la derecha de los paneles en escritorio. Se oculta con `max-width: 1050px` para dejar lugar a los accesos en pantallas angostas.
- Los formularios son tres bloques estáticos dentro de la misma tarjeta y se alternan con el atributo `hidden`. La regla global `[hidden] { display: none !important; }` evita que los `display: grid` de los formularios los vuelvan a mostrar.

## Formularios

- Estudio: fecha, tema, notas y minutos. El tema y los minutos son obligatorios; las notas son opcionales.
- Ejercicio: fecha, descripción, tipo, tiempo en minutos y lugar (`home` o `gym`). Todos los campos son obligatorios.
- Tipos de ejercicio estables en `value`: `aerobic`, `walking`, `running`, `swimming`, `contact`, `football`, `basketball`, `gym`, `yoga`, `cycling`, `functional`, `climbing`, `racket`, `dance`, `other`. Las etiquetas visibles están en `TRANSLATIONS` y se traducen con `data-i18n`.
- Lugares estables: `home` y `gym`. Las etiquetas visibles son `En casa` y `Gym o club` (o sus equivalentes en inglés).
- Agua: fecha y litros. Se permiten varios registros por día; se suman para obtener el total diario.
- El formulario de agua muestra un medidor de progreso y el total del día seleccionado. La meta es `WATER_GOAL_LITERS = 2`.
- Después de registrar estudio o ejercicio se limpia el formulario y la fecha vuelve a hoy. Después de registrar agua se conserva la fecha elegida y solo se limpia el monto, para poder cargar varios registros del mismo día.

## Idiomas

- La interfaz está disponible en español (predeterminado) e inglés. El idioma activo se expresa con `lang` en `<html>`.
- Los textos visibles se traducen con el diccionario `TRANSLATIONS` de `app.js` y los atributos `data-i18n`, `data-i18n-placeholder`, `data-i18n-aria-label` y `data-i18n-title`.
- El título del formulario (`form-title`), la nota (`form-note`) y el título del historial (`history-title`) son dinámicos: se actualizan en `renderActiveCategory()` según la categoría y el idioma. No agregarles `data-i18n` para evitar que `applyLanguage()` los pise.
- Al cambiar idioma se vuelven a renderizar las fechas, las unidades de racha (`día`/`días`), los títulos dinámicos, los estados vacíos, el estado del agua, los historiales y los `aria-label`; no dejar textos dinámicos en español.
- El título del documento, el título del masthead, los formularios, el historial y los controles deben quedar traducidos en ambos idiomas.
- Las etiquetas `ES` y `EN` del selector pueden quedar como abreviaturas, pero sus nombres accesibles deben ser completos en el idioma activo.

## Comandos

- Ver la app: `start index.html` desde esta carpeta en PowerShell, o abrir el archivo con doble clic.
- Verificación rápida de sintaxis: `node --check app.js`.
- Verificación de espacios y conflictos de diff: `git diff --check`.
- La verificación funcional es manual: abrir la página y probar los tres formularios, las tres rachas, el agua con 1 L y 2 L, el cambio de idioma, las tres frutas y los anchos móviles de 390 y 320 px.

## Datos y lógica

- Persistencia de estudio en `localStorage` con la clave `diario-de-estudio:sesiones`. No cambiarla sin migrar los datos existentes.
- Persistencia de ejercicio en `diario-de-estudio:ejercicios` y de agua en `diario-de-estudio:agua`.
- Persistencia de la fruta en `diario-de-estudio:fruta` y del idioma en `diario-de-estudio:idioma`.
- Cada sesión de estudio guarda `date`, `topic`, `notes`, `minutes` y `createdAt`. `notes` es opcional; si está vacío o ausente, el historial no muestra esa línea. No romper sesiones antiguas sin `notes`.
- Cada ejercicio guarda `date`, `description`, `type`, `duration`, `place` y `createdAt`.
- Cada registro de agua guarda `date`, `liters` y `createdAt`.
- Las claves antiguas `diario-de-estudio:tema` y `diario-de-estudio:icono` quedaron sin uso; no leerlas ni escribir en ellas.
- Un script temprano en `<head>` aplica la fruta y el idioma guardados antes de pintar para reducir parpadeos. La categoría activa no se aplica antes de pintar porque no se persiste.
- Racha actual: días consecutivos con registro. Si hoy no hay registro, arranca desde ayer; se corta en el primer día sin registro. La lógica está en `calculateCurrentStreak()`.
- Mejor racha: máximo histórico de días consecutivos. Se calcula sobre fechas únicas y ordenadas, ignorando fechas futuras o inválidas. La regla de "racha viva" solo aplica a la racha actual. La lógica está en `calculateBestStreak()`.
- Racha de estudio: fechas únicas con al menos una sesión.
- Racha de ejercicio: fechas únicas con al menos un ejercicio; varios ejercicios el mismo día cuentan una sola vez.
- Racha de agua: fechas cuyo total diario de litros alcanza la meta de 2 L. Varios registros del mismo día se suman. `isWaterGoalMet()` redondea a mililitros para evitar errores de coma flotante.
- El panel de agua muestra la racha de días con meta cumplida, no la cantidad de litros acumulados.
- El historial de agua agrupa los registros por fecha y muestra el total del día, si se cumplió la meta y la referencia `Meta 2 L`. No listar cada registro de agua por separado.
- Las rachas se derivan de las colecciones en cada render; no se guardan aparte.
- Fechas: siempre locales, con `toISODate()` y `addDays()`. No usar `toISOString()` ni `new Date('YYYY-MM-DD')`: pueden cambiar el día por la zona UTC.
- No probar con Live Server si ya hay datos guardados: `file://` y `http://localhost` son orígenes distintos y no comparten `localStorage`.
