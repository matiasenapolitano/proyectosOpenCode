# AGENTS.md

## Proyecto

- Web estática de tres archivos: `index.html`, `styles.css` y `app.js`. Sin frameworks, librerías, build, lint ni tests.
- Interfaz en español, con una única paleta de negros oliva y acento verde lima `#B8E63C`.
- El icono de racha es una lima SVG fija. No hay selector de temas ni de iconos; `--lime` es el único acento de la interfaz y debe coincidir con el verde principal de la lima.
- No reintroducir temas alternativos ni selectores de icono sin cambiar esta dirección visual.

## Comandos

- Ver la app: `start index.html` desde esta carpeta en PowerShell, o abrir el archivo con doble clic.
- La verificación es manual: abrir la página y probar el flujo.

## Datos y lógica

- Persistencia en `localStorage` con la clave `diario-de-estudio:sesiones`. No cambiarla sin migrar los datos existentes.
- Las claves antiguas `diario-de-estudio:tema` y `diario-de-estudio:icono` quedaron sin uso; no leerlas ni escribir en ellas.
- Racha: días consecutivos con al menos una sesión; si hoy no hay sesión, arranca desde ayer; se corta en el primer día sin sesión. La lógica está en `calculateStreak()`.
- Mejor racha: máximo histórico de días consecutivos con al menos una sesión. Se calcula sobre fechas únicas y ordenadas, ignorando fechas futuras o inválidas. La regla de "racha viva" solo aplica a la racha actual. La lógica está en `calculateBestStreak()`.
- La mejor racha se deriva de `sessions` en cada render; no se guarda aparte.
- Fechas: siempre locales, con `toISODate()` y `addDays()`. No usar `toISOString()` ni `new Date('YYYY-MM-DD')`: pueden cambiar el día por la zona UTC.
- No probar con Live Server si ya hay datos guardados: `file://` y `http://localhost` son orígenes distintos y no comparten `localStorage`.
