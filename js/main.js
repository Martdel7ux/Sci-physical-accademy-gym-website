/* ═══════════════════════════════════════════════
   SCI Physical Academy — Main JS
   ═══════════════════════════════════════════════ */

/* ── Navbar scroll behaviour ── */
const navbar  = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile menu ── */
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const activateLink = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
};

window.addEventListener('scroll', activateLink, { passive: true });

/* ── Scroll-reveal animations ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-animate], [data-animate-left], [data-animate-right]')
  .forEach(el => revealObserver.observe(el));

/* ── Staggered children in grids ── */
document.querySelectorAll('.services-grid, .why-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 60}ms`;
  });
});

/* ── Counter animation ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
      animateCounter(el);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) counterObserver.observe(statsBar);

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── Smooth parallax on hero glows ── */
const glows = document.querySelectorAll('.hero-glow');
if (glows.length) {
  window.addEventListener('mousemove', (e) => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 20;
    const cy = (e.clientY / window.innerHeight - 0.5) * 20;
    glows.forEach((g, i) => {
      const factor = (i + 1) * 0.4;
      g.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
    });
  }, { passive: true });
}
