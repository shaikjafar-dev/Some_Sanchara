/* Some Sanchara · itinerary page behaviour (no dependencies) */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- optional real photos: set data-photo="path/to/img.jpg" on .scene or .tile ---- */
  $$('[data-photo]').forEach(function (el) {
    var src = el.getAttribute('data-photo');
    if (!src) return;
    var img = new Image();
    img.className = el.classList.contains('scene') ? 'scene-photo' : 'tile-photo';
    img.alt = el.getAttribute('data-alt') || '';
    img.loading = el.classList.contains('scene') ? 'eager' : 'lazy';
    img.onload = function () { el.classList.add('has-photo'); };
    img.onerror = function () { img.remove(); };
    img.src = src;
    el.insertBefore(img, el.firstChild);
  });

  /* ---- scroll progress, header state, sticky CTA, depth gauge ---- */
  var bar = $('.d-progress'), top = $('.d-top'), hero = $('.d-hero'), sticky = $('.d-sticky'), gauge = $('.gauge');
  var pxs = $$('.scene .px'), ticking = false, mx = 0, my = 0, tmx = 0, tmy = 0;
  function onScroll() {
    var y = window.scrollY, max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight), p = Math.min(1, y / max);
    if (bar) bar.style.setProperty('--p', p.toFixed(4));
    if (top) top.classList.toggle('solid', y > 60);
    var hh = hero ? hero.offsetHeight : 600;
    if (sticky) sticky.classList.toggle('show', y > hh * .7);
    if (gauge) { gauge.style.setProperty('--p', p.toFixed(4)); gauge.classList.toggle('show', y > hh * .5); }
    if (!reduce && y < hh * 1.2) pxs.forEach(function (g) {
      var d = parseFloat(g.getAttribute('data-depth')) || 0;
      g.style.transform = 'translate3d(' + (mx * d * 70).toFixed(1) + 'px,' + (y * d * .45 + my * d * 40).toFixed(1) + 'px,0)';
    });
    tlines.forEach(updateLine);
    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }

  /* ---- timeline spine fill + node activation ---- */
  var tlines = $$('[data-tline]');
  function updateLine(t) {
    var r = t.getBoundingClientRect(), vh = window.innerHeight, mid = vh * .6;
    var f = Math.min(1, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
    t.style.setProperty('--fill', f.toFixed(4));
    $$('.tl-item', t).forEach(function (li) {
      var n = li.getBoundingClientRect();
      li.classList.toggle('on', n.top + 40 < mid);
    });
  }

  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  if (!reduce && window.matchMedia('(hover:hover)').matches && hero) {
    hero.addEventListener('pointermove', function (e) {
      var b = hero.getBoundingClientRect();
      mx = (e.clientX - b.left) / b.width - .5; my = (e.clientY - b.top) / b.height - .5; req();
    });
  }
  onScroll();

  /* ---- reveal on scroll ---- */
  var rv = $$('.rv');
  if (!('IntersectionObserver' in window) || reduce) { rv.forEach(function (e) { e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (e) { io.observe(e); });
  }

  /* ---- pause heavy animation when off-screen ---- */
  if ('IntersectionObserver' in window) {
    var po = new IntersectionObserver(function (es) {
      es.forEach(function (en) { en.target.classList.toggle('paused', !en.isIntersecting); });
    });
    $$('.d-hero,.tile').forEach(function (e) { po.observe(e); });
  }

  /* ---- count-up numbers ---- */
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), dur = 1400, t0 = null;
    if (reduce) { el.textContent = end.toLocaleString('en-IN'); return; }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * e).toLocaleString('en-IN');
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cu = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: .6 });
    cu.forEach(function (e) { co.observe(e); });
  } else cu.forEach(function (e) { e.textContent = parseFloat(e.getAttribute('data-count')).toLocaleString('en-IN'); });

  /* ---- trail profile draw ---- */
  $$('.profile').forEach(function (p) {
    if (!('IntersectionObserver' in window) || reduce) { p.classList.add('in'); return; }
    var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { p.classList.add('in'); o.disconnect(); } }, { threshold: .35 });
    o.observe(p);
  });

  /* ---- checklist with saved ticks ---- */
  $$('[data-checklist]').forEach(function (box) {
    var key = 'ss-check-' + box.getAttribute('data-checklist'), boxes = $$('input', box), saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    var meter = $('[data-meter]', box.parentNode), fill = meter && $('i', meter), txt = meter && $('span', meter);
    function paint() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      if (fill) fill.style.width = (n / boxes.length * 100) + '%';
      if (txt) txt.textContent = n + ' / ' + boxes.length + ' packed';
    }
    boxes.forEach(function (b, i) {
      b.checked = !!saved[i];
      b.addEventListener('change', function () {
        saved[i] = b.checked;
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
        paint();
      });
    });
    paint();
  });

  /* ---- copy phone numbers ---- */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy'), old = b.textContent;
      function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1500); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, done); else done();
    });
  });

  /* ---- tabs (day switcher) ---- */
  $$('[data-tabs]').forEach(function (box) {
    var btns = $$('[role=tab]', box), panels = $$('.tabpanel', box.parentNode);
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        panels.forEach(function (p, j) { p.hidden = j !== i; });
        req();
      });
    });
  });

  /* ---- booking helper: builds a WhatsApp message, no payment or API ---- */
  var bk = $('[data-book]');
  if (bk) {
    var price = +bk.getAttribute('data-price') || 0, trip = bk.getAttribute('data-trip'), dur = bk.getAttribute('data-dur') || '';
    var wa = bk.getAttribute('data-wa'), city = ($('[data-city][aria-pressed="true"]', bk) || {getAttribute: function () { return ''; }}).getAttribute('data-city'), n = 2, when = '';
    var out = $('[data-n]', bk), tot = $('[data-total]', bk), calc = $('[data-calc]', bk), link = $('[data-wa-link]', bk);
    var inr = function (v) { return '\u20B9' + v.toLocaleString('en-IN'); };
    function nextDays(weekdays, count) {
      var d = new Date(), res = [];
      d.setHours(0, 0, 0, 0);
      while (res.length < count) { d.setDate(d.getDate() + 1); if (weekdays.indexOf(d.getDay()) > -1) res.push(new Date(d)); }
      return res;
    }
    var fmt = function (d) { return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(d); };
    var depBox = $('[data-deps]', bk);
    if (depBox) {
      var mode = depBox.getAttribute('data-deps'), labels;
      if (mode === 'weekend') labels = nextDays([6], 4).map(function (d) { var e = new Date(d); e.setDate(e.getDate() + 1); return fmt(d) + ' to ' + fmt(e); });
      else labels = nextDays([5], 4).map(fmt);
      labels.forEach(function (l, i) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = l; b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        if (i === 0) when = l;
        b.addEventListener('click', function () {
          when = l; $$('button', depBox).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); paint();
        });
        depBox.appendChild(b);
      });
    }
    function paint() {
      out.textContent = n;
      if (price) { var total = price * n; tot.textContent = inr(total); calc.textContent = n + ' \u00D7 ' + inr(price); }
      else { tot.textContent = 'Ask the team'; calc.textContent = 'Price shared when you enquire'; }
      var msg = 'Hi Some Sanchara, I would like to book the ' + trip + (dur ? ' (' + dur + ')' : '') + '.\n' + (city ? 'Pickup city: ' + city + '\n' : '') +
        (when ? 'Preferred date: ' + when + '\n' : '') + 'Travellers: ' + n + (price ? ' (approx. ' + inr(price * n) + ')' : '') + '\n' + (when ? '' : 'Preferred date: ') + (price ? '' : 'Please share the price and availability.');
      link.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg);
    }
    $$('[data-city]', bk).forEach(function (b) {
      b.addEventListener('click', function () {
        city = b.getAttribute('data-city');
        $$('[data-city]', bk).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        paint();
      });
    });
    $('[data-minus]', bk).addEventListener('click', function () { n = Math.max(1, n - 1); paint(); });
    $('[data-plus]', bk).addEventListener('click', function () { n = Math.min(20, n + 1); paint(); });
    paint();
  }
})();
