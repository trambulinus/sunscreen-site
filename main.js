/* Progressive enhancement only — every word on these pages is readable
   with this file blocked, missing or disabled. */
(function () {
  'use strict';

  // current year in the footer
  var y = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });

  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  els.forEach(function (el) { io.observe(el); });
}());

/* ---- hero carousel -----------------------------------------------------
   Drag or swipe, arrows, dots, or ← → with focus. Advances on its own,
   pauses on hover/focus, holds for a while after you move it yourself, and
   never auto-advances under prefers-reduced-motion. */
(function () {
  'use strict';
  var root = document.querySelector('[data-carousel]');
  if (!root) return;
  var frame = root.querySelector('.carousel__frame');
  var track = root.querySelector('.carousel__track');
  var slides = Array.prototype.slice.call(track.children);
  var dotsWrap = root.querySelector('.carousel__dots');
  var n = slides.length;
  if (n < 2 || !frame || !dotsWrap) return;

  var INTERVAL = 4500, HOLD = 8000;
  var index = 0, offset = 0, dragging = false, paused = false, holding = false;
  var startX = 0, pointerId = null, timer = null, holdTimer = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var dots = slides.map(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'carousel__dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Screenshot ' + (i + 1) + ' of ' + n);
    b.addEventListener('click', function () { userGo(i); });
    dotsWrap.appendChild(b);
    return b;
  });

  function render(animate) {
    track.classList.toggle('is-animating', !!animate && !dragging && !reduced.matches);
    track.style.transform = 'translateX(calc(' + (-index * 100) + '% + ' + offset + 'px))';
    slides.forEach(function (s, i) { s.setAttribute('aria-hidden', i === index ? 'false' : 'true'); });
    dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === index ? 'true' : 'false'); });
  }
  function restart() {
    clearInterval(timer); timer = null;
    if (paused || holding || dragging || reduced.matches) return;
    timer = setInterval(function () { index = (index + 1) % n; render(true); }, INTERVAL);
  }
  function go(to) { index = ((to % n) + n) % n; render(true); restart(); }
  function hold() {
    holding = true;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(function () { holding = false; restart(); }, HOLD);
  }
  function userGo(to) { hold(); go(to); }
  function setPaused(v) { paused = v; frame.setAttribute('aria-live', v ? 'polite' : 'off'); restart(); }

  root.querySelector('[data-prev]').addEventListener('click', function () { userGo(index - 1); });
  root.querySelector('[data-next]').addEventListener('click', function () { userGo(index + 1); });

  root.addEventListener('pointerenter', function () { setPaused(true); });
  root.addEventListener('pointerleave', function () { setPaused(false); });
  root.addEventListener('focusin',  function () { setPaused(true); });
  root.addEventListener('focusout', function () { setPaused(false); });

  frame.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); userGo(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); userGo(index - 1); }
  });

  frame.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerId = e.pointerId; startX = e.clientX; dragging = true; offset = 0;
    frame.setPointerCapture(e.pointerId);
    render(false); restart();
  });
  frame.addEventListener('pointermove', function (e) {
    if (!dragging || e.pointerId !== pointerId) return;
    offset = e.clientX - startX;
    render(false);
  });
  function endDrag(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    var threshold = Math.max(40, frame.offsetWidth * 0.18);
    var moved = offset;
    dragging = false; pointerId = null; offset = 0;
    if (moved <= -threshold) userGo(index + 1);
    else if (moved >= threshold) userGo(index - 1);
    else { render(true); restart(); }
  }
  frame.addEventListener('pointerup', endDrag);
  frame.addEventListener('pointercancel', endDrag);

  reduced.addEventListener('change', function () { render(false); restart(); });

  render(false);
  restart();
}());
