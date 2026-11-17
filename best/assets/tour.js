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
  .tbar{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:70;display:flex;gap:4px;padding:5px;border-radius:999px;background:rgba(20,20,20,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 12px 34px rgba(0,0,0,.3);font:600 14px/1 "Inter",system-ui,sans-serif;transition:opacity .25s,transform .25s}
  .tbar a,.tbar button{color:#e6e6e6;text-decoration:none;padding:11px 16px;border-radius:999px;white-space:nowrap;border:0;background:none;cursor:pointer;font:inherit;display:flex;align-items:center;gap:7px}
  .tbar a:hover,.tbar button:hover{background:rgba(255,255,255,.12);color:#fff}
  .tbar .go{background:#fff;color:#111}
  .tbar .go:hover{background:#f0f0f0;color:#111}
  .tbar.hide{opacity:0;transform:translateX(-50%) translateY(16px);pointer-events:none}
  @media(max-width:860px){.tbar.has-dock{bottom:90px}.tbar a,.tbar button{padding:10px 13px;font-size:13px}}
  .tspot{position:fixed;z-index:80;border-radius:14px;box-shadow:0 0 0 9999px rgba(10,10,10,.62),0 0 0 3px #ffd23f;pointer-events:none;transition:all .3s ease}
  .tcard{position:fixed;z-index:81;width:min(360px,calc(100vw - 24px));background:#fff;color:#151515;border-radius:18px;padding:20px 20px 16px;box-shadow:0 24px 60px rgba(0,0,0,.35);font:15px/1.55 "Inter",system-ui,sans-serif}
  .tcard .tn{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8a8a8a}
  .tcard h4{font-size:19px;line-height:1.25;margin:6px 0 8px;font-weight:700}
  .tcard p{color:#444;margin:0}
  .tcard .tb{display:flex;justify-content:space-between;align-items:center;margin-top:16px;gap:8px}
  .tcard button{border:0;border-radius:999px;padding:10px 16px;font:600 14px "Inter",system-ui,sans-serif;cursor:pointer}
  .tcard .tnext{background:#151515;color:#fff}
  .tcard .tprev{background:#efefef;color:#151515}
  .tcard .tend{background:none;color:#777;padding:10px 6px}
  .tdots{display:flex;gap:5px}.tdots i{width:7px;height:7px;border-radius:50%;background:#ddd}.tdots i.on{background:#151515}
  @media print{.tbar{display:none}}`;
  document.head.appendChild(css);

  const bar = document.createElement('nav');
  bar.className = 'tbar' + (hasDock ? ' has-dock' : '');
  bar.setAttribute('aria-label', 'Portfolio-Navigation');
  bar.innerHTML = `<a href="${root}#arbeiten">← Alle Arbeiten</a>` + (steps.length ? `<button type="button" class="go" id="tStart">▶ Rundgang</button>` : '');
  document.body.appendChild(bar);

  let last = scrollY;
  addEventListener('scroll', () => { const y = scrollY; if (!document.querySelector('.tcard')) { bar.classList.toggle('hide', y > last + 4 && y > 300); if (y < last - 4) bar.classList.remove('hide'); } last = y; }, { passive: true });

  if (!steps.length) return;
  let i = 0, spot, card;
  function place() {
    const s = steps[i], el = document.querySelector(s.sel), r = el.getBoundingClientRect(), pad = 8;
    Object.assign(spot.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
    const ch = card.offsetHeight, below = r.bottom + pad + 14, above = r.top - pad - 14 - ch;
    let top = below + ch < innerHeight - 10 ? below : above > 10 ? above : innerHeight - ch - 12;
    let left = Math.min(Math.max(12, r.left), innerWidth - card.offsetWidth - 12);
    Object.assign(card.style, { top: top + 'px', left: left + 'px' });
  }
  function show() {
    const s = steps[i], el = document.querySelector(s.sel);
    card.innerHTML = `<span class="tn">Rundgang · ${i + 1} von ${steps.length}</span><h4>${s.title}</h4><p>${s.text}</p>
      <div class="tb"><div class="tdots">${steps.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('')}</div>
      <div>${i ? '<button class="tprev" type="button">Zurück</button> ' : '<button class="tend" type="button">Beenden</button> '}<button class="tnext" type="button">${i === steps.length - 1 ? 'Fertig' : 'Weiter'}</button></div></div>`;
    card.querySelector('.tnext').onclick = () => { if (i < steps.length - 1) { i++; show(); } else end(); };
    const p = card.querySelector('.tprev'); if (p) p.onclick = () => { i--; show(); };
    const e = card.querySelector('.tend'); if (e) e.onclick = end;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(place, 420); place();
    card.querySelector('.tnext').focus({ preventScroll: true });
  }
  function start() {
    i = 0; bar.classList.add('hide');
    spot = document.createElement('div'); spot.className = 'tspot';
    card = document.createElement('div'); card.className = 'tcard'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-live', 'polite');
    document.body.append(spot, card);
    addEventListener('resize', place); addEventListener('scroll', place, { passive: true });
    show();
  }
  function end() {
    spot.remove(); card.remove(); bar.classList.remove('hide');
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
