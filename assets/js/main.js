// Navigation toggle for mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navlinks');
const navAnchors = navLinks?.querySelectorAll('a');

if(navToggle && navLinks){
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

navAnchors?.forEach((link) => {
  link.addEventListener('click', () => {
    if(navLinks?.classList.contains('is-open')){
      navLinks.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Footer year
const yearEl = document.getElementById('year');
if(yearEl){
  yearEl.textContent = new Date().getFullYear();
}

// Timeline data: maintain events here
const timelineEvents = [
  { start: '2025-09-08', title: 'Schuljahresbeginn', category: 'Schule', description: '' },
  { start: '2025-09-08', end: '2025-09-22', title: 'Wahl der Klassen- und Jahrgangssprecher:innen', category: 'Wahlen', description: 'Klassenteams organisieren Urnen, sammeln Kandidaturen und wählen ihre neuen Sprecher:innen.' },
  { start: '2025-10-07', title: 'Wahl des Schülersprecher:innen-Teams', category: 'Wahlen', description: 'Alle Klassen- und Jahrgangssprecher:innen stimmen über das neue Sprecher:innen-Team ab.' },
  { start: '2025-10-14', title: '1. GSV', category: 'GSV', description: 'Auftakt der Gesamtschülervertretung, Sammeln eurer Themen für das Schuljahr.' },
  { start: '2025-10-20', title: 'Video über die Gremien an unserer Schule', category: 'Transparenz', description: 'Kurzclip zu GSV, Schulkonferenz und Gesamtelternvertretung – wer entscheidet was und wie könnt ihr mitreden?' },
  { start: '2025-11-10', title: 'Start: Kostenlose Hygieneartikel', category: 'Hygiene', description: 'Seit dem 10. November stehen auf der Mädchentoilette im Erdgeschoss kostenlose Hygieneartikel für Notfälle für euch bereit.' },
  { start: '2025-11-14', title: 'YOLO-Party & Kultur-Dinner', category: 'Event', description: 'Vom Stadtteilzentrum Kladow mitorganisiert; Raneem Hachim bringt beim Kultur-Dinner Stimmen für Vielfalt an einen Tisch.' },
  { start: '2025-11-17', title: '1. Schulkonferenz', category: 'Schulkonferenz', description: 'Erfolgreicher erster Antrag für die zeitnahe Veröffentlichung der Schulkonferenz-Protokolle.' },
  { start: '2025-11-28', title: 'Bestellung 2. Hygiene-Box', category: 'Hygiene', description: 'Nach dem erfolgreichen Start ordern wir eine zweite Box für eine weitere Etage.' },
  { start: '2025-12-05', displayDate: 'Dezember', title: 'Hygiene-Artikel & 1. Schulkonferenz', category: 'Hygiene', description: 'Weitere Box bestellt, Hygiene-Artikel wieder kostenlos verfügbar. Zudem setzen wir den Schulkonferenz-Antrag zur schnellen Protokoll-Veröffentlichung um.' },
  { start: '2025-12-10', displayDate: 'Dezember', title: 'Upload LK Materialpool', category: 'LK', description: 'Materialien zur Leistungskurswahl plus Notenrechner für die Schüler:innen.' },
  { start: '2025-12-12', displayDate: 'Dezember', title: 'Schachturnier', category: 'Event', description: 'Turnier für die Klassen 5 bis 7 – alle Partien auf dem Pausenhof-Festivalplan.' },
  { start: '2025-12-17', title: '2. GSV', category: 'GSV', description: 'Rückblick auf erste Maßnahmen und Planung weiterer Projekte.' },
  { start: '2026-02-10', displayDate: 'Februar 2026', title: 'Zwischenumfrage zur Arbeit der SV', category: 'Feedback', description: 'Kurze Umfrage zu Transparenz, Mitbestimmung und welche Projekte wir priorisieren sollen.' },
  { start: '2026-06-20', displayDate: 'Juni/Juli 2026', title: 'Fußballspiel', category: 'Sport', description:'Geplantes Fußballspiel für mehrere Jahrgänge. Genauer Termin folgt.' },
];

const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const formatDate = (event) => {
  if(event.displayDate){
    return event.displayDate;
  }
  if(event.startDate.getTime() !== event.endDate.getTime()){
    const startLabel = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(event.startDate);
    const endLabel = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(event.endDate);
    return `${startLabel} – ${endLabel}`;
  }
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(event.startDate);
};

const scroller = document.querySelector('[data-timeline-scroller]');
const trackPast = document.querySelector('[data-track-past]');
const trackFuture = document.querySelector('[data-track-future]');
const todayMarker = document.querySelector('[data-today-marker]');
const eventsHost = document.querySelector('[data-timeline-events]');

if(eventsHost && scroller && trackPast && trackFuture && todayMarker){
  const today = normalizeDate(new Date());

  const parsedEvents = timelineEvents
    .map((event) => {
      const startDate = normalizeDate(event.start);
      const endDate = normalizeDate(event.end ?? event.start);
      const midpoint = new Date((startDate.getTime() + endDate.getTime()) / 2);
      const isCurrent = today >= startDate && today <= endDate;
      const isPast = today > endDate;
      return {
        ...event,
        startDate,
        endDate,
        midpoint,
        status: isPast ? 'past' : isCurrent ? 'current' : 'future',
      };
    })
    .sort((a, b) => a.startDate - b.startDate);

  parsedEvents.forEach((event) => {
    const card = document.createElement('article');
    card.className = `timeline-card ${event.status}`;
    card.innerHTML = `
      <p class="timeline-date">${formatDate(event)}</p>
      <h3 class="timeline-title">${event.title}</h3>
      <p class="timeline-desc">${event.description}</p>
      <span class="timeline-tag" aria-hidden="true">${event.category}</span>
    `;
    eventsHost.appendChild(card);
  });

  const startTimes = parsedEvents.map((event) => event.startDate.getTime());
  const endTimes = parsedEvents.map((event) => event.endDate.getTime());
  const minDate = new Date(Math.min(...startTimes));
  const maxDate = new Date(Math.max(...endTimes));

  const currentEvent = parsedEvents.find((event) => event.status === 'current');

  let referenceDate;

  if(currentEvent){
    referenceDate = currentEvent.midpoint;
  } else if(today < minDate){
    referenceDate = minDate;
  } else if(today > maxDate){
    referenceDate = maxDate;
  } else {
    referenceDate = today;
  }

  const range = Math.max(maxDate - minDate, 1);
  const percent = Math.min(Math.max(((referenceDate - minDate) / range) * 100, 0), 100);

  trackPast.style.width = `${percent}%`;
  trackFuture.style.width = `${100 - percent}%`;
  trackFuture.style.left = `${percent}%`;
  todayMarker.style.left = `${percent}%`;
  const todayLabel = todayMarker.querySelector('.today-label');
  if(todayLabel){
    todayLabel.textContent = 'Heute';
  }
}

// Goal overlay handling
const overlay = document.querySelector('[data-goal-overlay]');
const overlayBody = overlay?.querySelector('.goal-overlay__body');
const goalTemplates = new Map();
let lastTrigger = null;

document.querySelectorAll('template[data-goal-template]').forEach((template) => {
  const key = template.dataset.goalTemplate;
  if(key){
    goalTemplates.set(key, template);
  }
});

const openGoal = (goal) => {
  if(!overlay || !overlayBody){
    return;
  }
  const template = goalTemplates.get(goal);
  if(!template){
    return;
  }
  overlayBody.innerHTML = '';
  overlayBody.appendChild(template.content.cloneNode(true));
  const heading = overlayBody.querySelector('h2');
  if(heading){
    heading.id = 'goal-overlay-title';
  }
  overlay.removeAttribute('hidden');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.setProperty('overflow', 'hidden');
  overlay.querySelector('[data-overlay-close]')?.focus();
};

const closeGoal = () => {
  if(!overlay || !overlayBody){
    return;
  }
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('hidden', '');
  overlayBody.innerHTML = '';
  document.body.style.removeProperty('overflow');
  if(lastTrigger && typeof lastTrigger.focus === 'function'){
    lastTrigger.focus();
  }
  lastTrigger = null;
};

const goalTriggers = document.querySelectorAll('[data-goal]');
goalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    if(navLinks && navLinks.classList.contains('is-open')){
      navLinks.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
    lastTrigger = trigger;
    openGoal(trigger.dataset.goal);
  });
});

if(overlay){
  overlay.addEventListener('click', (event) => {
    if(event.target === overlay || event.target.hasAttribute('data-overlay-close')){
      closeGoal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape' && overlay && overlay.getAttribute('aria-hidden') === 'false'){
    closeGoal();
  }
});

// Dummy form submission: clear form and show confirmation
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.reset();
    alert('Danke! Dein Formular wurde abgeschickt.');
  });
});

// Inaktivität: nach 40s zurück zur Startseite
const idleRedirectDelay = 40000;
let idleTimer = null;

const redirectHome = () => {
  window.location.href = 'index.html';
};

const resetIdleTimer = () => {
  if(idleTimer){
    clearTimeout(idleTimer);
  }
  idleTimer = setTimeout(redirectHome, idleRedirectDelay);
};

['scroll', 'mousemove', 'keydown', 'touchstart'].forEach((evt) => {
  window.addEventListener(evt, resetIdleTimer, { passive: true });
});

resetIdleTimer();
