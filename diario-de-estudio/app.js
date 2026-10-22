'use strict';

// Clave con la que guardamos las sesiones en localStorage.
const STORAGE_KEY = 'diario-de-estudio:sesiones';

const form = document.getElementById('session-form');
const dateInput = document.getElementById('date');
const topicInput = document.getElementById('topic');
const minutesInput = document.getElementById('minutes');
const streakDays = document.getElementById('streak-days');
const streakUnit = document.getElementById('streak-unit');
const sessionsList = document.getElementById('sessions-list');

let sessions = loadSessions();

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

// ---------- Interfaz ----------

function renderStreak() {
  const streak = calculateStreak();
  streakDays.textContent = String(streak);
  streakUnit.textContent = streak === 1 ? 'día' : 'días';
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

// ---------- Inicio ----------

dateInput.value = todayISO();
render();
