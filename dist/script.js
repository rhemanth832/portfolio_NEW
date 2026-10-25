(() => {
  'use strict';
  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.section-nav a')];
  const progress = document.querySelector('.reading-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  function updateScroll() {
    const position = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? position / max : 0})`;
    let current = sections[0].id;
    const threshold = Math.min(window.innerHeight * 0.3, 210);
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
    }
    if (max > 0 && max - position < 15) current = sections[sections.length - 1].id;
    for (const link of links) {
      const active = link.hash === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  window.addEventListener('load', requestScrollUpdate);
  updateScroll();

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches) return;
      document.documentElement.style.setProperty('--x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--y', `${event.clientY}px`);
    }, { passive: true });
  }

  const email = 'rasamsettyhemanthsaketh@gmail.com';
  const copyButton = document.querySelector('.copy-email');
  const toast = document.querySelector('.toast');
  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  copyButton.addEventListener('click', async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      const field = document.createElement('textarea');
      field.value = email;
      field.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      field.remove();
      copyButton.focus({ preventScroll: true });
    }
    notify(copied ? 'Email address copied. Let’s talk!' : email);
  });
})();
