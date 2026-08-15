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
    home.textContent = 'Willkommen';
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
    const email = (t.email || '').trim();
    const phone = (t.phone || '').trim();
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
        ${(email || phone) ? `<div class="contact">
          ${email ? `<a class="contact-item" href="mailto:${escapeHtml(email)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
            ${escapeHtml(email)}
          </a>` : ''}
          ${phone ? `<a class="contact-item" href="tel:${escapeHtml(phone.replace(/[^+\d]/g, ''))}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${escapeHtml(phone)}
          </a>` : ''}
        </div>` : ''}
        ${hasUrl ? `<a class="cta" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">Zur Webseite
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
        </a>` : ''}
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
      // Karte als <div>: enthält eigene Links (E-Mail, Telefon, Webseite),
      // verschachtelte <a> wären ungültiges HTML.
      const card = document.createElement('div');
      card.className = hasUrl ? 'card' : 'card no-link';
      card.innerHTML = cardMarkup(t);
      cardsContainer.appendChild(card);
    });
  }

  // ---- Startseite: Willkommen, Themen-Übersicht & Karte ----
  function renderTopics(sections) {
    const topics = document.getElementById('topics');
    if (!topics) return;
    topics.innerHTML = '';
    (sections || []).forEach((s) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = s.file;
      const strong = document.createElement('strong');
      strong.textContent = s.title;
      a.appendChild(strong);
      if (s.description) {
        const span = document.createElement('span');
        span.textContent = s.description;
        a.appendChild(span);
      }
      li.appendChild(a);
      topics.appendChild(li);
    });
  }

  function renderAddress(practice) {
    const address = practice.address || {};
    const addrEl = document.getElementById('practice-address');
    if (addrEl) {
      const lines = [address.street, address.city, address.country].filter(Boolean);
      addrEl.textContent = lines.join(', ');
    }
    // Google-Maps-Embed ohne API-Key (output=embed)
    const query = encodeURIComponent([address.street, address.city].filter(Boolean).join(', '));
    const frame = document.getElementById('map-frame');
    if (frame && query) {
      frame.src = 'https://www.google.com/maps?q=' + query + '&z=16&output=embed';
    }
    const link = document.getElementById('map-link');
    if (link && query) {
      link.href = 'https://www.google.com/maps?q=' + query;
    }
  }

  function renderHome(practice, sections) {
    const welcome = document.getElementById('welcome-text');
    if (welcome) welcome.textContent = practice.intro || '';
    renderTopics(sections);
    renderAddress(practice);
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
      renderHome(practice, sections);
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
