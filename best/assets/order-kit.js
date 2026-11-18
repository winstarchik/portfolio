/* Order-Kit für die Demo-Seiten.
   - Kit.hours(H, {table, status, text})  → Öffnungszeiten-Tabelle + „Jetzt geöffnet“
   - Kit.order(cfg)                       → Bestell-/Anfrage-Zettel mit Anrufen, WhatsApp, Kopieren
   Aussehen über CSS-Variablen der Seite: --k-bg --k-card --k-ink --k-muted --k-line --k-accent --k-on-accent --k-display --k-tt --k-radius
   Es wird nichts an einen Server gesendet. */
(function () {
  const K = window.Kit = {};
  const $ = (s, r = document) => r.querySelector(s);
  K.fmt = n => n.toFixed(2).replace('.', ',') + ' €';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Öffnungszeiten ----------
     H: 7 Einträge, Index 0 = Sonntag: ['Sonntag', 12, 22] oder ['Montag', null] für Ruhetag.
     Halbe Stunden als 7.5 usw. */
  const hm = v => { const h = Math.floor(v), m = Math.round((v - h) * 60); return (h === 24 ? '24' : h) + (m ? ':' + String(m).padStart(2, '0') : ''); };
  K.hours = function (H, o) {
    const now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
    if (o.table) {
      const el = typeof o.table === 'string' ? $(o.table) : o.table;
      el.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(i => {
        const [n, a, b] = H[i];
        return `<div class="k-h${i === d ? ' today' : ''}"><span>${n}${i === d ? ' <small>(heute)</small>' : ''}</span><span>${a == null ? 'Ruhetag' : hm(a) + '–' + hm(b) + ' Uhr'}</span></div>`;
      }).join('');
    }
    const [, a, b] = H[d];
    const open = a != null && t >= a && t < b;
    let msg;
    if (open) msg = `Jetzt geöffnet · bis ${b === 24 ? 'Mitternacht' : hm(b) + ' Uhr'}`;
    else {
      let nx = '';
      if (a != null && t < a) nx = `heute ${hm(a)} Uhr`;
      else for (let k = 1; k < 8; k++) { const j = (d + k) % 7; if (H[j][1] != null) { nx = (k === 1 ? 'morgen' : H[j][0]) + ` ${hm(H[j][1])} Uhr`; break; } }
      msg = `Gerade geschlossen · öffnet ${nx}`;
    }
    if (o.status) { const s = typeof o.status === 'string' ? $(o.status) : o.status; s.classList.toggle('closed', !open); s.dataset.open = open; }
    if (o.text) (typeof o.text === 'string' ? $(o.text) : o.text).textContent = msg;
    return open;
  };

  /* ---------- Bestellung / Anfrage ---------- */
  K.order = function (cfg) {
    const items = cfg.items || {};
    const hasItems = Object.keys(items).length > 0;
    const cart = new Map();
    let mode = cfg.modes ? cfg.modes[0] : null;
    const tel = cfg.tel, telLabel = cfg.telLabel || '';

    const css = document.createElement('style');
    css.textContent = `
    .k-bar{position:fixed;left:50%;bottom:84px;transform:translate(-50%,16px);opacity:0;visibility:hidden;z-index:60;display:flex;align-items:center;gap:14px;background:var(--k-ink);color:var(--k-bg);border-radius:999px;padding:7px 7px 7px 20px;box-shadow:0 18px 50px rgba(0,0,0,.35);transition:transform .3s,opacity .3s,visibility .3s;white-space:nowrap;font-size:15px}
    .k-bar.show{transform:translate(-50%,0);opacity:1;visibility:visible}
    .k-bar b{font-weight:700}
    .k-bar button{background:var(--k-accent);color:var(--k-on-accent);border:0;border-radius:999px;padding:12px 18px;font:inherit;font-weight:700;cursor:pointer}
    @media(max-width:860px){.k-bar.has-dock{display:none}.k-bar{bottom:84px;left:12px;right:12px;transform:translateY(16px);justify-content:space-between}.k-bar.show{transform:none}}
    dialog.k-dlg{margin:auto 0 0 auto;height:100%;max-height:100%;width:min(470px,100%);border:0;background:var(--k-bg);color:var(--k-ink);padding:0;box-shadow:-20px 0 60px rgba(0,0,0,.35);font:inherit}
    dialog.k-dlg::backdrop{background:rgba(0,0,0,.55)}
    .k-in{display:flex;flex-direction:column;height:100%}
    .k-hd{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:22px 24px;border-bottom:1px solid var(--k-line)}
    .k-hd h3{font-family:var(--k-display);text-transform:var(--k-tt,none);font-weight:var(--k-dw,600);font-size:28px;line-height:1.05;margin:0}
    .k-x{width:42px;height:42px;flex:0 0 42px;border-radius:50%;border:1px solid var(--k-line);background:none;color:inherit;font-size:20px;cursor:pointer}
    .k-bd{flex:1;overflow:auto;padding:16px 24px}
    .k-ln{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--k-line)}
    .k-ln small{display:block;color:var(--k-muted)}
    .k-q{display:flex;align-items:center;gap:8px}
    .k-q button{width:32px;height:32px;border-radius:50%;border:1px solid var(--k-line);background:none;color:inherit;font-size:18px;line-height:1;cursor:pointer}
    .k-empty{color:var(--k-muted);padding:24px 0;text-align:center}
    .k-seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;background:var(--k-card);border-radius:14px;padding:4px;margin:18px 0 6px}
    .k-seg button{padding:11px;border-radius:11px;border:0;background:none;color:var(--k-muted);font:inherit;font-weight:700;cursor:pointer}
    .k-seg button[aria-pressed="true"]{background:var(--k-ink);color:var(--k-bg)}
    .k-f label{display:block;font-size:13px;font-weight:700;color:var(--k-muted);margin:14px 0 6px}
    .k-f input,.k-f textarea,.k-f select{width:100%;background:var(--k-card);border:1px solid var(--k-line);border-radius:12px;padding:12px 14px;color:var(--k-ink);font:inherit;font-size:16px}
    .k-f textarea{min-height:72px;resize:vertical}
    .k-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}
    .k-ft{padding:16px 24px calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--k-line);display:grid;gap:10px}
    .k-sum{display:flex;justify-content:space-between;align-items:baseline;font-weight:700;font-size:17px}
    .k-sum span:last-child{font-family:var(--k-display);font-size:26px}
    .k-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .k-b{display:flex;align-items:center;justify-content:center;gap:9px;border-radius:999px;padding:15px 12px;font:inherit;font-weight:700;font-size:15px;cursor:pointer;text-decoration:none;border:1.5px solid var(--k-line);background:none;color:inherit}
    .k-b.a{background:var(--k-accent);border-color:var(--k-accent);color:var(--k-on-accent)}
    .k-b svg{width:18px;height:18px}
    .k-ft small{color:var(--k-muted);font-size:12.5px;text-align:center;line-height:1.4}
    .k-toast{position:fixed;left:50%;top:86px;transform:translateX(-50%);background:var(--k-ink);color:var(--k-bg);font-weight:700;padding:11px 18px;border-radius:999px;opacity:0;pointer-events:none;transition:opacity .25s;z-index:90;font-size:15px}
    .k-toast.show{opacity:1}`;
    document.head.appendChild(css);

    const IC = {
      call: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
      wa: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3z"/></svg>'
    };

    const fieldHtml = f => {
      const id = 'k_' + f.k;
      let inp;
      if (f.type === 'select') inp = `<select id="${id}">${f.options.map(o => `<option>${esc(o)}</option>`).join('')}</select>`;
      else if (f.type === 'area') inp = `<textarea id="${id}" placeholder="${esc(f.ph || '')}"></textarea>`;
      else inp = `<input id="${id}" type="${f.type || 'text'}" autocomplete="off" placeholder="${esc(f.ph || '')}"${f.type === 'date' ? ` min="${new Date().toISOString().slice(0, 10)}"` : ''}>`;
      return `<div class="k-f"${f.half ? ' data-half' : ''}><label for="${id}" id="${id}_l">${esc(f.l)}</label>${inp}</div>`;
    };
    const fields = cfg.fields || [];
    let fhtml = '', buf = [];
    fields.forEach(f => { if (f.half) { buf.push(fieldHtml(f)); if (buf.length === 2) { fhtml += `<div class="k-grid">${buf.join('')}</div>`; buf = []; } } else { if (buf.length) { fhtml += `<div class="k-grid">${buf.join('')}</div>`; buf = []; } fhtml += fieldHtml(f); } });
    if (buf.length) fhtml += `<div class="k-grid">${buf.join('')}</div>`;

    const dock = cfg.dockButton ? $(cfg.dockButton) : null;
    const bar = document.createElement('div');
    bar.className = 'k-bar' + (dock ? ' has-dock' : '');
    bar.innerHTML = `<b id="k_barTxt"></b><button type="button" data-k-open>${esc(cfg.barButton || 'Ansehen')}</button>`;
    if (hasItems) document.body.appendChild(bar);

    const dlg = document.createElement('dialog');
    dlg.className = 'k-dlg';
    dlg.setAttribute('aria-labelledby', 'k_title');
    dlg.innerHTML = `<div class="k-in">
      <div class="k-hd"><h3 id="k_title">${esc(cfg.title || 'Ihre Bestellung')}</h3><button class="k-x" type="button" aria-label="Schließen">×</button></div>
      <div class="k-bd">
        ${cfg.intro ? `<p style="color:var(--k-muted);margin:4px 0 6px">${esc(cfg.intro)}</p>` : ''}
        ${hasItems ? '<div id="k_lines"></div>' : ''}
        ${cfg.modes ? `<div class="k-seg" role="group">${cfg.modes.map((m, i) => `<button type="button" data-k-mode="${esc(m)}" aria-pressed="${i === 0}">${esc(m)}</button>`).join('')}</div>` : ''}
        ${fhtml}
      </div>
      <div class="k-ft">
        ${hasItems && cfg.showSum !== false ? `<div class="k-sum"><span>${esc(cfg.sumLabel || 'Summe')}</span><span id="k_sum"></span></div>` : ''}
        <div class="k-row">
          <a class="k-b a" href="tel:${tel}">${IC.call}${esc(cfg.callLabel || 'Anrufen')}</a>
          <a class="k-b" id="k_wa" href="#" target="_blank" rel="noopener">${IC.wa}WhatsApp</a>
        </div>
        <button class="k-b" type="button" id="k_copy">Text kopieren</button>
        <small>${esc(cfg.note || 'Demo: Es wird nichts automatisch gesendet. WhatsApp öffnet sich mit Ihrem fertigen Text.')}</small>
      </div></div>`;
    document.body.appendChild(dlg);

    const toastEl = document.createElement('div'); toastEl.className = 'k-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
    const toast = K.toast = m => { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 1600); };

    const total = () => { let s = 0, n = 0; cart.forEach((q, id) => { s += q * items[id].p; n += q; }); return { s, n }; };
    const val = k => { const e = document.getElementById('k_' + k); return e ? e.value.trim() : ''; };
    const label = f => (mode && f.byMode && f.byMode[mode] ? f.byMode[mode].l : f.l);
    function text() {
      const L = [`Hallo ${cfg.name}, ${cfg.greet || 'ich möchte bestellen'}${mode ? ' (' + mode + ')' : ''}:`];
      if (hasItems) {
        cart.forEach((q, id) => L.push(`${q}× ${items[id].name}${items[id].p ? ' – ' + K.fmt(q * items[id].p) : ''}`));
        if (cfg.showSum !== false) L.push(`${cfg.sumLabel || 'Summe'}: ${K.fmt(total().s)}`);
      }
      fields.forEach(f => { const v = val(f.k); if (v && v !== '–') L.push(`${label(f)}: ${v}`); });
      return L.join('\n');
    }
    function update() {
      const { s, n } = total();
      if (hasItems) {
        $('#k_barTxt').textContent = `${n} ${n === 1 ? (cfg.one || 'Artikel') : (cfg.many || 'Artikel')}${cfg.showSum !== false ? ' · ' + K.fmt(s) : ''}`;
        bar.classList.toggle('show', n > 0);
        const sum = $('#k_sum'); if (sum) sum.textContent = K.fmt(s);
        $('#k_lines').innerHTML = n ? [...cart].map(([id, q]) => `<div class="k-ln"><div><b>${esc(items[id].name)}</b>${items[id].p ? `<small>${K.fmt(items[id].p)}${items[id].unit ? ' ' + esc(items[id].unit) : ' pro Stück'}</small>` : ''}</div>
          <div class="k-q"><button type="button" data-k-q="${id}" data-d="-1" aria-label="weniger">−</button><span>${q}</span><button type="button" data-k-q="${id}" data-d="1" aria-label="mehr">+</button></div>
          <b>${items[id].p ? K.fmt(q * items[id].p) : ''}</b></div>`).join('') : `<p class="k-empty">${esc(cfg.empty || 'Noch nichts ausgewählt.')}</p>`;
        if (dock) dock.textContent = n ? `${cfg.dockLabel || 'Bestellung'} (${n})` : (cfg.dockEmpty || dock.dataset.label || dock.textContent);
      }
      $('#k_wa').href = 'https://wa.me/?text=' + encodeURIComponent(text());
      document.dispatchEvent(new CustomEvent('kit:change', { detail: { cart, total: total() } }));
    }
    if (dock && !dock.dataset.label) dock.dataset.label = dock.textContent;

    document.addEventListener('click', e => {
      const a = e.target.closest('[data-add]');
      if (a && items[a.dataset.add]) { const id = a.dataset.add; cart.set(id, (cart.get(id) || 0) + 1); update(); toast(`${items[id].name} – hinzugefügt`); return; }
      const q = e.target.closest('[data-k-q]');
      if (q) { const id = q.dataset.kQ, v = (cart.get(id) || 0) + +q.dataset.d; v > 0 ? cart.set(id, v) : cart.delete(id); update(); return; }
      const o = e.target.closest('[data-k-open]');
      if (o) { e.preventDefault(); if (o.dataset.kPreset) { const [k, v] = o.dataset.kPreset.split('='); const el = document.getElementById('k_' + k); if (el) el.value = v; update(); } dlg.showModal(); return; }
      const m = e.target.closest('[data-k-mode]');
      if (m) {
        mode = m.dataset.kMode; dlg.querySelectorAll('[data-k-mode]').forEach(x => x.setAttribute('aria-pressed', x === m));
        fields.forEach(f => { if (f.byMode) { const bm = f.byMode[mode] || {}; $('#k_' + f.k + '_l').textContent = bm.l || f.l; $('#k_' + f.k).placeholder = bm.ph || f.ph || ''; } });
        update();
      }
    });
    if (dock) dock.addEventListener('click', e => { if (total().n) { e.preventDefault(); dlg.showModal(); } });
    dlg.querySelector('.k-x').onclick = () => dlg.close();
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('input', update);
    $('#k_copy').onclick = async () => { try { await navigator.clipboard.writeText(text()); toast('Text kopiert'); } catch { toast('Kopieren nicht möglich'); } };
    update();
    return { cart, qty: id => cart.get(id) || 0, open: () => dlg.showModal(), update };
  };
})();
