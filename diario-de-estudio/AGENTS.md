# AGENTS.md

## Proyecto

- Web estática de tres archivos: `index.html`, `styles.css` y `app.js`. Sin frameworks, librerías, build, lint ni tests.
- Interfaz en español, con tema oscuro y acento `#6c3baa`.

## Comandos

- Ver la app: `start index.html` desde esta carpeta en PowerShell, o abrir el archivo con doble clic.
- La verificación es manual: abrir la página y probar el flujo.

## Datos y lógica

- Persistencia en `localStorage` con la clave `diario-de-estudio:sesiones`. No cambiarla sin migrar los datos existentes.
- Racha: días consecutivos con al menos una sesión; si hoy no hay sesión, arranca desde ayer; se corta en el primer día sin sesión. La lógica está en `calculateStreak()`.
- Fechas: siempre locales, con `toISODate()` y `addDays()`. No usar `toISOString()` ni `new Date('YYYY-MM-DD')`: pueden cambiar el día por la zona UTC.
- No probar con Live Server si ya hay datos guardados: `file://` y `http://localhost` son orígenes distintos y no comparten `localStorage`.
