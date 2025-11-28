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
  { date: '2025-09-15', title: 'GSV-Sitzung 1', category: 'GSV', status: 'past', description: 'Auftakt der Gesamtschülervertretung, Sammeln eurer Themen für das Schuljahr.' },
  { date: '2025-10-10', title: 'Hygieneartikel-Pilot', category: 'Hygiene', status: 'past', description: 'Erste Box im Oberstufenflur getestet und mit dem Sozialteam ausgewertet.' },
  { date: '2025-11-10', title: 'Start: Kostenlose Hygieneartikel', category: 'Hygiene', status: 'past', description: 'Seit dem 10. November stehen auf den Mädchentoiletten kostenlose Hygieneartikel bereit. Wir starten mit Testboxen, um zu sehen, was ihr wirklich braucht.' },
  { date: '2025-11-14', title: 'YOLO-Party', category: 'Event', status: 'past', description: 'Gemeinsam mit dem Stadtteilzentrum Kladow – großer Dank an alle Helferinnen und Helfer!' },
  { date: '2025-11-20', title: 'Video über die Gremien an unserer Schule', category: 'Transparenz', status: 'past', description: 'Erklärvideo zu GSV, Schulkonferenz und weiteren Gremien, damit alle wissen, wer wofür zuständig ist.' },
  { date: '2025-12-05', title: 'Neue Hygiene-Boxen planen', category: 'Hygiene', status: 'future', description: 'Planung für mehr Boxen und Standorte im Dezember, damit alle Etagen versorgt sind.' },
  { date: '2025-12-12', title: 'Winterturnier', category: 'Sport', status: 'future', description: 'Basketball- und Volleyball-Turnier mit Feedbackrunde für faire Regeln.' },
  { date: '2025-12-17', title: '2. GSV-Sitzung', category: 'GSV', status: 'future', description: 'Rückblick auf erste Maßnahmen und Planung weiterer Projekte.' },
  { date: '2026-01-15', displayDate: 'Januar 2026', title: 'LK-Infomarkt', category: 'LK', status: 'future', description: 'Materialpool und Erfahrungsberichte zur Wahl der Leistungskurse.' },
  { date: '2026-03-08', title: 'Hygieneartikel-Rollout', category: 'Hygiene', status: 'future', description: 'Boxen auf allen Etagen auffüllen, Feedback sammeln und nachsteuern.' },
  { date: '2026-04-20', title: 'Frühjahrs-Sportfest', category: 'Sport', status: 'future', description: 'Mixed-Teams, faire Spielpläne und eine offene Wunschliste für Disziplinen.' },
  { date: '2026-06-20', displayDate: 'Juni/Juli 2026', title: 'Fußballturnier', category: 'Sport', status: 'future', description: 'Geplantes Fußballturnier für mehrere Jahrgänge. Genauer Termin folgt.' },
  { date: '2026-09-10', displayDate: 'September 2026', title: 'Sommerfest', category: 'Event', status: 'future', description: 'Großes Sommerfest mit Bühne, Ständen und Programm. Details folgen.' },
];

const formatDate = (event) => event.displayDate ?? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(new Date(event.dateObj));

const scroller = document.querySelector('[data-timeline-scroller]');
const trackPast = document.querySelector('[data-track-past]');
const trackFuture = document.querySelector('[data-track-future]');
const todayMarker = document.querySelector('[data-today-marker]');
const eventsHost = document.querySelector('[data-timeline-events]');

if(eventsHost && scroller && trackPast && trackFuture && todayMarker){
  const parsedEvents = timelineEvents
    .map((event) => ({ ...event, dateObj: new Date(event.date) }))
    .sort((a, b) => a.dateObj - b.dateObj);

  parsedEvents.forEach((event) => {
    const card = document.createElement('article');
    card.className = `timeline-card ${event.status}`;
    card.innerHTML = `
      <p class="timeline-date">${formatDate(event)}</p>
      <h3 class="timeline-title">${event.title}</h3>
      <p class="timeline-desc">${event.description}</p>
      <p class="news-meta" aria-hidden="true" style="margin-top:6px">${event.category}</p>
    `;
    eventsHost.appendChild(card);
  });

  const dates = parsedEvents.map((event) => event.dateObj.getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const now = new Date();
  const pastDates = parsedEvents.filter((e) => e.status === 'past').map((e) => e.dateObj);
  const futureDates = parsedEvents.filter((e) => e.status !== 'past').map((e) => e.dateObj);

  let todayReference = now;
  if(now < minDate || now > maxDate){
    if(pastDates.length && futureDates.length){
      todayReference = new Date((pastDates[pastDates.length - 1].getTime() + futureDates[0].getTime()) / 2);
    } else {
      todayReference = minDate;
    }
  }

  const range = Math.max(maxDate - minDate, 1);
  const percent = Math.min(Math.max(((todayReference - minDate) / range) * 100, 0), 100);

  trackPast.style.width = `${percent}%`;
  trackFuture.style.width = `${100 - percent}%`;
  trackFuture.style.left = `${percent}%`;
  todayMarker.style.left = `calc(${percent}% - 4px)`;
  todayMarker.querySelector('span').textContent = 'Heute';

  const scrollByAmount = () => scroller.clientWidth - 100;
  document.querySelectorAll('[data-timeline-nav="next"]').forEach((btn) => btn.addEventListener('click', () => scroller.scrollBy({ left: scrollByAmount(), behavior: 'smooth' })));
  document.querySelectorAll('[data-timeline-nav="prev"]').forEach((btn) => btn.addEventListener('click', () => scroller.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' })));
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
