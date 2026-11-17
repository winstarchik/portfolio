/* Gemeinsame Bausteine für alle Henry's-Seiten: Icons, Kopf, Fuß, Menü, Toast */
(function () {
  const here = document.body.dataset.page; // start | karte | galerie | besuch
  const base = document.body.dataset.base;  // relativer Pfad zur Henry's-Startseite, z. B. "./" oder "../"
  const TEL = '+4961328991980', TEL_TXT = '06132 8991980';
  const ROUTE = 'https://www.google.com/maps/dir/?api=1&destination=Marktplatz%2010%2C%2055218%20Ingelheim%20am%20Rhein';
  window.HENRYS = { TEL, TEL_TXT, ROUTE };

  document.body.insertAdjacentHTML('afterbegin', `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
  <symbol id="i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="i-cup" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2"/></symbol>
  <symbol id="i-plate" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
  <symbol id="i-cake" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16c1.3 0 1.3-1 2.7-1s1.3 1 2.6 1 1.4-1 2.7-1 1.3 1 2.7 1 1.3-1 2.6-1 1.4 1 2.7 1M2 21h20M7 8v3M12 8v3M17 8v3"/></symbol>
  <symbol id="i-glass" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 3h14l-1.5 17a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2zM5.5 9h13"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
</svg>
<div class="concept" role="note"><div class="wrap"><span><b>Unabhängiger Designentwurf – keine offizielle Website</b> · Konzept für Henry's</span><a href="${base}../../#arbeiten">← Zurück zum Portfolio</a></div></div>
<header class="top"><div class="wrap">
  <a class="logo" href="${base}">Henry's<small>Café · Bistro · Ingelheim</small></a>
  <nav class="menu" id="menu" aria-label="Hauptnavigation">
    <a href="${base}" ${here === 'start' ? 'aria-current="page"' : ''}>Start</a>
    <a href="${base}karte/" ${here === 'karte' ? 'aria-current="page"' : ''}>Speisekarte</a>
    <a href="${base}galerie/" ${here === 'galerie' ? 'aria-current="page"' : ''}>Galerie</a>
    <a href="${base}besuch/" ${here === 'besuch' ? 'aria-current="page"' : ''}>Besuch &amp; Tisch</a>
  </nav>
  <div style="display:flex;gap:8px;align-items:center">
    <a class="call" href="tel:${TEL}"><svg aria-hidden="true"><use href="#i-phone"/></svg><span>${TEL_TXT}</span></a>
    <button class="burger" id="burger" aria-label="Menü öffnen" aria-expanded="false" aria-controls="menu"><svg aria-hidden="true"><use href="#i-menu"/></svg></button>
  </div>
</div></header>`);

  const footerHTML = `
<footer><div class="wrap">
  <div><h4>Henry's</h4>Café &amp; Bistro<br>Marktplatz 10 · 55218 Ingelheim am Rhein<br><a href="tel:${TEL}">${TEL_TXT}</a></div>
  <div><ul><li><a href="${base}">Start</a></li><li><a href="${base}karte/">Speisekarte</a></li><li><a href="${base}galerie/">Galerie</a></li><li><a href="${base}besuch/">Besuch &amp; Tisch</a></li></ul></div>
  <div><ul><li><a href="${ROUTE}" target="_blank" rel="noopener">Route planen</a></li><li><a href="${base}../haralds/">Nächstes Konzept: Harald's →</a></li><li><a href="${base}../../#arbeiten">Alle Arbeiten</a></li></ul></div>
  <div class="legal">Unabhängiger Designentwurf – keine offizielle Website von Henry's. Fotos: Beispielbilder (Unsplash). Impressum und Datenschutz würden hier verlinkt.</div>
</div></footer>
`;
  // Fuß erst einfügen, wenn der Seiteninhalt geladen ist (dieses Skript steht am Anfang von <body>)
  document.addEventListener('DOMContentLoaded', () => document.body.insertAdjacentHTML('beforeend', footerHTML));
  // Feste Elemente (Leiste unten, Toast) können sofort eingefügt werden – ihre Position ist fixiert
  document.body.insertAdjacentHTML('beforeend', `<nav class="dock" aria-label="Schnellaktionen"><a href="tel:${TEL}"><svg aria-hidden="true"><use href="#i-phone"/></svg>Anrufen</a><a href="${ROUTE}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-pin"/></svg>Route</a></nav><div class="toast" id="toast" role="status"></div>`);

  const burger = document.getElementById('burger'), menu = document.getElementById('menu');
  burger.onclick = () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    burger.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  };

  const toast = document.getElementById('toast');
  window.say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 2200); };
  window.copyText = async (t, ok) => {
    try { await navigator.clipboard.writeText(t); say(ok); }
    catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); say(ok); } catch (_) { say('Kopieren nicht möglich'); } a.remove(); }
  };
})();
