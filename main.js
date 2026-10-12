(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  // Placeholder review mode: open the page with ?placeholders to outline every TODO.
  if (/[?&]placeholders\b/.test(location.search)) {
    document.documentElement.classList.add('show-placeholders');
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Nav border on scroll ----------
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Scroll reveal ----------
  // Content is visible by default; only cards still below the fold get hidden
  // and then animate in, so nothing stays invisible if JS or observers fail.
  if (hasIO && !reduceMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.remove('is-pending'); revealIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('is-pending');
        revealIO.observe(el);
      }
    });
  }

  // ---------- Hero mock: cycle through feed rows ----------
  var skus = [
    { name: 'Olive oil 1 L', was: '289', now: '219 ₴', off: '−24%' },
    { name: 'Ground coffee 250 g', was: '189', now: '149 ₴', off: '−21%' },
    { name: 'Oat granola 500 g', was: '129', now: '99 ₴', off: '−23%' }
  ];
  var box = document.querySelector('.posters');
  var main = box && box.querySelector('.p45');
  var rows = document.querySelectorAll('.feed .row:not(.head)');
  var count = document.querySelector('.mock-count');

  if (main && !reduceMotion) {
    var i = 0, made = 37, timer = null;
    var set = function (sel, v) { box.querySelectorAll(sel).forEach(function (el) { el.textContent = v; }); };

    var step = function () {
      i = (i + 1) % skus.length;
      var s = skus[i];
      box.classList.add('swap');
      setTimeout(function () {
        main.dataset.sku = i;
        set('[data-name]', s.name); set('[data-was]', s.was); set('[data-now]', s.now); set('[data-off]', s.off);
        rows.forEach(function (r, n) { r.classList.toggle('on', n === i); });
        made = made >= 128 ? 12 : made + 3;
        count.textContent = made;
        box.classList.remove('swap');
      }, 350);
    };
    var start = function () { if (!timer) timer = setInterval(step, 2600); };
    var stop = function () { clearInterval(timer); timer = null; };

    // Only animate while the mock is on screen.
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(box);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  }

  // ---------- Mobile sticky CTA: visible after hero, hidden at the form ----------
  var sticky = document.querySelector('.sticky-cta');
  var hero = document.querySelector('.hero');
  var cta = document.getElementById('start');
  if (sticky && hasIO) {
    var pastHero = false, atCta = false;
    function update() {
      var show = pastHero && !atCta;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', String(!show));
      sticky.querySelector('a').tabIndex = show ? 0 : -1;
    }
    new IntersectionObserver(function (e) {
      pastHero = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; update();
    }).observe(hero);
    new IntersectionObserver(function (e) {
      atCta = e[0].isIntersecting; update();
    }).observe(cta);
  }

  // ---------- Lead form ----------
  // Works with Netlify Forms (action="/") or any endpoint that accepts
  // urlencoded POSTs (Formspree, Basin, Getform…). See README.
  var form = document.querySelector('.lead-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var btnHTML = btn.innerHTML;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';

      fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.classList.add('is-sent');
        status.textContent = 'Got it — we’ll be in touch within one business day with next steps.';
        if (window.gtag) window.gtag('event', 'generate_lead');
      }).catch(function () {
        var mail = document.querySelector('.footer-links a[href^="mailto:"]');
        status.className = 'form-status is-error';
        status.innerHTML = 'Something went wrong. Please email us at <a href="' + mail.href + '">' + mail.textContent + '</a>.';
        btn.disabled = false;
        btn.innerHTML = btnHTML;
      });
    });
  }
})();
