'use strict';

// Claves de persistencia.
const STUDY_KEY = 'diario-de-estudio:sesiones';
const EXERCISE_KEY = 'diario-de-estudio:ejercicios';
const WATER_KEY = 'diario-de-estudio:agua';
const FRUIT_KEY = 'diario-de-estudio:fruta';
const LANGUAGE_KEY = 'diario-de-estudio:idioma';

const DEFAULT_FRUIT = 'lima';
const DEFAULT_LANGUAGE = 'es';
const FRUITS = ['lima', 'manzana', 'uva'];
const LANGUAGES = ['es', 'en'];
const CATEGORIES = ['study', 'exercise', 'water'];
const WATER_GOAL_LITERS = 2;

const EXERCISE_TYPE_KEYS = {
  aerobic: 'typeAerobic',
  walking: 'typeWalking',
  running: 'typeRunning',
  swimming: 'typeSwimming',
  contact: 'typeContact',
  football: 'typeFootball',
  basketball: 'typeBasketball',
  gym: 'typeGym',
  yoga: 'typeYoga',
  cycling: 'typeCycling',
  functional: 'typeFunctional',
  climbing: 'typeClimbing',
  racket: 'typeRacket',
  dance: 'typeDance',
  other: 'typeOther',
};

const EXERCISE_PLACE_KEYS = {
  home: 'placeHome',
  gym: 'placeGym',
};

const CATEGORY_CONFIG = {
  study: {
    titleKey: 'newSession',
    noteKey: 'formNote',
    historyKey: 'sessions',
    emptyKey: 'empty',
  },
  exercise: {
    titleKey: 'newExercise',
    noteKey: 'exerciseNote',
    historyKey: 'exercises',
    emptyKey: 'emptyExercises',
  },
  water: {
    titleKey: 'newWater',
    noteKey: 'waterNote',
    historyKey: 'waterHistory',
    emptyKey: 'emptyWater',
  },
};

const TRANSLATIONS = {
  es: {
    documentTitle: 'Diario de Estudio',
    title: 'Diario de Estudio',
    intro: 'Registra tu estudio, ejercicio y agua. Mantén vivas tus rachas.',
    streaksTitle: 'Rachas',
    streaksHint: 'Elegí una categoría para registrar.',
    study: 'Estudio',
    exercise: 'Ejercicio',
    water: 'Agua',
    streakLabel: 'Racha actual',
    bestShort: 'Mejor',
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
    newExercise: 'Nuevo ejercicio',
    exerciseDescription: 'Descripción del ejercicio',
    exerciseDescriptionPlaceholder: 'Ej.: Trote suave y elongación',
    exerciseType: 'Tipo de ejercicio',
    exerciseTypePlaceholder: 'Seleccioná un tipo',
    typeAerobic: 'Aeróbico',
    typeWalking: 'Caminata',
    typeRunning: 'Correr',
    typeSwimming: 'Natación',
    typeContact: 'Deporte de contacto',
    typeFootball: 'Fútbol',
    typeBasketball: 'Básquet',
    typeGym: 'Gimnasio / musculación',
    typeYoga: 'Yoga / pilates',
    typeCycling: 'Ciclismo',
    typeFunctional: 'Funcional / crossfit',
    typeClimbing: 'Escalada',
    typeRacket: 'Tenis / pádel',
    typeDance: 'Baile / danza',
    typeOther: 'Otro',
    duration: 'Tiempo (min)',
    durationPlaceholder: 'Ej.: 30',
    place: 'Lugar',
    placePlaceholder: 'Elegí un lugar',
    placeHome: 'En casa',
    placeGym: 'Gym o club',
    submitExercise: 'Registrar ejercicio',
    exerciseNote: 'Tus ejercicios quedan guardados en este navegador.',
    exercises: 'Ejercicios',
    emptyExercises: 'Todavía no hay ejercicios. Registra el primero para empezar tu racha.',
    newWater: 'Registrar agua',
    waterAmount: 'Agua (litros)',
    waterAmountPlaceholder: 'Ej.: 0,5',
    submitWater: 'Registrar agua',
    waterNote: 'Cada registro suma al total del día. La racha se activa al llegar a 2 litros.',
    waterHistory: 'Agua',
    emptyWater: 'Todavía no hay registros de agua. Cargá el primero para empezar.',
    waterGoalMet: 'Meta cumplida',
    waterRemaining: 'Faltan {amount} L',
    waterGoalShort: 'Meta 2 L',
    waterProgressLabel: 'Progreso de agua del día',
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
    intro: 'Log your study, exercise, and water. Keep your streaks alive.',
    streaksTitle: 'Streaks',
    streaksHint: 'Choose a category to log.',
    study: 'Study',
    exercise: 'Exercise',
    water: 'Water',
    streakLabel: 'Current streak',
    bestShort: 'Best',
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
    newExercise: 'New workout',
    exerciseDescription: 'Exercise description',
    exerciseDescriptionPlaceholder: 'E.g. Light jog and stretching',
    exerciseType: 'Exercise type',
    exerciseTypePlaceholder: 'Select a type',
    typeAerobic: 'Aerobic',
    typeWalking: 'Walking',
    typeRunning: 'Running',
    typeSwimming: 'Swimming',
    typeContact: 'Contact sport',
    typeFootball: 'Football',
    typeBasketball: 'Basketball',
    typeGym: 'Gym / strength',
    typeYoga: 'Yoga / pilates',
    typeCycling: 'Cycling',
    typeFunctional: 'Functional / CrossFit',
    typeClimbing: 'Climbing',
    typeRacket: 'Tennis / padel',
    typeDance: 'Dance',
    typeOther: 'Other',
    duration: 'Time (min)',
    durationPlaceholder: 'E.g. 30',
    place: 'Place',
    placePlaceholder: 'Choose a place',
    placeHome: 'At home',
    placeGym: 'Gym or club',
    submitExercise: 'Log workout',
    exerciseNote: 'Your workouts are saved in this browser.',
    exercises: 'Workouts',
    emptyExercises: 'No workouts yet. Log your first one to start your streak.',
    newWater: 'Log water',
    waterAmount: 'Water (liters)',
    waterAmountPlaceholder: 'E.g. 0.5',
    submitWater: 'Log water',
    waterNote: 'Each entry adds to the daily total. The streak starts at 2 liters.',
    waterHistory: 'Water',
    emptyWater: 'No water entries yet. Log your first one to start.',
    waterGoalMet: 'Goal met',
    waterRemaining: '{amount} L to go',
    waterGoalShort: 'Goal 2 L',
    waterProgressLabel: 'Daily water progress',
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

const studyForm = document.getElementById('study-form');
const studyDateInput = document.getElementById('study-date');
const studyTopicInput = document.getElementById('study-topic');
const studyNotesInput = document.getElementById('study-notes');
const studyMinutesInput = document.getElementById('study-minutes');

const exerciseForm = document.getElementById('exercise-form');
const exerciseDateInput = document.getElementById('exercise-date');
const exerciseDescriptionInput = document.getElementById('exercise-description');
const exerciseTypeInput = document.getElementById('exercise-type');
const exerciseDurationInput = document.getElementById('exercise-duration');
const exercisePlaceInput = document.getElementById('exercise-place');

const waterForm = document.getElementById('water-form');
const waterDateInput = document.getElementById('water-date');
const waterAmountInput = document.getElementById('water-amount');
const waterStatusTotal = document.getElementById('water-status-total');
const waterStatusLabel = document.getElementById('water-status-label');
const waterMeter = document.getElementById('water-meter');
const waterMeterFill = document.getElementById('water-meter-fill');

const formTitle = document.getElementById('form-title');
const formNote = document.getElementById('form-note');
const historyTitle = document.getElementById('history-title');
const historyList = document.getElementById('history-list');
const categoryButtons = document.querySelectorAll('[data-category]');
const categoryForms = document.querySelectorAll('[data-form-category]');
const fruitButtons = document.querySelectorAll('[data-fruit-value]');
const languageButtons = document.querySelectorAll('[data-language-value]');
const translatableElements = document.querySelectorAll('[data-i18n]');
const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
const ariaLabelElements = document.querySelectorAll('[data-i18n-aria-label]');
const titleElements = document.querySelectorAll('[data-i18n-title]');

const streakRefs = {
  study: {
    current: document.getElementById('study-streak'),
    currentUnit: document.getElementById('study-streak-unit'),
    best: document.getElementById('study-best'),
    bestUnit: document.getElementById('study-best-unit'),
  },
  exercise: {
    current: document.getElementById('exercise-streak'),
    currentUnit: document.getElementById('exercise-streak-unit'),
    best: document.getElementById('exercise-best'),
    bestUnit: document.getElementById('exercise-best-unit'),
  },
  water: {
    current: document.getElementById('water-streak'),
    currentUnit: document.getElementById('water-streak-unit'),
    best: document.getElementById('water-best'),
    bestUnit: document.getElementById('water-best-unit'),
  },
};

let studySessions = loadCollection(STUDY_KEY);
let exercises = loadCollection(EXERCISE_KEY);
let waterEntries = loadCollection(WATER_KEY);
let fruit = loadChoice(FRUIT_KEY, FRUITS, DEFAULT_FRUIT);
let language = loadChoice(LANGUAGE_KEY, LANGUAGES, DEFAULT_LANGUAGE);
let activeCategory = 'study';

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

// ---------- Persistencia ----------

function loadCollection(key) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return [];
    }
    const data = JSON.parse(stored);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function saveCollection(key, data, label) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    // Si el navegador bloquea localStorage, la app sigue funcionando en memoria.
    console.warn(`No se pudieron guardar ${label}:`, error);
  }
}

function saveStudySessions() {
  saveCollection(STUDY_KEY, studySessions, 'las sesiones');
}

function saveExercises() {
  saveCollection(EXERCISE_KEY, exercises, 'los ejercicios');
}

function saveWaterEntries() {
  saveCollection(WATER_KEY, waterEntries, 'el agua');
}

// ---------- Rachas ----------

function validDatesFrom(entries) {
  return [
    ...new Set(
      entries
        .map((entry) => entry.date)
        .filter((date) => isValidISODate(date))
    ),
  ];
}

function getWaterTotals() {
  const totals = new Map();

  for (const entry of waterEntries) {
    if (!isValidISODate(entry.date)) {
      continue;
    }

    const liters = Number(entry.liters);
    if (!Number.isFinite(liters) || liters <= 0) {
      continue;
    }

    totals.set(entry.date, (totals.get(entry.date) ?? 0) + liters);
  }

  return totals;
}

function isWaterGoalMet(totalLiters) {
  return Math.round(totalLiters * 1000) >= WATER_GOAL_LITERS * 1000;
}

function getWaterGoalDates() {
  return [...getWaterTotals().entries()]
    .filter(([, total]) => isWaterGoalMet(total))
    .map(([date]) => date);
}

function calculateCurrentStreak(days) {
  const daySet = new Set(days);

  // Si hoy no hay registro, la racha puede seguir viva gracias a ayer.
  let cursor = todayISO();
  if (!daySet.has(cursor)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (daySet.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function calculateBestStreak(days) {
  const today = todayISO();
  const sortedDays = [...new Set(days)]
    // Las fechas futuras todavía no cuentan como racha conseguida.
    .filter((date) => date <= today)
    .sort();

  let best = 0;
  let run = 0;
  let previous = '';

  for (const date of sortedDays) {
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

function renderStreakPanel(category, days) {
  const refs = streakRefs[category];
  const current = calculateCurrentStreak(days);
  const best = calculateBestStreak(days);

  refs.current.textContent = String(current);
  refs.currentUnit.textContent = current === 1 ? t('day') : t('days');
  refs.best.textContent = String(best);
  refs.bestUnit.textContent = best === 1 ? t('day') : t('days');
}

function renderStreaks() {
  renderStreakPanel('study', validDatesFrom(studySessions));
  renderStreakPanel('exercise', validDatesFrom(exercises));
  renderStreakPanel('water', getWaterGoalDates());
}

// ---------- Formato ----------

function formatLiters(liters) {
  return new Intl.NumberFormat(t('locale'), {
    maximumFractionDigits: 2,
  }).format(liters);
}

function exerciseTypeLabel(type) {
  return t(EXERCISE_TYPE_KEYS[type] ?? 'typeOther');
}

function exercisePlaceLabel(place) {
  return t(EXERCISE_PLACE_KEYS[place] ?? 'placeHome');
}

// ---------- Interfaz ----------

function renderActiveCategory() {
  const config = CATEGORY_CONFIG[activeCategory];

  formTitle.textContent = t(config.titleKey);
  formNote.textContent = t(config.noteKey);
  historyTitle.textContent = t(config.historyKey);

  for (const button of categoryButtons) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.category === activeCategory)
    );
  }

  for (const form of categoryForms) {
    form.hidden = form.dataset.formCategory !== activeCategory;
  }
}

function createHistoryItem({
  dateValue,
  title,
  detail = '',
  detailClass = 'session__notes',
  metric,
}) {
  const item = document.createElement('li');
  item.className = 'session';

  const date = document.createElement('time');
  date.className = 'session__date';
  date.dateTime = dateValue;
  date.textContent = formatDate(dateValue);

  const info = document.createElement('div');
  info.className = 'session__info';

  const heading = document.createElement('h3');
  heading.className = 'session__topic';
  heading.textContent = title;
  info.append(heading);

  if (detail !== '') {
    const detailNode = document.createElement('p');
    detailNode.className = detailClass;
    detailNode.textContent = detail;
    info.append(detailNode);
  }

  const metricNode = document.createElement('span');
  metricNode.className = 'session__minutes';
  metricNode.textContent = metric;

  item.append(date, info, metricNode);
  return item;
}

function renderStudyHistory() {
  return [...studySessions]
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date < b.date ? 1 : -1;
      }
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    })
    .map((session) => {
      const notes =
        typeof session.notes === 'string' ? session.notes.trim() : '';
      return createHistoryItem({
        dateValue: session.date,
        title: session.topic,
        detail: notes,
        detailClass: 'session__notes',
        metric: `${session.minutes} min`,
      });
    });
}

function renderExerciseHistory() {
  return [...exercises]
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date < b.date ? 1 : -1;
      }
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    })
    .map((exercise) => createHistoryItem({
      dateValue: exercise.date,
      title: exercise.description,
      detail: `${exerciseTypeLabel(exercise.type)} · ${exercisePlaceLabel(exercise.place)}`,
      detailClass: 'session__meta',
      metric: `${exercise.duration} min`,
    }));
}

function renderWaterHistory() {
  return [...getWaterTotals().entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, total]) => {
      const remaining = Math.max(0, WATER_GOAL_LITERS - total);
      const detail = isWaterGoalMet(total)
        ? t('waterGoalMet')
        : t('waterRemaining').replace('{amount}', formatLiters(remaining));

      return createHistoryItem({
        dateValue: date,
        title: `${formatLiters(total)} L`,
        detail,
        detailClass: 'session__meta',
        metric: t('waterGoalShort'),
      });
    });
}

function renderHistory() {
  historyList.replaceChildren();

  let items = [];
  if (activeCategory === 'study') {
    items = renderStudyHistory();
  } else if (activeCategory === 'exercise') {
    items = renderExerciseHistory();
  } else {
    items = renderWaterHistory();
  }

  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'sessions__empty';
    empty.textContent = t(CATEGORY_CONFIG[activeCategory].emptyKey);
    historyList.append(empty);
    return;
  }

  historyList.append(...items);
}

function renderWaterStatus() {
  const date = waterDateInput.value;
  const total =
    date && isValidISODate(date) ? (getWaterTotals().get(date) ?? 0) : 0;
  const totalText = `${formatLiters(total)} L / ${WATER_GOAL_LITERS} L`;
  const met = isWaterGoalMet(total);
  const remaining = Math.max(0, WATER_GOAL_LITERS - total);

  waterStatusTotal.textContent = totalText;
  waterStatusLabel.textContent = met
    ? t('waterGoalMet')
    : t('waterRemaining').replace('{amount}', formatLiters(remaining));
  waterStatusLabel.classList.toggle('is-complete', met);

  const ratio = Math.min(1, total / WATER_GOAL_LITERS);
  waterMeterFill.style.width = `${ratio * 100}%`;
  waterMeter.setAttribute(
    'aria-valuenow',
    String(Math.min(total, WATER_GOAL_LITERS))
  );
  waterMeter.setAttribute('aria-valuetext', totalText);
}

function render() {
  renderStreaks();
  renderActiveCategory();
  renderHistory();
  renderWaterStatus();
}

function setActiveCategory(category) {
  if (!CATEGORIES.includes(category)) {
    return;
  }
  activeCategory = category;
  render();
}

function isValidExerciseType(value) {
  return Object.prototype.hasOwnProperty.call(EXERCISE_TYPE_KEYS, value);
}

function isValidExercisePlace(value) {
  return Object.prototype.hasOwnProperty.call(EXERCISE_PLACE_KEYS, value);
}

// ---------- Eventos ----------

for (const button of categoryButtons) {
  button.addEventListener('click', () => {
    setActiveCategory(button.dataset.category);
  });
}

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

studyForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = studyDateInput.value;
  const topic = studyTopicInput.value.trim();
  const notes = studyNotesInput.value.trim();
  const minutes = Number(studyMinutesInput.value);

  if (
    !isValidISODate(date) ||
    topic === '' ||
    !Number.isFinite(minutes) ||
    minutes <= 0
  ) {
    return;
  }

  studySessions.push({
    date,
    topic,
    notes,
    minutes,
    createdAt: Date.now(),
  });

  saveStudySessions();
  render();

  studyForm.reset();
  studyDateInput.value = todayISO();
  studyTopicInput.focus();
});

exerciseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = exerciseDateInput.value;
  const description = exerciseDescriptionInput.value.trim();
  const type = exerciseTypeInput.value;
  const duration = Number(exerciseDurationInput.value);
  const place = exercisePlaceInput.value;

  if (
    !isValidISODate(date) ||
    description === '' ||
    !isValidExerciseType(type) ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    !isValidExercisePlace(place)
  ) {
    return;
  }

  exercises.push({
    date,
    description,
    type,
    duration,
    place,
    createdAt: Date.now(),
  });

  saveExercises();
  render();

  exerciseForm.reset();
  exerciseDateInput.value = todayISO();
  exerciseDescriptionInput.focus();
});

waterForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = waterDateInput.value;
  const liters = Number(waterAmountInput.value);

  if (
    !isValidISODate(date) ||
    !Number.isFinite(liters) ||
    liters <= 0 ||
    liters > 20
  ) {
    return;
  }

  waterEntries.push({
    date,
    liters: Math.round(liters * 1000) / 1000,
    createdAt: Date.now(),
  });

  saveWaterEntries();
  render();

  waterAmountInput.value = '';
  waterAmountInput.focus();
});

waterDateInput.addEventListener('change', renderWaterStatus);
waterDateInput.addEventListener('input', renderWaterStatus);

// ---------- Inicio ----------

studyDateInput.value = todayISO();
exerciseDateInput.value = todayISO();
waterDateInput.value = todayISO();

applyFruit(fruit);
applyLanguage(language);
