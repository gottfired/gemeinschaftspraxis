#!/usr/bin/env node
/* ============================================================================
 * Build script for the Praxis am Mühlbach website
 * ----------------------------------------------------------------------------
 * Generates the finished static site in the build/ folder:
 *
 *   - Templates:  templates/*.html (page skeleton with <!-- BUILD:... --> markers)
 *   - Content:    therapists.json (practice, sections, therapists)
 *   - Command:    npm run build   (→ node build.js)
 *   - Output:     build/ – the deployable static site (HTML + all assets):
 *                 index.html, aerztinnen.html, psychotherapie.html,
 *                 klinische-psychologie.html, gruppenkurse.html, impressum.html,
 *                 style.css, CNAME and all images (logos, portraits, logo.jpg).
 *
 * build/ is wiped and rebuilt on every run, so it always contains exactly the
 * current site. Deploy that folder as-is (e.g. copy its contents to the web
 * root of your host).
 *
 * The generated pages contain all content directly in the HTML – there is no
 * site.js and no fetch() anymore. Loading the content can therefore no longer
 * depend on the network, the cache, or the browser (no loading indicator).
 *
 * Workflow after editing therapists.json or a template:
 *
 *     npm run build
 *     git add -A && git commit -m "..." && git push
 *
 * The script fails with an error if a template is missing markers or unknown
 * markers are left over – so an empty page can never be silently produced.
 * ========================================================================== */
'use strict';

// Only Node standard library – no external dependencies,
// so no `npm install` is required.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname); // Repo root (where package.json lives)
const TEMPLATES = path.join(ROOT, 'templates'); // Folder containing the templates
const BUILD = path.join(ROOT, 'docs'); // Deployable static site (wiped & rebuilt on every run)

// Files copied into build/ unchanged (not generated from templates).
const STATIC_FILES = ['style.css', 'CNAME', 'impressum.html'];

// Single source of truth: all website content comes from this one file.
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'therapists.json'), 'utf8'));
const practice = data.practice || {}; // Name, tagline, logo, address, intro
const sections = data.sections || []; // The four areas (Ärztinnen, Psychotherapie, …)
const therapists = data.therapists || []; // All cards (therapists / offerings)

/* ----------------------------------------------------------------------------
 * Inline SVG icons (email, phone, arrow).
 * The same markup as in the former site.js – only generated at build time
 * instead of at runtime. aria-hidden because the label sits next to it.
 * -------------------------------------------------------------------------- */
const SVG_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`;

const SVG_PHONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

const SVG_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`;

/* ----------------------------------------------------------------------------
 * Burger menu for mobile devices.
 * build.js injects it into every page right before </body>. Deliberately the
 * ONLY remaining JavaScript: it just opens/closes the navigation and never
 * holds back content (no loading indicator possible).
 * -------------------------------------------------------------------------- */
const MENU_SCRIPT = `<button type="button" class="nav-toggle" aria-label="Menü öffnen" aria-controls="section-nav" aria-expanded="false"><span></span><span></span><span></span></button>
<script>
(function () {
  'use strict';
  var nav = document.getElementById('section-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  var wrap = nav.parentElement; // .section-nav-wrap (dim layer + panel)
  function setMenu(open) {
    if (wrap) wrap.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }
  toggle.addEventListener('click', function () {
    // Enable the drawer transitions: the CSS gates them behind .menu-ready on
    // <html>, so resizing across the mobile breakpoint (which changes the
    // drawer's transform/opacity) never animates it sliding/fading away – only
    // real open/close toggles animate.
    document.documentElement.classList.add('menu-ready');
    // Forced reflow. Without it, adding .menu-ready and toggling .open would be
    // batched into a single style recalc: the transition would be enabled at the
    // exact same instant the transform changes, so it would never start and the
    // first open would snap instead of sliding. Reading offsetWidth flushes the
    // class change first, so the transition is active when .open moves the drawer.
    void document.documentElement.offsetWidth;
    setMenu(!wrap.classList.contains('open'));
  });
  wrap.addEventListener('click', function (e) { if (!e.target.closest('.section-nav')) setMenu(false); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
})();
</script>`;

/* ----------------------------------------------------------------------------
 * esc(value) – HTML-escaping for all content coming from therapists.json.
 * Equivalent to the escapeHtml function from the former site.js: &, <, >, "
 * and ' are replaced so content can never be interpreted as markup
 * (protection against broken layout and HTML injection).
 * -------------------------------------------------------------------------- */
function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

/* Returns the section object (title, file, description) for an id
 * (e.g. "aerztinnen"), or null if the id does not exist. */
function sectionById(id) {
  return sections.find((s) => s.id === id) || null;
}

/* ----------------------------------------------------------------------------
 * renderNav(current) – main navigation (pills below the hero).
 * current is the id of the active section, or null on the home page.
 * The active page gets class="active" and aria-current="page".
 * -------------------------------------------------------------------------- */
function renderNav(current) {
  const out = [];
  if (current === null) {
    out.push('<a href="index.html" class="active" aria-current="page">Willkommen</a>');
  } else {
    out.push('<a href="index.html">Willkommen</a>');
  }
  for (const s of sections) {
    const attrs = s.id === current ? ' class="active" aria-current="page"' : '';
    out.push('<a href="' + esc(s.file) + '"' + attrs + '>' + esc(s.title) + '</a>');
  }
  return out.join('\n      ');
}

/* ----------------------------------------------------------------------------
 * renderTopics() – home page: topic list ("Willkommen" area).
 * One entry per section: title (strong) + description (span), linked to the
 * respective subpage.
 * -------------------------------------------------------------------------- */
function renderTopics() {
  return sections
    .map((s) => {
      const inner = ['<strong>' + esc(s.title) + '</strong>'];
      if (s.description) inner.push('<span>' + esc(s.description) + '</span>');
      return '<li><a href="' + esc(s.file) + '">' + inner.join('') + '</a></li>';
    })
    .join('\n      ');
}

/* ----------------------------------------------------------------------------
 * renderFooterLinks() – footer: links to the external websites of all
 * therapists that have a url in therapists.json (separated by " · ").
 * -------------------------------------------------------------------------- */
function renderFooterLinks() {
  const linked = therapists.filter((t) => (t.url || '').trim());
  const out = [];
  linked.forEach((t, i) => {
    if (i > 0) out.push('<span class="sep" aria-hidden="true"> · </span>');
    const label = t['page-title'] || t.url; // page name, otherwise the URL itself
    out.push(
      '<a href="' + esc(t.url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>'
    );
  });
  return out.join('\n      ');
}

/* ----------------------------------------------------------------------------
 * cardBody(t) – HTML of a single card (content between <div class="card">).
 * Equivalent to the cardMarkup function from the former site.js:
 * portrait, practice logo, name/role, description, contact (email, phone)
 * and – if present – a link to the website.
 * -------------------------------------------------------------------------- */
function cardBody(t) {
  const hasUrl = Boolean((t.url || '').trim());
  const portrait = t['practitioner-portrait'] || '';
  const email = (t.email || '').trim();
  const phone = (t.phone || '').trim();
  // "tel:" hrefs may only contain digits and one leading "+".
  const tel = phone ? phone.replace(/[^+\d]/g, '') : '';
  return `
      <div class="photo">
        ${portrait ? `<img src="${esc(portrait)}" alt="Porträt von ${esc(t['practitioner-name'])}" loading="lazy" decoding="async">` : ''}
        <div class="accent"></div>
      </div>
      <div class="body">
        <div class="site-logo">
          ${t.logo ? `<img class="icon" src="${esc(t.logo)}" alt="Logo ${esc(t['page-title'])}">` : ''}
          <div class="site-text">
            <strong>${esc(t['page-title'])}</strong>
            <span>${esc(t['page-subtitle'] || '')}</span>
          </div>
        </div>
        <h2>${esc(t['practitioner-name'])}</h2>
        <div class="role">${esc(t.subtitle || '')}</div>
        <p>${esc(t.text || '')}</p>
        ${email || phone ? `<div class="contact">
          ${email ? `<a class="contact-item" href="mailto:${esc(email)}">
            ${SVG_MAIL}
            ${esc(email)}
          </a>` : ''}
          ${phone ? `<a class="contact-item" href="tel:${esc(tel)}">
            ${SVG_PHONE}
            ${esc(phone)}
          </a>` : ''}
        </div>` : ''}
        ${hasUrl ? `<a class="cta" href="${esc(t.url)}" target="_blank" rel="noopener">Zur Webseite
          ${SVG_ARROW}
        </a>` : ''}
      </div>`;
}

/* ----------------------------------------------------------------------------
 * renderCards(cards) – cards of a section, each wrapped in <div class="card">.
 * Without a url the class "card no-link" is set (card does not feel like a
 * link; its own links such as email still work).
 * -------------------------------------------------------------------------- */
function renderCards(cards) {
  const out = [];
  for (const t of cards) {
    const cls = (t.url || '').trim() ? 'card' : 'card no-link';
    out.push('    <div class="' + cls + '">');
    out.push(cardBody(t));
    out.push('    </div>');
  }
  return out.join('\n');
}

/* Address as plain text for the <address> element (street, city, country). */
function renderAddress() {
  const a = practice.address || {};
  const lines = [a.street, a.city, a.country].filter(Boolean);
  return esc(lines.join(', '));
}

/* ----------------------------------------------------------------------------
 * mapQuery() – URL-encoded search term (street, city) for Google Maps.
 * encodeURIComponent matches the behavior of the former site.js.
 * -------------------------------------------------------------------------- */
function mapQuery() {
  const a = practice.address || {};
  const q = [a.street, a.city].filter(Boolean).join(', ');
  return encodeURIComponent(q);
}

/* ----------------------------------------------------------------------------
 * referencedAssets() – every image referenced by the content (practice logo,
 * portraits, practice logos). build/ must contain them, otherwise the deployed
 * site would show broken images.
 * -------------------------------------------------------------------------- */
function referencedAssets() {
  const files = new Set();
  if (practice.logo) files.add(practice.logo);
  for (const t of therapists) {
    if (t['practitioner-portrait']) files.add(t['practitioner-portrait']);
    if (t.logo) files.add(t.logo);
  }
  return [...files].filter(Boolean);
}

/* copyFile(src, dest) – copies one file, creating the destination folder. */
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('copied: ' + path.relative(BUILD, dest));
}

/* ----------------------------------------------------------------------------
 * resetBuild() – empties the build folder so no stale files survive a rebuild.
 * -------------------------------------------------------------------------- */
function resetBuild() {
  fs.rmSync(BUILD, { recursive: true, force: true });
  fs.mkdirSync(BUILD, { recursive: true });
}

/* ----------------------------------------------------------------------------
 * copyStatic() – copies style.css, CNAME, impressum.html and all images
 * referenced in therapists.json into build/ (preserving folder structure).
 * Fails loudly if a referenced file is missing, same as with templates.
 * -------------------------------------------------------------------------- */
function copyStatic() {
  for (const file of STATIC_FILES) {
    const src = path.join(ROOT, file);
    if (!fs.existsSync(src)) throw new Error('Required static file is missing: ' + file);
    copyFile(src, path.join(BUILD, file));
  }
  for (const asset of referencedAssets()) {
    const src = path.join(ROOT, asset);
    if (!fs.existsSync(src)) {
      throw new Error('Asset referenced in therapists.json is missing: ' + asset);
    }
    copyFile(src, path.join(BUILD, asset));
  }
}

/* ----------------------------------------------------------------------------
 * buildPage(templatePath, outPath) – fills ONE template and writes the result
 * to outPath (the build folder). Steps:
 *
 *   1. Detect the section from data-section on the <body> (null = home page).
 *   2. Replace all <!-- BUILD:... --> markers with generated HTML.
 *   3. Inject the burger menu before </body>, prepend the generated header.
 *   4. Throw an error if markers are missing or left over (nothing silently
 *      overlooked, no empty pages).
 * -------------------------------------------------------------------------- */
function buildPage(templatePath, outPath) {
  let template = fs.readFileSync(templatePath, 'utf8');

  // Read the section from the data-section attribute of the <body>.
  const match = template.match(/data-section="([^"]+)"/);
  const current = match ? match[1] : null;
  const section = current ? sectionById(current) : null;

  // Markers replaced on EVERY page (nav, footer, hero, logo).
  const replacements = {
    'logo-src': practice.logo || 'images/logo.jpg',
    'logo-alt': 'Logo ' + (practice.name || 'der Praxis'),
    tagline: practice.tagline || '',
    'footer-name': practice.name || '',
    'footer-links': renderFooterLinks(),
    nav: renderNav(current),
  };

  if (current) {
    // ---- Subpage (e.g. aerztinnen.html) -------------------------------------
    const title = section ? section.title : current;
    replacements['document-title'] = title + ' – ' + (practice.name || '');
    replacements.h1 = title;
    replacements.intro = (section ? section.description : undefined) || '';
    // Only the cards of this section; a friendly note if the section is empty.
    const sectionCards = therapists.filter((t) => t.section === current);
    replacements.cards = sectionCards.length
      ? renderCards(sectionCards)
      : '<p class="loading-note">In diesem Bereich gibt es derzeit keine Einträge.</p>';
  } else {
    // ---- Home page (index.html) ----------------------------------------------
    replacements['document-title'] = (practice.name || '') + ' – Gemeinschaftspraxis';
    replacements.h1 = practice.name || '';
    replacements['welcome-text'] = practice.intro || '';
    replacements.topics = renderTopics();
    replacements.address = renderAddress();
    replacements['map-link'] = 'https://www.google.com/maps?q=' + mapQuery();
    replacements['map-src'] = 'https://www.google.com/maps?q=' + mapQuery() + '&z=16&output=embed';
  }

  // Replace the markers. split/join instead of String.replace: content from
  // the JSON could contain "$" patterns that replace would interpret as regex
  // special characters – split/join always replaces literally.
  for (const [key, value] of Object.entries(replacements)) {
    const marker = '<!-- BUILD:' + key + ' -->';
    if (!template.includes(marker)) {
      throw new Error('Marker ' + marker + ' is missing in ' + path.basename(templatePath));
    }
    template = template.split(marker).join(value);
  }

  // Safety net: do not leave any unknown markers behind.
  const leftover = template.match(/<!-- BUILD:\w+ -->/g);
  if (leftover) {
    throw new Error(
      'Unknown markers in ' + path.basename(templatePath) + ': ' + leftover.join(', ')
    );
  }

  // Inject the burger menu as the last element before </body>.
  template = template.replace('</body>', MENU_SCRIPT + '\n</body>');

  // Note in the generated HTML so nobody edits the output by hand.
  const header =
    '<!-- This page is generated by build.js from templates/ and therapists.json. Do not edit by hand. -->\n';
  fs.writeFileSync(outPath, header + template, 'utf8');
  console.log('generated: ' + path.basename(outPath));
}

/* ----------------------------------------------------------------------------
 * main() – resets build/, copies the static assets, then processes all
 * templates in templates/ (sorted alphabetically) and writes one generated
 * page per template into build/.
 * -------------------------------------------------------------------------- */
function main() {
  resetBuild();
  copyStatic();
  const names = fs
    .readdirSync(TEMPLATES)
    .filter((n) => n.endsWith('.html'))
    .sort();
  for (const name of names) {
    buildPage(path.join(TEMPLATES, name), path.join(BUILD, name));
  }
  console.log('\nSite ready in ' + path.relative(ROOT, BUILD) + '/');
}

main();
