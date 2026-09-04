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

  /* ---------- Terminal typewriter ---------- */
  var term = document.getElementById('terminal');
  if (term) {
    var lines = Array.prototype.slice.call(term.querySelectorAll('.tline'));
    if (reduceMotion) {
      // Show everything immediately.
    } else {
      var code = term.querySelector('code');
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      lines.forEach(function (l) {
        l.dataset.out = l.textContent;
        l.dataset.full = l.dataset.cmd;
        l.textContent = '';
        l.dataset.cmd = '';
        l.classList.add('hidden');
      });
      code.appendChild(cursor);

      var idx = 0;
      function typeLine() {
        if (idx >= lines.length) return;
        var line = lines[idx];
        var full = line.dataset.full;
        var pos = 0;
        line.classList.remove('hidden');
        line.parentNode.insertBefore(cursor, line.nextSibling);
        var t = setInterval(function () {
          pos++;
          line.dataset.cmd = full.slice(0, pos);
          if (pos >= full.length) {
            clearInterval(t);
            setTimeout(function () {
              line.textContent = line.dataset.out;
              idx++;
              setTimeout(typeLine, 320);
            }, 260);
          }
        }, 38);
      }
      setTimeout(typeLine, 500);
    }
  }

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
