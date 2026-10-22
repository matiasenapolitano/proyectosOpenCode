# AGENTS.md

## Repositorio

- `proyectosOpenCode` agrupa proyectos independientes. Cada proyecto vive en su propia subcarpeta; no hay manifest, build, lint ni tests en la raíz.
- Único proyecto actual: `diario-de-estudio/`, una web estática de tres archivos. Si un proyecto crece, agregá su propio `AGENTS.md` dentro de esa carpeta en lugar de inflar este archivo.

## Comandos

- Ver la app: `start diario-de-estudio\index.html` desde PowerShell, o abrir el archivo con doble clic.
- No hay lint, typecheck, tests ni build: la verificación es abrir la página y probar el flujo a mano.
- Git: rama `main`, remoto `origin` en GitHub. No hay CI.

## diario-de-estudio

- Mantener HTML, CSS y JavaScript sin frameworks, librerías ni compilación.
- La interfaz está en español y usa tema oscuro con acento `#6c3baa`.
- Persistencia: `localStorage` con la clave `diario-de-estudio:sesiones`. No cambiarla sin migrar los datos existentes.
- Racha: días consecutivos con al menos una sesión; si hoy no hay sesión, arranca desde ayer; se corta en el primer día sin sesión. La lógica está en `calculateStreak()`.
- Fechas: siempre locales, con `toISODate()` y `addDays()`. No usar `toISOString()` ni `new Date('YYYY-MM-DD')`: pueden cambiar el día por la zona UTC.
- No probar con Live Server si ya hay datos guardados: `file://` y `http://localhost` son orígenes distintos y no comparten `localStorage`.
