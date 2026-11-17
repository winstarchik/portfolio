/* Einfache, zugängliche Lightbox-Galerie.
   Nutzung: <div data-gallery> <button data-full="url" data-caption="…"><img …></button> … </div>
   Optional Filter: <div data-filter-for="id"><button data-filter="all">…</button></div> + data-tag am Bild-Button */
(function () {
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Bildansicht');
  lb.hidden = true;
  lb.innerHTML =
    '<button class="lb-x" aria-label="Schließen">×</button>' +
    '<button class="lb-prev" aria-label="Vorheriges Bild">‹</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-next" aria-label="Nächstes Bild">›</button>' +
    '<div class="lb-count" aria-live="polite"></div>';
  document.body.appendChild(lb);

  const css = document.createElement('style');
  css.textContent =
    '.lb{position:fixed;inset:0;z-index:100;background:rgba(10,10,10,.92);display:flex;align-items:center;justify-content:center;padding:56px 12px}' +
    '.lb[hidden]{display:none}' +
    '.lb figure{margin:0;max-width:min(1100px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center}' +
    '.lb img{max-width:100%;max-height:calc(100vh - 150px);object-fit:contain;border-radius:6px;background:#222}' +
    '.lb figcaption{color:#ddd;font-size:14px;margin-top:12px;text-align:center}' +
    '.lb button{position:absolute;background:rgba(255,255,255,.12);color:#fff;border:0;border-radius:999px;width:48px;height:48px;font-size:30px;line-height:1;cursor:pointer}' +
    '.lb button:hover,.lb button:focus-visible{background:rgba(255,255,255,.25);outline:none}' +
    '.lb-x{top:12px;right:12px}.lb-prev{left:12px;top:50%;transform:translateY(-50%)}.lb-next{right:12px;top:50%;transform:translateY(-50%)}' +
    '.lb-count{position:absolute;top:24px;left:20px;color:#bbb;font-size:13px}' +
    '@media(max-width:640px){.lb-prev,.lb-next{top:auto;bottom:16px;transform:none}}';
  document.head.appendChild(css);

  const img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), cnt = lb.querySelector('.lb-count');
  let items = [], idx = 0, opener = null;

  function visible(g) { return [...g.querySelectorAll('[data-full]')].filter(b => !b.closest('[hidden]') && b.offsetParent !== null); }
  function show() {
    const b = items[idx];
    img.src = b.dataset.full;
    img.alt = b.querySelector('img') ? b.querySelector('img').alt : '';
    cap.textContent = b.dataset.caption || '';
    cnt.textContent = (idx + 1) + ' / ' + items.length;
  }
  function open(g, b) { items = visible(g); idx = items.indexOf(b); opener = b; lb.hidden = false; document.body.style.overflow = 'hidden'; show(); lb.querySelector('.lb-x').focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; img.src = ''; if (opener) opener.focus(); }
  function step(d) { idx = (idx + d + items.length) % items.length; show(); }

  document.querySelectorAll('[data-gallery]').forEach(g => {
    g.addEventListener('click', e => { const b = e.target.closest('[data-full]'); if (b) open(g, b); });
  });
  lb.querySelector('.lb-x').onclick = close;
  lb.querySelector('.lb-prev').onclick = () => step(-1);
  lb.querySelector('.lb-next').onclick = () => step(1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); x0 = null; });

  // Filter
  document.querySelectorAll('[data-filter-for]').forEach(bar => {
    const g = document.getElementById(bar.dataset.filterFor);
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-filter]'); if (!b) return;
      bar.querySelectorAll('[data-filter]').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      const f = b.dataset.filter;
      g.querySelectorAll('[data-full]').forEach(it => { it.parentElement.hidden = !(f === 'all' || it.dataset.tag === f); });
    });
  });
})();
