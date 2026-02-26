/**
 * js/main.js — Alex Morgan Portfolio
 * Handles: navbar scroll, hamburger menu, typing animation,
 *          scroll-reveal, count-up stats, skill bar animation,
 *          project filter, testimonials carousel, contact form.
 */

(function () {
  'use strict';

  /* ── Navbar scroll effect ────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load

  /* ── Active nav link on scroll ───────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = Array.from(navLinks).map(l =>
    document.getElementById(l.dataset.section)
  );

  function setActiveNavLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec && sec.offsetTop <= scrollMid) current = sec;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === (current && current.id));
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  setActiveNavLink();

  /* ── Hamburger menu ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  /* ── Typing animation ────────────────────────────────────── */
  const typingEl = document.getElementById('typingText');
  const phrases  = [
    'Full Stack Web Developer',
    'UI/UX Enthusiast',
    'Open Source Contributor',
    'Performance Optimiser',
  ];
  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let typingTimer;

  function type() {
    const phrase = phrases[phraseIdx];
    if (isDeleting) {
      typingEl.textContent = phrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingEl.textContent = phrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 60 : 110;

    if (!isDeleting && charIdx === phrase.length) {
      delay = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    typingTimer = setTimeout(type, delay);
  }

  type();

  /* ── Floating hero particles ─────────────────────────────── */
  const heroParticles = document.getElementById('heroParticles');
  const PARTICLE_COUNT = 25;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 20;
    const dur   = Math.random() * 15 + 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
      opacity: 0;
    `;
    heroParticles.appendChild(p);
  }

  /* ── Intersection Observer for scroll-reveal ─────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Count-up animation ──────────────────────────────────── */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const numEl  = entry.target.querySelector('.stat-number');
        const target = parseInt(numEl.dataset.target, 10);
        animateCounter(numEl, target, 1800);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-card').forEach(el => counterObserver.observe(el));

  /* ── Skill bar animation ─────────────────────────────────── */
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill  = entry.target.querySelector('.skill-fill');
        const width = fill.dataset.width;
        // Delay slightly so reveal animation completes first
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
        skillObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

  /* ── Portfolio filter ────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          card.classList.remove('hidden');
          // Trigger reveal for newly visible cards
          requestAnimationFrame(() => card.classList.add('visible'));
        } else {
          card.classList.add('hidden');
          card.classList.remove('visible');
        }
      });
    });
  });

  /* ── Testimonials carousel ───────────────────────────────── */
  const track = document.getElementById('testimonialsTrack');
  const dots  = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let autoPlayTimer;

  function goToSlide(idx) {
    currentSlide = idx;
    track.style.transform = `translateX(calc(-${idx * 100}% ))`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
      dot.setAttribute('aria-pressed', String(i === idx));
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoPlayTimer);
      goToSlide(parseInt(dot.dataset.index, 10));
      startAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide((currentSlide + 1) % dots.length);
    }, 5000);
  }

  // Pause on hover/focus
  const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
  testimonialsWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  testimonialsWrapper.addEventListener('mouseleave', startAutoPlay);
  testimonialsWrapper.addEventListener('focusin',    () => clearInterval(autoPlayTimer));
  testimonialsWrapper.addEventListener('focusout',   startAutoPlay);

  // Keyboard navigation
  testimonialsWrapper.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      clearInterval(autoPlayTimer);
      goToSlide((currentSlide - 1 + dots.length) % dots.length);
      startAutoPlay();
    } else if (e.key === 'ArrowRight') {
      clearInterval(autoPlayTimer);
      goToSlide((currentSlide + 1) % dots.length);
      startAutoPlay();
    }
  });

  goToSlide(0);
  startAutoPlay();

  /* ── Contact form validation ─────────────────────────────── */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  function showError(input, msg) {
    const group = input.closest('.form-group');
    const err   = group.querySelector('.form-error');
    input.style.borderColor = 'var(--error)';
    err.textContent = msg;
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    const err   = group.querySelector('.form-error');
    input.style.borderColor = '';
    err.textContent = '';
  }

  function validateInput(input) {
    const val = input.value.trim();
    if (!val) {
      showError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(val)) {
        showError(input, 'Please enter a valid email address.');
        return false;
      }
    }
    clearError(input);
    return true;
  }

  // Live validation on blur
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.style.borderColor === 'var(--error)') validateInput(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs  = Array.from(form.querySelectorAll('.form-input'));
    const allValid = inputs.every(inp => validateInput(inp));

    if (!allValid) return;

    // Simulate async submission
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      form.reset();
      inputs.forEach(inp => clearError(inp));
      formSuccess.hidden = false;
      formSuccess.focus();
      setTimeout(() => { formSuccess.hidden = true; }, 6000);
    }, 1500);
  });

  /* ── Footer year ─────────────────────────────────────────── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
