/* Untere Leiste für alle Arbeiten: "← Alle Arbeiten" + "Rundgang".
   Der Rundgang erklärt die Funktionen einer Seite Schritt für Schritt.
   Pro Seite definieren: window.TOUR = [{ sel: '#karte', title: '…', text: '…' }, …] */
(function () {
  if (window.self !== window.top) return; // nicht in Vorschau-iframes
  const root = new URL('../', document.currentScript.src).href; // Portfolio-Startseite
  const steps = (window.TOUR || []).filter(s => { const el = document.querySelector(s.sel); return el && el.getClientRects().length; });
  const hasDock = !!document.querySelector('.dock');

  const css = document.createElement('style');
  css.textContent = `
  .tbar{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:70;display:flex;align-items:center;gap:2px;padding:4px;border-radius:12px;background:rgba(17,17,17,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 24px rgba(0,0,0,.25);font:500 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;transition:opacity .25s,transform .25s}
  .tbar a,.tbar button{color:#d9d9d9;text-decoration:none;padding:11px 14px;border-radius:9px;white-space:nowrap;border:0;background:none;cursor:pointer;font:inherit;display:flex;align-items:center;gap:8px}
  .tbar svg{width:15px;height:15px;flex:0 0 15px}
  .tbar a:hover,.tbar button:hover{background:rgba(255,255,255,.08);color:#fff}
  .tbar .go{background:#fff;color:#111;font-weight:600}
  .tbar .go:hover{background:#ececec;color:#111}
  .tbar.hide{opacity:0;transform:translateX(-50%) translateY(12px);pointer-events:none}
  @media(max-width:860px){.tbar.has-dock{bottom:88px}.tbar a,.tbar button{padding:10px 12px;font-size:13.5px}}
  .tshield{position:fixed;inset:0;z-index:79}
  .tdim{position:fixed;z-index:80;background:rgba(0,0,0,.58);pointer-events:none}
  .tspot{position:fixed;z-index:80;border-radius:10px;box-shadow:0 0 0 2px rgba(255,255,255,.95);pointer-events:none;transition:opacity .2s}
  .tcard{position:fixed;z-index:81;width:min(380px,calc(100vw - 24px));background:#141414;color:#f2f2f2;border-radius:14px;padding:18px 18px 14px;box-shadow:0 20px 50px rgba(0,0,0,.45);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;border:1px solid rgba(255,255,255,.08)}
  .tcard .tn{display:flex;justify-content:space-between;font-size:12.5px;color:#9a9a9a;font-variant-numeric:tabular-nums}
  .tcard .tn .tend{background:none;border:0;color:#9a9a9a;font:inherit;cursor:pointer;padding:0;text-decoration:underline;text-underline-offset:3px}
  .tcard h4{font-size:18px;line-height:1.3;margin:8px 0 6px;font-weight:600;color:#fff}
  .tcard p{color:#c9c9c9;margin:0}
  .tcard .tprog{height:2px;background:rgba(255,255,255,.12);border-radius:2px;margin-top:16px;overflow:hidden}
  .tcard .tprog i{display:block;height:100%;background:#fff}
  .tcard .tb{display:flex;justify-content:flex-end;align-items:center;margin-top:14px;gap:8px}
  .tcard .tb button{border:0;border-radius:9px;padding:11px 18px;font:600 14px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;cursor:pointer}
  .tcard .tnext{background:#fff;color:#111}
  .tcard .tprev{background:rgba(255,255,255,.1);color:#f2f2f2}
  @media(max-width:699px){.tcard{padding:16px 16px 12px}.tcard h4{font-size:17px}.tcard p{font-size:14.5px}}
  @media(prefers-reduced-motion:reduce){.tspot{transition:none}}
  .tcard button:focus-visible,.tbar a:focus-visible,.tbar button:focus-visible{outline:2px solid #fff;outline-offset:2px}
  @media print{.tbar{display:none}}`;
  document.head.appendChild(css);

  const bar = document.createElement('nav');
  bar.className = 'tbar' + (hasDock ? ' has-dock' : '');
  bar.setAttribute('aria-label', 'Portfolio-Navigation');
  bar.innerHTML = `<a href="${root}#arbeiten"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Alle Arbeiten</a>` + (steps.length ? `<button type="button" class="go" id="tStart"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Rundgang</button>` : '');
  document.body.appendChild(bar);

  let last = scrollY;
  addEventListener('scroll', () => { const y = scrollY; if (!document.querySelector('.tcard')) { bar.classList.toggle('hide', y > last + 4 && y > 300); if (y < last - 4) bar.classList.remove('hide'); } last = y; }, { passive: true });

  if (!steps.length) return;
  let i = 0, spot, card, shield, timer, dims = [];
  const mobile = () => innerWidth < 700;
  // Höhe einer klebenden/festen Kopfzeile oben, damit nichts darunter verschwindet
  function topInset() {
    let h = 0;
    document.querySelectorAll('header, .top, .info').forEach(e => {
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      if ((cs.position === 'sticky' || cs.position === 'fixed') && r.top <= 1 && r.bottom > 0) h = Math.max(h, r.bottom);
    });
    return h;
  }
  // Unterkante des sichtbaren Bereichs (auf dem Handy liegt die Karte unten)
  const bottomLimit = () => innerHeight - card.offsetHeight - 24;   // unten bleibt immer Platz für die Karte
  function scrollTo(el) {
    const r = el.getBoundingClientRect(), top = topInset() + 12, avail = bottomLimit() - top;
    let y = scrollY + r.top - top;                               // hohe Elemente: Anfang zeigen
    if (r.height < avail) y -= (avail - r.height) / 2;           // kleine: mittig im freien Bereich
    scrollTo.target = Math.max(0, Math.round(y));
    window.scrollTo({ top: scrollTo.target, behavior: 'smooth' });
  }
  function place() {
    if (!card) return;
    const el = document.querySelector(steps[i].sel), r = el.getBoundingClientRect(), pad = 8;
    if (mobile()) Object.assign(card.style, { left: '12px', right: '12px', top: 'auto', bottom: 'calc(12px + env(safe-area-inset-bottom))', width: 'auto' });
    else card.style.right = card.style.bottom = 'auto';
    // Hervorhebung auf den sichtbaren Bereich begrenzen
    const minT = topInset() + 4, maxB = bottomLimit() + 10;
    const L = Math.max(6, r.left - pad), R = Math.min(innerWidth - 6, r.right + pad);
    const T = Math.max(minT, r.top - pad), B = Math.min(maxB, r.bottom + pad);
    const visible = B - T > 24 && R - L > 24;
    Object.assign(spot.style, { left: L + 'px', top: T + 'px', width: Math.max(0, R - L) + 'px', height: Math.max(0, B - T) + 'px', opacity: visible ? 1 : 0 });
    // Abdunkeln mit vier Flächen um den Bereich (große Schatten zeichnet Chrome auf Android nicht)
    const W = innerWidth, H = innerHeight, box = (d, x, y, w, h) => Object.assign(d.style, { left: x + 'px', top: y + 'px', width: Math.max(0, w) + 'px', height: Math.max(0, h) + 'px' });
    if (visible) { box(dims[0], 0, 0, W, T); box(dims[1], 0, B, W, H - B); box(dims[2], 0, T, L, B - T); box(dims[3], R, T, W - R, B - T); }
    else { box(dims[0], 0, 0, W, H); [1, 2, 3].forEach(k => box(dims[k], 0, 0, 0, 0)); }
    if (mobile()) return;
    const ch = card.offsetHeight, cw = card.offsetWidth;
    const top = Math.min(B + 14, innerHeight - ch - 12);           // direkt unter dem Bereich, nie darüber
    const left = Math.min(Math.max(12, L), innerWidth - cw - 12);
    Object.assign(card.style, { top: top + 'px', left: left + 'px' });
  }
  function show() {
    const s = steps[i], el = document.querySelector(s.sel);
    card.innerHTML = `<div class="tn"><span>Schritt ${i + 1} von ${steps.length}</span><button class="tend" type="button">Beenden</button></div><h4>${s.title}</h4><p>${s.text}</p>
      <div class="tprog"><i style="width:${(i + 1) / steps.length * 100}%"></i></div>
      <div class="tb">${i ? '<button class="tprev" type="button">Zurück</button>' : ''}<button class="tnext" type="button">${i === steps.length - 1 ? 'Fertig' : 'Weiter'}</button></div>`;
    card.querySelector('.tnext').onclick = () => { if (i < steps.length - 1) { i++; show(); } else end(); };
    const p = card.querySelector('.tprev'); if (p) p.onclick = () => { i--; show(); };
    const e = card.querySelector('.tend'); if (e) e.onclick = end;
    place(); scrollTo(el);
    clearTimeout(timer); timer = setTimeout(place, 700);
    card.querySelector('.tnext').focus({ preventScroll: true });
  }
  function start() {
    i = 0; bar.classList.add('hide');
    shield = document.createElement('div'); shield.className = 'tshield';
    spot = document.createElement('div'); spot.className = 'tspot';
    card = document.createElement('div'); card.className = 'tcard'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite');
    dims = [0, 1, 2, 3].map(() => { const d = document.createElement('div'); d.className = 'tdim'; return d; });
    document.body.append(shield, ...dims, spot, card);
    addEventListener('resize', place); addEventListener('scroll', place, { passive: true });
    show();
  }
  function end() {
    clearTimeout(timer);
    shield.remove(); dims.forEach(d => d.remove()); dims = []; spot.remove(); card.remove(); card = null; bar.classList.remove('hide');
    removeEventListener('resize', place); removeEventListener('scroll', place);
  }
  document.getElementById('tStart').onclick = start;
  document.addEventListener('keydown', e => {
    if (!document.querySelector('.tcard')) return;
    if (e.key === 'Escape') end();
    if (e.key === 'ArrowRight' && i < steps.length - 1) { i++; show(); }
    if (e.key === 'ArrowLeft' && i > 0) { i--; show(); }
  });
  // ?rundgang in der URL startet den Rundgang automatisch
  if (/[?&]rundgang\b/.test(location.search)) setTimeout(start, 700);
})();
