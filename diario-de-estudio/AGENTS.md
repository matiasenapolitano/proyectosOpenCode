# AGENTS.md

## Proyecto

- Web estática de tres archivos: `index.html`, `styles.css` y `app.js`. Sin frameworks, librerías, build, lint ni tests.
- Interfaz en español; tema oscuro por defecto y acento base `#6c3baa`.
- Temas: `claro`, `oscuro` (por defecto) y `violeta`. Se aplican con `data-theme` en `<html>` y se guardan en `diario-de-estudio:tema`. Usar las variables CSS de `:root`; no hardcodear colores de tema.
- Icono de racha: 10 opciones definidas en `STREAK_ICONS`, guardadas en `diario-de-estudio:icono` y elegidas desde `#icon-picker`.

## Comandos

- Ver la app: `start index.html` desde esta carpeta en PowerShell, o abrir el archivo con doble clic.
- La verificación es manual: abrir la página y probar el flujo.

## Datos y lógica

- Persistencia en `localStorage` con la clave `diario-de-estudio:sesiones`. No cambiarla sin migrar los datos existentes.
- Racha: días consecutivos con al menos una sesión; si hoy no hay sesión, arranca desde ayer; se corta en el primer día sin sesión. La lógica está en `calculateStreak()`.
- Mejor racha: máximo histórico de días consecutivos con al menos una sesión. Se calcula sobre fechas únicas y ordenadas, ignorando fechas futuras o inválidas. La regla de "racha viva" solo aplica a la racha actual. La lógica está en `calculateBestStreak()`.
- La mejor racha se deriva de `sessions` en cada render; no se guarda aparte.
- Fechas: siempre locales, con `toISODate()` y `addDays()`. No usar `toISOString()` ni `new Date('YYYY-MM-DD')`: pueden cambiar el día por la zona UTC.
- No probar con Live Server si ya hay datos guardados: `file://` y `http://localhost` son orígenes distintos y no comparten `localStorage`.
