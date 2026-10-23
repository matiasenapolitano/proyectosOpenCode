'use strict';

// Claves de persistencia.
const STORAGE_KEY = 'diario-de-estudio:sesiones';
const FRUIT_KEY = 'diario-de-estudio:fruta';
const LANGUAGE_KEY = 'diario-de-estudio:idioma';

const DEFAULT_FRUIT = 'lima';
const DEFAULT_LANGUAGE = 'es';
const FRUITS = ['lima', 'manzana', 'uva'];
const LANGUAGES = ['es', 'en'];

const TRANSLATIONS = {
  es: {
    documentTitle: 'Diario de Estudio',
    title: 'Diario de Estudio',
    intro: 'Registra tus sesiones y mantén viva tu racha.',
    streakLabel: 'Racha actual',
    bestStreak: 'Mejor racha',
    day: 'día',
    days: 'días',
    newSession: 'Nueva sesión',
    date: 'Fecha',
    topic: 'Tema de estudio',
    topicPlaceholder: 'Ej.: Repasar JavaScript',
    notes: 'Notas',
    notesPlaceholder: 'Ej.: Dudas, ideas o algo para recordar',
    minutes: 'Minutos',
    minutesPlaceholder: 'Ej.: 45',
    submit: 'Registrar sesión',
    formNote: 'Tus sesiones quedan guardadas en este navegador.',
    sessions: 'Sesiones',
    empty: 'Todavía no hay sesiones. Registra la primera para empezar tu racha.',
    fruitGroup: 'Fruta',
    fruitLima: 'Lima',
    fruitManzana: 'Manzana',
    fruitUva: 'Uva',
    languageGroup: 'Idioma',
    languageSpanish: 'Español',
    languageEnglish: 'Inglés',
    locale: 'es-ES',
  },
  en: {
    documentTitle: 'Study Journal',
    title: 'Study Journal',
    intro: 'Log your sessions and keep your streak alive.',
    streakLabel: 'Current streak',
    bestStreak: 'Best streak',
    day: 'day',
    days: 'days',
    newSession: 'New session',
    date: 'Date',
    topic: 'Study topic',
    topicPlaceholder: 'E.g. Review JavaScript',
    notes: 'Notes',
    notesPlaceholder: 'E.g. Questions, ideas, or something to remember',
    minutes: 'Minutes',
    minutesPlaceholder: 'E.g. 45',
    submit: 'Log session',
    formNote: 'Your sessions are saved in this browser.',
    sessions: 'Sessions',
    empty: 'No sessions yet. Log your first one to start your streak.',
    fruitGroup: 'Fruit',
    fruitLima: 'Lime',
    fruitManzana: 'Apple',
    fruitUva: 'Grape',
    languageGroup: 'Language',
    languageSpanish: 'Spanish',
    languageEnglish: 'English',
    locale: 'en-US',
  },
};

const form = document.getElementById('session-form');
const dateInput = document.getElementById('date');
const topicInput = document.getElementById('topic');
const notesInput = document.getElementById('notes');
const minutesInput = document.getElementById('minutes');
const streakDays = document.getElementById('streak-days');
const streakUnit = document.getElementById('streak-unit');
const bestStreakDays = document.getElementById('best-streak');
const bestStreakUnit = document.getElementById('best-streak-unit');
const sessionsList = document.getElementById('sessions-list');
const fruitButtons = document.querySelectorAll('[data-fruit-value]');
const languageButtons = document.querySelectorAll('[data-language-value]');
const translatableElements = document.querySelectorAll('[data-i18n]');
const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
const ariaLabelElements = document.querySelectorAll('[data-i18n-aria-label]');
const titleElements = document.querySelectorAll('[data-i18n-title]');

let sessions = loadSessions();
let fruit = loadChoice(FRUIT_KEY, FRUITS, DEFAULT_FRUIT);
let language = loadChoice(LANGUAGE_KEY, LANGUAGES, DEFAULT_LANGUAGE);

function t(key) {
  return TRANSLATIONS[language][key] ?? key;
}

// ---------- Preferencias ----------

function loadChoice(key, allowed, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return allowed.includes(stored) ? stored : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveChoice(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('No se pudo guardar la preferencia:', error);
  }
}

function applyFruit(nextFruit) {
  fruit = FRUITS.includes(nextFruit) ? nextFruit : DEFAULT_FRUIT;
  document.documentElement.dataset.fruit = fruit;

  for (const button of fruitButtons) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.fruitValue === fruit)
    );
  }

  saveChoice(FRUIT_KEY, fruit);
}

function applyLanguage(nextLanguage) {
  language = LANGUAGES.includes(nextLanguage) ? nextLanguage : DEFAULT_LANGUAGE;
  document.documentElement.lang = language;
  document.title = t('documentTitle');

  for (const element of translatableElements) {
    element.textContent = t(element.dataset.i18n);
  }

  for (const element of placeholderElements) {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  }

  for (const element of ariaLabelElements) {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  }

  for (const element of titleElements) {
    element.title = t(element.dataset.i18nTitle);
  }

  for (const button of languageButtons) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.languageValue === language)
    );
  }

  saveChoice(LANGUAGE_KEY, language);
  render();
}

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
  return date
    .toLocaleDateString(t('locale'), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace('.', '');
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

// ---------- Persistencia de sesiones ----------

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
  streakUnit.textContent = streak === 1 ? t('day') : t('days');

  bestStreakDays.textContent = String(bestStreak);
  bestStreakUnit.textContent = bestStreak === 1 ? t('day') : t('days');
}

function renderSessions() {
  sessionsList.replaceChildren();

  if (sessions.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'sessions__empty';
    empty.textContent = t('empty');
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

    const date = document.createElement('time');
    date.className = 'session__date';
    date.dateTime = session.date;
    date.textContent = formatDate(session.date);

    const info = document.createElement('div');
    info.className = 'session__info';

    const topic = document.createElement('h3');
    topic.className = 'session__topic';
    topic.textContent = session.topic;

    info.append(topic);

    const notesText =
      typeof session.notes === 'string' ? session.notes.trim() : '';
    if (notesText !== '') {
      const notes = document.createElement('p');
      notes.className = 'session__notes';
      notes.textContent = notesText;
      info.append(notes);
    }

    const minutes = document.createElement('span');
    minutes.className = 'session__minutes';
    minutes.textContent = `${session.minutes} min`;

    item.append(date, info, minutes);
    sessionsList.append(item);
  }
}

function render() {
  renderStreak();
  renderSessions();
}

// ---------- Eventos ----------

for (const button of fruitButtons) {
  button.addEventListener('click', () => {
    applyFruit(button.dataset.fruitValue);
  });
}

for (const button of languageButtons) {
  button.addEventListener('click', () => {
    applyLanguage(button.dataset.languageValue);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = dateInput.value;
  const topic = topicInput.value.trim();
  const notes = notesInput.value.trim();
  const minutes = Number(minutesInput.value);

  if (!date || topic === '' || !Number.isFinite(minutes) || minutes <= 0) {
    return;
  }

  sessions.push({
    date,
    topic,
    notes,
    minutes,
    createdAt: Date.now(),
  });

  saveSessions();
  render();

  form.reset();
  dateInput.value = todayISO();
  topicInput.focus();
});

// ---------- Inicio ----------

dateInput.value = todayISO();
applyFruit(fruit);
applyLanguage(language);
