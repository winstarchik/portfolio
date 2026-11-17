/* Gemeinsame Bausteine für alle Harald's-Seiten */
(function () {
  const here = document.body.dataset.page, base = document.body.dataset.base;
  const TEL = '+496721921199', TEL_TXT = '06721 921199', MAIL = 'info@haralds-haarwerkstatt.de';
  const ROUTE = 'https://www.google.com/maps/dir/?api=1&destination=Schmittstra%C3%9Fe%2053%2C%2055411%20Bingen%20am%20Rhein';
  const SVC = [
    ['Schneiden & Stylen', 'Beratung, Schnitt und Styling – für Damen und Herren.', 'Ob nur die Spitzen oder ein komplett neuer Look: Hier würde der Salon beschreiben, wie ein Termin abläuft und was dazugehört.'],
    ['Farbe & Strähnen', 'Von dezenten Akzenten bis zur kompletten Typveränderung.', 'Platz für Farbtechniken, Pflege nach dem Färben und Hinweise zur Vorbereitung.'],
    ['Make-up & Beratung', 'Make-up für Anlässe oder Tipps für den Alltag.', 'Hier könnte stehen, für welche Anlässe Make-up angeboten wird – und wie man einen Termin dafür vereinbart.'],
    ['Wimpern & Brauen', 'Form und Ausdruck für den Blick.', 'Platz für Behandlungen rund um Wimpern und Augenbrauen.'],
    ['Hochsteckfrisuren', 'Für Hochzeiten, Feiern und besondere Tage.', 'Ideal für eine eigene Seite mit Fotos und Hinweisen zum Probetermin.'],
    ['Pflege & Beratung', 'Was Ihr Haar braucht – und was nicht.', 'Hier würden Pflegeprodukte oder Beratungsangebote vorgestellt.']
  ];
  /* Auswahl der Leistungen – seitenübergreifend im Browser gemerkt (nur für diese Sitzung) */
  let mem = [];
  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem('hh_svc') || '[]'); } catch (e) { return mem; } },
    set(a) { mem = a; try { sessionStorage.setItem('hh_svc', JSON.stringify(a)); } catch (e) {} }
  };
  window.HH = { TEL, TEL_TXT, MAIL, ROUTE, SVC, store };

  document.body.insertAdjacentHTML('afterbegin', `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2.2"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="m22 6-10 7L2 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
</svg>
<div class="concept" role="note"><div class="wrap"><span><b>Unabhängiger Designentwurf – keine offizielle Website</b> · Konzept für Harald's Haarwerkstatt</span><a href="${base}../../#arbeiten">← Zurück zum Portfolio</a></div></div>
<header class="top"><div class="wrap">
  <a class="logo" href="${base}"><span class="mark" aria-hidden="true">H</span><span class="nm">Harald's Haarwerkstatt<small>Friseursalon · Bingen am Rhein</small></span></a>
  <nav class="menu" id="menu" aria-label="Hauptnavigation">
    ${[['start', '', 'Start'], ['leistungen', 'leistungen/', 'Leistungen'], ['termin', 'termin/', 'Termin'], ['galerie', 'galerie/', 'Galerie'], ['gutschein', 'gutschein/', 'Gutschein']]
      .map(([k, p, l]) => `<a href="${base}${p}"${here === k ? ' aria-current="page"' : ''}>${l}</a>`).join('')}
  </nav>
  <div style="display:flex;gap:8px;align-items:center">
    <a class="pill" href="tel:${TEL}"><svg aria-hidden="true"><use href="#i-phone"/></svg><span>${TEL_TXT}</span></a>
    <button class="burger" id="burger" aria-label="Menü öffnen" aria-expanded="false" aria-controls="menu"><svg aria-hidden="true"><use href="#i-menu"/></svg></button>
  </div>
</div></header>`);

  const footerHTML = `
<footer><div class="wrap">
  <div><h4>Harald's Haarwerkstatt</h4>Schmittstraße 53 · 55411 Bingen am Rhein<br><a href="tel:${TEL}">${TEL_TXT}</a> · <a href="mailto:${MAIL}">${MAIL}</a></div>
  <div><ul><li><a href="${base}">Start</a></li><li><a href="${base}leistungen/">Leistungen</a></li><li><a href="${base}termin/">Termin</a></li><li><a href="${base}galerie/">Galerie</a></li><li><a href="${base}gutschein/">Gutschein</a></li></ul></div>
  <div><ul><li><a href="${ROUTE}" target="_blank" rel="noopener">Route planen</a></li><li><a href="https://www.haralds-haarwerkstatt.de/" target="_blank" rel="noopener">Bestehende offizielle Website ↗</a></li><li><a href="${base}../henrys/">Nächstes Konzept: Henry's →</a></li><li><a href="${base}../../#arbeiten">Alle Arbeiten</a></li></ul></div>
  <div class="legal">Unabhängiger Designentwurf – keine offizielle Website von Harald's Haarwerkstatt. Fotos: Beispielbilder (Unsplash). Impressum und Datenschutz würden hier verlinkt.</div>
</div></footer>`;
  document.addEventListener('DOMContentLoaded', () => document.body.insertAdjacentHTML('beforeend', footerHTML));
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
