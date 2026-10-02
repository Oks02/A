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
  var reveals = document.querySelectorAll('.reveal');
  if (!hasIO || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  // ---------- Hero mock: cycle through feed rows ----------
  var skus = [
    { name: 'Olive oil 1 L', old: '289', price: '219', off: '−24%' },
    { name: 'Ground coffee 250 g', old: '189', price: '149', off: '−21%' },
    { name: 'Oat granola 500 g', old: '129', price: '99', off: '−23%' }
  ];
  var poster = document.querySelector('.poster-main');
  var rows = document.querySelectorAll('.feed-rows li');
  var count = document.querySelector('.mock-count');
  var tags = document.querySelectorAll('.poster-story .p-tag, .poster-square .p-tag');

  if (poster && !reduceMotion) {
    var i = 0, made = 37, timer = null;

    function step() {
      i = (i + 1) % skus.length;
      var s = skus[i];
      poster.classList.add('is-swapping');
      setTimeout(function () {
        poster.dataset.sku = i;
        poster.querySelector('.p-name').textContent = s.name;
        poster.querySelector('.p-old').textContent = s.old;
        poster.querySelector('.p-new').textContent = s.price;
        poster.querySelector('.p-badge').textContent = s.off;
        tags.forEach(function (t) { t.textContent = s.off; });
        rows.forEach(function (r, n) { r.classList.toggle('is-active', n === i); });
        made = made >= 128 ? 12 : made + 3;
        count.textContent = made;
        poster.classList.remove('is-swapping');
      }, 350);
    }

    function start() { if (!timer) timer = setInterval(step, 2600); }
    function stop() { clearInterval(timer); timer = null; }

    // Only animate while the mock is on screen.
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(poster);
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
