/* ==========================================================================
   Analytics — pick ONE provider and paste your ID. Nothing loads until you do.

   GoatCounter (recommended: free for personal sites, no cookies, no consent
   banner needed). Sign up at https://www.goatcounter.com, choose a code such
   as "mehraz", and set:   goatcounter: 'mehraz'
   Dashboard: https://<code>.goatcounter.com

   Google Analytics 4: create a GA4 property at https://analytics.google.com,
   copy the Measurement ID (looks like G-XXXXXXXXXX) and set:   ga4: 'G-XXXXXXXXXX'
   ========================================================================== */
var ANALYTICS = {
  goatcounter: '',
  ga4: ''
};

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Analytics loader ---------- */
  (function loadAnalytics() {
    var isLocal = /^(localhost|127\.0\.0\.1|)$/.test(location.hostname) || location.protocol === 'file:';
    if (isLocal) return;
    if (ANALYTICS.goatcounter) {
      var gc = document.createElement('script');
      gc.async = true;
      gc.src = 'https://gc.zgo.at/count.js';
      gc.setAttribute('data-goatcounter', 'https://' + ANALYTICS.goatcounter + '.goatcounter.com/count');
      document.head.appendChild(gc);
    }
    if (ANALYTICS.ga4) {
      var ga = document.createElement('script');
      ga.async = true;
      ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ANALYTICS.ga4);
      document.head.appendChild(ga);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ANALYTICS.ga4, { anonymize_ip: true });
    }
  })();

  /* ---------- Theme toggle (dark is default) ---------- */
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var light = root.getAttribute('data-theme') === 'light';
      if (light) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', light ? 'dark' : 'light'); } catch (e) {}
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Active nav link ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  function setActive() {
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top - 160 <= 0) current = sections[i];
    }
    links.forEach(function (a) {
      a.classList.toggle('active', !!(current && a.getAttribute('href') === '#' + current.id));
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { setActive(); ticking = false; });
  }, { passive: true });
  setActive();

  /* ---------- Cursor spotlight on cards ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Developer ID card: tilt + sheen ---------- */
  var idCard = document.getElementById('id-card');
  var idInner = idCard && idCard.querySelector('.id-inner');
  if (idCard && idInner && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    idCard.addEventListener('pointermove', function (e) {
      var r = idCard.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      idInner.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
      idInner.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
      idInner.style.setProperty('--sx', (px * 100).toFixed(1) + '%');
      idInner.style.setProperty('--sy', (py * 100).toFixed(1) + '%');
    });
    idCard.addEventListener('pointerleave', function () {
      idInner.style.setProperty('--rx', '0deg');
      idInner.style.setProperty('--ry', '0deg');
    });
  }

  /* ---------- Live GitHub data (public API, no auth) ---------- */
  (function github() {
    var user = 'MehrazRumman';
    var reposEl = document.getElementById('gh-repos');
    var followersEl = document.getElementById('gh-followers');
    var starsEl = document.getElementById('gh-stars');
    var starsItem = document.getElementById('gh-stars-item');
    var list = document.getElementById('gh-repos-list');
    if (!window.fetch || (!reposEl && !list)) return;

    function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

    fetch('https://api.github.com/users/' + user, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (u) {
        if (!u) return;
        if (reposEl && typeof u.public_repos === 'number') reposEl.textContent = fmt(u.public_repos);
        if (followersEl && typeof u.followers === 'number') followersEl.textContent = fmt(u.followers);
      }).catch(function () {});

    fetch('https://api.github.com/users/' + user + '/repos?per_page=100&type=owner', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (repos) {
        if (!Array.isArray(repos) || !repos.length) return;
        var own = repos.filter(function (r) { return !r.fork; });
        var stars = own.reduce(function (s, r) { return s + (r.stargazers_count || 0); }, 0);
        if (starsEl && starsItem && stars > 0) { starsEl.textContent = fmt(stars); starsItem.hidden = false; }
        if (!list) return;
        var top = own
          .filter(function (r) { return !r.archived; })
          .sort(function (a, b) {
            return (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at));
          })
          .slice(0, 4);
        if (!top.length) return;
        list.innerHTML = top.map(function (r) {
          var meta = [r.language, r.stargazers_count ? '★ ' + r.stargazers_count : null].filter(Boolean).join(' · ');
          return '<li><a href="' + esc(r.html_url) + '" target="_blank" rel="noopener">' +
            '<span class="gh-name">' + esc(r.name) + '</span>' +
            (r.description ? '<span class="gh-desc">' + esc(r.description) + '</span>' : '') +
            (meta ? '<span class="gh-meta mono">' + esc(meta) + '</span>' : '') +
            '</a></li>';
        }).join('');
      }).catch(function () {});
  })();

  /* ---------- Local time in Dhaka ---------- */
  var clock = document.getElementById('local-time');
  if (clock && window.Intl && Intl.DateTimeFormat) {
    var fmt = null;
    try { fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' }); } catch (e) {}
    var tick = function () { if (fmt) clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn && navigator.clipboard) {
    var label = copyBtn.querySelector('.copy-label');
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-copy')).then(function () {
        if (label) label.textContent = 'Copied';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          if (label) label.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 1800);
      }).catch(function () {});
    });
  } else if (copyBtn) {
    copyBtn.hidden = true;
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
