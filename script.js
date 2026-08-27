/* =========================================================
   Infosoft — Interactions & Animations
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Sticky nav shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.classList.toggle('is-active', isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Fade-in on scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Card cursor-tracked glow ---------- */
  const glowCards = document.querySelectorAll('.card');

  glowCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ---------- Smooth in-page anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const isSamePageHash = href.startsWith('#');
    if (!isSamePageHash) return;

    link.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Active nav link highlighting on scroll (index only) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href*="#"]');

  if (sections.length && navAnchorLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchorLinks.forEach((link) => {
              const linkHash = link.getAttribute('href').split('#')[1];
              link.classList.toggle('active', linkHash === id);
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Button ripple micro-interaction ---------- */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.position = 'absolute';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255,255,255,0.35)';
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '0.6';
      ripple.style.pointerEvents = 'none';
      ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';

      this.style.position = this.style.position || 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2.4)';
        ripple.style.opacity = '0';
      });

      setTimeout(() => ripple.remove(), 650);
    });
  });
})();
