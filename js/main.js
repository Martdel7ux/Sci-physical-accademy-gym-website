/* ═══════════════════════════════════════════════
   SCI Physical Academy — Main JS
   ═══════════════════════════════════════════════ */

/* ── Today indicator on opening hours ── */
const todayNum = new Date().getDay(); // 0=Sun, 1=Mon … 6=Sat
document.querySelectorAll('.hours-row[data-days]').forEach(row => {
  const days = row.dataset.days.split(',').map(Number);
  if (days.includes(todayNum)) row.classList.add('is-today');
});

/* ── Navbar scroll behaviour ── */
const navbar      = document.getElementById('navbar');
const navToggle   = document.getElementById('navToggle');
const navLinks    = document.getElementById('navLinks');
const navDropdown = document.getElementById('navDropdown');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile dropdown menu ── */
function openDropdown() {
  navDropdown.classList.add('open');
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navDropdown.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDropdown() {
  navDropdown.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navDropdown.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  navDropdown.classList.contains('open') ? closeDropdown() : openDropdown();
});

/* Close when a dropdown link is tapped */
navDropdown.querySelectorAll('.nav-dropdown-link').forEach(link => {
  link.addEventListener('click', closeDropdown);
});

/* Close on outside click */
document.addEventListener('click', (e) => {
  if (navDropdown.classList.contains('open') &&
      !navbar.contains(e.target)) {
    closeDropdown();
  }
});

/* Close on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navDropdown.classList.contains('open')) {
    closeDropdown();
    navToggle.focus();
  }
});

/* ── Active nav link on scroll ── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link, .nav-dropdown-link');

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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animSelector = '[data-animate], [data-animate-left], [data-animate-right], [data-animate-scale], [data-animate-fade]';

/* Apply data-delay as a CSS custom property before observing */
document.querySelectorAll(animSelector).forEach(el => {
  const delay = el.dataset.delay;
  if (delay) el.style.setProperty('--anim-delay', delay + 'ms');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (prefersReducedMotion) {
      el.classList.add('visible');
    } else {
      /* Use data-delay if present, otherwise trigger immediately */
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('visible'), delay);
    }
    revealObserver.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll(animSelector).forEach(el => revealObserver.observe(el));

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

/* ── Services Flipper ── */
const flipper = document.getElementById('servicesFlipper');
if (flipper) {
  const flipCards = flipper.querySelectorAll('.flip-card');

  flipCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      flipCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      flipper.classList.add('has-active');
    });
  });

  flipper.addEventListener('mouseleave', () => {
    flipCards.forEach(c => c.classList.remove('active'));
    flipper.classList.remove('has-active');
  });

  /* Touch: tap to expand, tap again to collapse */
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      if (window.innerWidth > 800) return;
      const isActive = card.classList.contains('active');
      flipCards.forEach(c => c.classList.remove('active'));
      flipper.classList.remove('has-active');
      if (!isActive) {
        card.classList.add('active');
        flipper.classList.add('has-active');
      }
    });
  });
}

/* ── Language switcher ── */
(function () {
  const langBtns = document.querySelectorAll('.lang-btn');

  function getCookieLang() {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]+)/);
    return (match && match[1] !== 'en') ? match[1] : 'en';
  }

  function setActiveLang(lang) {
    langBtns.forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function clearTranslateCookies() {
    const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'googtrans=; ' + expiry + '; path=/';
    document.cookie = 'googtrans=; ' + expiry + '; path=/; domain=' + location.hostname;
    document.cookie = 'googtrans=; ' + expiry + '; path=/; domain=.' + location.hostname;
  }

  function switchLang(lang) {
    if (lang === 'en') {
      /* Restoring original requires clearing the cookie and reloading */
      clearTranslateCookies();
      window.location.reload();
      return;
    }

    /* Switch to Greek via Google's internal combo */
    const trySwitch = (attempts = 0) => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
        setActiveLang(lang);
      } else if (attempts < 20) {
        setTimeout(() => trySwitch(attempts + 1), 300);
      }
    };
    trySwitch();
  }

  /* Reflect persisted language on page load */
  setActiveLang(getCookieLang());

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      switchLang(btn.dataset.lang);
    });
  });
}());

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
