'use strict';

// Claves de persistencia.
const STORAGE_KEY = 'diario-de-estudio:sesiones';
const THEME_KEY = 'diario-de-estudio:tema';
const ICON_KEY = 'diario-de-estudio:icono';

const THEMES = ['claro', 'oscuro', 'violeta'];
const DEFAULT_THEME = 'oscuro';
const THEME_COLORS = {
  claro: '#f6f2fb',
  oscuro: '#0e0b14',
  violeta: '#180d2b',
};

const STREAK_ICONS = [
  { emoji: '🔥', name: 'Fuego' },
  { emoji: '⚡', name: 'Rayo' },
  { emoji: '⭐', name: 'Estrella' },
  { emoji: '🚀', name: 'Cohete' },
  { emoji: '🧠', name: 'Cerebro' },
  { emoji: '📚', name: 'Libros' },
  { emoji: '💪', name: 'Fuerza' },
  { emoji: '🏆', name: 'Trofeo' },
  { emoji: '🌱', name: 'Brote' },
  { emoji: '🎯', name: 'Objetivo' },
];
const DEFAULT_ICON = STREAK_ICONS[0].emoji;

const form = document.getElementById('session-form');
const dateInput = document.getElementById('date');
const topicInput = document.getElementById('topic');
const minutesInput = document.getElementById('minutes');
const streakDays = document.getElementById('streak-days');
const streakUnit = document.getElementById('streak-unit');
const bestStreakDays = document.getElementById('best-streak');
const bestStreakUnit = document.getElementById('best-streak-unit');
const sessionsList = document.getElementById('sessions-list');
const themeButtons = document.querySelectorAll('[data-theme-value]');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const iconToggle = document.getElementById('icon-toggle');
const iconPicker = document.getElementById('icon-picker');
const iconPickerGrid = document.getElementById('icon-picker-grid');
const streakIcon = document.getElementById('streak-icon');

let sessions = loadSessions();
let currentIcon = DEFAULT_ICON;

// ---------- Fechas (siempre en hora local) ----------

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayISO() {
  return toISODate(new Date());
}

// Suma o resta días usando componentes locales, sin pasar por UTC.
function addDays(isoDate, days) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day + days);
  return toISODate(date);
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Comprueba que sea una fecha ISO real (por ejemplo, rechaza 2026-02-30).
function isValidISODate(isoDate) {
  if (typeof isoDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return false;
  }

  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// ---------- Persistencia ----------

function loadSessions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const data = JSON.parse(stored);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function saveSessions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    // Si el navegador bloquea localStorage, la app sigue funcionando en memoria.
    console.warn('No se pudieron guardar las sesiones:', error);
  }
}

function loadSetting(key, fallback, isValid) {
  try {
    const value = localStorage.getItem(key);
    return isValid(value) ? value : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`No se pudo guardar ${key}:`, error);
  }
}

// ---------- Tema e icono ----------

function setTheme(theme) {
  const nextTheme = THEMES.includes(theme) ? theme : DEFAULT_THEME;

  document.documentElement.dataset.theme = nextTheme;
  themeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeValue === nextTheme));
  });

  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', THEME_COLORS[nextTheme]);
  }

  saveSetting(THEME_KEY, nextTheme);
}

function renderIcon() {
  streakIcon.textContent = currentIcon;

  for (const option of iconPickerGrid.querySelectorAll('[data-icon]')) {
    option.setAttribute('aria-pressed', String(option.dataset.icon === currentIcon));
  }
}

function setIcon(icon) {
  if (!STREAK_ICONS.some((item) => item.emoji === icon)) {
    return;
  }

  currentIcon = icon;
  saveSetting(ICON_KEY, icon);
  renderIcon();
}

function buildIconPicker() {
  iconPickerGrid.replaceChildren();

  for (const { emoji, name } of STREAK_ICONS) {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'icon-picker__option';
    option.dataset.icon = emoji;
    option.textContent = emoji;
    option.title = name;
    option.setAttribute('aria-label', `Usar icono ${name}`);

    option.addEventListener('click', () => {
      setIcon(emoji);
      closeIconPicker();
      iconToggle.focus();
    });

    iconPickerGrid.append(option);
  }

  renderIcon();
}

function openIconPicker() {
  iconPicker.hidden = false;
  iconToggle.setAttribute('aria-expanded', 'true');

  const activeOption = [...iconPickerGrid.querySelectorAll('[data-icon]')].find(
    (option) => option.dataset.icon === currentIcon
  );

  if (activeOption) {
    activeOption.focus();
  }
}

function closeIconPicker() {
  iconPicker.hidden = true;
  iconToggle.setAttribute('aria-expanded', 'false');
}

// ---------- Racha ----------

function calculateStreak() {
  const daysWithSessions = new Set(sessions.map((session) => session.date));

  // Si hoy no hay sesión, la racha puede seguir viva gracias a ayer.
  let cursor = todayISO();
  if (!daysWithSessions.has(cursor)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (daysWithSessions.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function calculateBestStreak() {
  const today = todayISO();
  const days = [...new Set(sessions.map((session) => session.date))]
    // Las fechas futuras todavía no cuentan como racha conseguida.
    .filter((date) => isValidISODate(date) && date <= today)
    .sort();

  let best = 0;
  let run = 0;
  let previous = '';

  for (const date of days) {
    if (previous !== '' && date === addDays(previous, 1)) {
      run += 1;
    } else {
      run = 1;
    }

    best = Math.max(best, run);
    previous = date;
  }

  return best;
}

// ---------- Interfaz ----------

function renderStreak() {
  const streak = calculateStreak();
  const bestStreak = calculateBestStreak();

  streakDays.textContent = String(streak);
  streakUnit.textContent = streak === 1 ? 'día' : 'días';

  bestStreakDays.textContent = String(bestStreak);
  bestStreakUnit.textContent = bestStreak === 1 ? 'día' : 'días';
}

function renderSessions() {
  sessionsList.replaceChildren();

  if (sessions.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'sessions__empty';
    empty.textContent = 'Todavía no has registrado ninguna sesión.';
    sessionsList.append(empty);
    return;
  }

  // De la más reciente a la más antigua; si comparten fecha, la última creada va primero.
  const sorted = [...sessions].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return (b.createdAt ?? 0) - (a.createdAt ?? 0);
  });

  for (const session of sorted) {
    const item = document.createElement('li');
    item.className = 'session';

    const info = document.createElement('div');
    info.className = 'session__info';

    const topic = document.createElement('h3');
    topic.className = 'session__topic';
    topic.textContent = session.topic;

    const date = document.createElement('p');
    date.className = 'session__date';
    date.textContent = formatDate(session.date);

    info.append(topic, date);

    const minutes = document.createElement('span');
    minutes.className = 'session__minutes';
    minutes.textContent = `${session.minutes} min`;

    item.append(info, minutes);
    sessionsList.append(item);
  }
}

function render() {
  renderStreak();
  renderSessions();
}

// ---------- Eventos ----------

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = dateInput.value;
  const topic = topicInput.value.trim();
  const minutes = Number(minutesInput.value);

  if (!date || topic === '' || !Number.isFinite(minutes) || minutes <= 0) {
    return;
  }

  sessions.push({
    date,
    topic,
    minutes,
    createdAt: Date.now(),
  });

  saveSessions();
  render();

  form.reset();
  dateInput.value = todayISO();
  topicInput.focus();
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setTheme(button.dataset.themeValue);
  });
});

iconToggle.addEventListener('click', () => {
  if (iconPicker.hidden) {
    openIconPicker();
  } else {
    closeIconPicker();
    iconToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (iconPicker.hidden) {
    return;
  }

  if (!iconPicker.contains(event.target) && !iconToggle.contains(event.target)) {
    closeIconPicker();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !iconPicker.hidden) {
    closeIconPicker();
    iconToggle.focus();
  }
});

// ---------- Inicio ----------

dateInput.value = todayISO();
setTheme(loadSetting(THEME_KEY, DEFAULT_THEME, (value) => THEMES.includes(value)));
currentIcon = loadSetting(ICON_KEY, DEFAULT_ICON, (icon) =>
  STREAK_ICONS.some((item) => item.emoji === icon)
);
buildIconPicker();
render();
