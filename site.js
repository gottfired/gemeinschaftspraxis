/* Gemeinsames Skript für alle Seiten der Praxis am Mühlbach.
   Lädt therapists.json und rendert daraus Navigation, Hero, Karten
   (bzw. Sektions-Übersicht auf der Startseite) und Footer.
   Sektionsseiten tragen am <body> ein data-section-Attribut. */
(function () {
  'use strict';

  const cardsContainer = document.getElementById('cards');
  const navContainer = document.getElementById('section-nav');
  // Ohne data-section am <body> handelt es sich um die Startseite (Übersicht).
  const currentSection = document.body.dataset.section || null;

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  function showNote(text) {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'loading-note';
    p.textContent = text;
    cardsContainer.appendChild(p);
  }

  // ---- Burger-Menü (nur mobil sichtbar) ----
  const navToggle = document.createElement('button');
  navToggle.type = 'button';
  navToggle.className = 'nav-toggle';
  navToggle.setAttribute('aria-label', 'Menü öffnen');
  navToggle.setAttribute('aria-controls', 'section-nav');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(navToggle);

  function setMenu(open) {
    if (!navContainer) return;
    const navWrap = navContainer.parentElement; // .section-nav-wrap (Dim + Panel)
    if (navWrap) navWrap.classList.toggle('open', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }

  if (navContainer) {
    const navWrap = navContainer.parentElement;
    navToggle.addEventListener('click', () => setMenu(!navWrap.classList.contains('open')));
    // Klick auf die Dim-Fläche (außerhalb des Panels) schließt das Menü
    navWrap.addEventListener('click', (e) => {
      if (!e.target.closest('.section-nav')) setMenu(false);
    });
    navContainer.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  function renderNav(sections) {
    if (!navContainer) return;
    navContainer.innerHTML = '';

    const home = document.createElement('a');
    home.href = 'index.html';
    home.textContent = 'Startseite';
    if (!currentSection) {
      home.setAttribute('aria-current', 'page');
      home.classList.add('active');
    }
    navContainer.appendChild(home);

    (sections || []).forEach((s) => {
      const a = document.createElement('a');
      a.href = s.file;
      a.textContent = s.title;
      if (s.id === currentSection) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('active');
      }
      navContainer.appendChild(a);
    });
  }

  function renderHero(practice, sections) {
    const logo = document.getElementById('practice-logo');
    if (logo && practice.logo) {
      logo.src = practice.logo;
      logo.alt = 'Logo ' + (practice.name || 'der Praxis');
    }

    const tagline = document.getElementById('practice-tagline');
    if (tagline) tagline.textContent = practice.tagline || '';

    const title = document.getElementById('practice-title');
    const intro = document.getElementById('practice-intro');

    if (currentSection) {
      const section = (sections || []).find((s) => s.id === currentSection);
      const sectionTitle = section ? section.title : currentSection;
      if (title) title.textContent = sectionTitle;
      if (intro) {
        if (section && section.description) {
          intro.textContent = section.description;
          intro.style.display = '';
        } else {
          intro.style.display = 'none';
        }
      }
      document.title = sectionTitle + ' – ' + (practice.name || 'Praxis am Mühlbach');
    } else {
      if (title) title.textContent = practice.name || 'Praxis am Mühlbach';
      if (intro) intro.textContent = practice.intro || '';
      document.title = (practice.name || 'Praxis am Mühlbach') + ' – Gemeinschaftspraxis';
    }
  }

  function renderFooter(practice, therapists) {
    const footerName = document.getElementById('footer-name');
    if (footerName) footerName.textContent = practice.name || 'Praxis am Mühlbach';

    const footerLinks = document.getElementById('footer-links');
    if (!footerLinks) return;
    footerLinks.innerHTML = '';
    (therapists || [])
      .filter((t) => (t.url || '').trim())
      .forEach((t, i) => {
        if (i > 0) {
          const sep = document.createElement('span');
          sep.className = 'sep';
          sep.textContent = ' · ';
          sep.setAttribute('aria-hidden', 'true');
          footerLinks.appendChild(sep);
        }
        const a = document.createElement('a');
        a.href = t.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = t['page-title'] || t.url;
        footerLinks.appendChild(a);
      });
  }

  function cardMarkup(t) {
    const hasUrl = Boolean((t.url || '').trim());
    const portrait = t['practitioner-portrait'] || '';
    return `
      <div class="photo">
        ${portrait ? `<img src="${escapeHtml(portrait)}" alt="Porträt von ${escapeHtml(t['practitioner-name'])}" loading="lazy" decoding="async">` : ''}
        <div class="accent"></div>
      </div>
      <div class="body">
        <div class="site-logo">
          ${t.logo ? `<img class="icon" src="${escapeHtml(t.logo)}" alt="Logo ${escapeHtml(t['page-title'])}">` : ''}
          <div class="site-text">
            <strong>${escapeHtml(t['page-title'])}</strong>
            <span>${escapeHtml(t['page-subtitle'])}</span>
          </div>
        </div>
        <h2>${escapeHtml(t['practitioner-name'])}</h2>
        <div class="role">${escapeHtml(t.subtitle)}</div>
        <p>${escapeHtml(t.text)}</p>
        ${hasUrl ? `<span class="cta">Zur Webseite
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
        </span>` : ''}
      </div>`;
  }

  function renderCards(therapists) {
    if (!therapists || therapists.length === 0) {
      showNote('In diesem Bereich gibt es derzeit keine Einträge.');
      return;
    }
    cardsContainer.innerHTML = '';
    therapists.forEach((t) => {
      const hasUrl = Boolean((t.url || '').trim());
      const card = document.createElement(hasUrl ? 'a' : 'div');
      card.className = hasUrl ? 'card' : 'card no-link';
      if (hasUrl) {
        card.href = t.url;
        card.target = '_blank';
        card.rel = 'noopener';
      }
      card.innerHTML = cardMarkup(t);
      cardsContainer.appendChild(card);
    });
  }

  function renderOverview(sections, therapists) {
    if (!sections || sections.length === 0) {
      showNote('Keine Bereiche konfiguriert.');
      return;
    }
    cardsContainer.innerHTML = '';
    sections.forEach((s) => {
      const members = (therapists || []).filter((t) => t.section === s.id);
      const card = document.createElement('a');
      card.className = 'card section-card';
      card.href = s.file;
      card.innerHTML = `
        <div class="body">
          <h2>${escapeHtml(s.title)}</h2>
          ${s.description ? `<p class="section-description">${escapeHtml(s.description)}</p>` : ''}
          ${members.length ? `<p class="section-names">${members.map((m) => escapeHtml(m['practitioner-name'])).join(' · ')}</p>` : ''}
          <span class="cta">Zum Bereich
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
          </span>
        </div>`;
      cardsContainer.appendChild(card);
    });
  }

  function render(data) {
    const practice = data.practice || {};
    const sections = data.sections || [];
    const therapists = data.therapists || [];

    renderNav(sections);
    renderHero(practice, sections);
    renderFooter(practice, therapists);

    if (currentSection) {
      renderCards(therapists.filter((t) => t.section === currentSection));
    } else {
      renderOverview(sections, therapists);
    }
  }

  fetch('therapists.json')
    .then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(render)
    .catch(() => {
      showNote('Die Inhalte konnten nicht geladen werden. Bitte öffnen Sie die Seite über einen lokalen Webserver (z. B. „python3 -m http.server“) und laden Sie sie neu.');
    });
})();
