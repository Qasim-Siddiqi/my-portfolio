/* ================================================
   SCROLL REVEAL OBSERVER INIT
   ================================================ */
(function () {
  'use strict';

  /* ---- Page Loader ---- */
  const pageLoader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 1600);
  });

  /* ---- Scroll Progress Bar ---- */
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });

  /* ---- Custom Cursor ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state
  const hoverTargets = document.querySelectorAll('a, button, .etag, .project-row, .service-item, .pillar');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ---- Navigation ---- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });

  /* ---- Smooth scroll for nav links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.reveal-item');
        items.forEach(item => item.classList.add('revealed'));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // Also observe standalone reveal items not inside data-reveal parents
  const standaloneRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        standaloneRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-item:not([data-reveal] .reveal-item)').forEach(el => {
    standaloneRevealObserver.observe(el);
  });

  /* ---- Hero auto-reveal (in viewport on load) ---- */
  setTimeout(() => {
    const heroReveal = document.querySelector('.hero [data-reveal]');
    if (heroReveal) {
      heroReveal.querySelectorAll('.reveal-item').forEach(item => item.classList.add('revealed'));
    }
    const heroPortrait = document.querySelector('.hero-portrait[data-reveal]');
    if (heroPortrait) {
      heroPortrait.querySelectorAll('.reveal-item').forEach(item => item.classList.add('revealed'));
    }
    // Scroll indicator
    document.querySelectorAll('.scroll-indicator.reveal-item').forEach(el => el.classList.add('revealed'));
  }, 300);

  /* ---- Parallax on portrait ---- */
  const parallaxImg = document.getElementById('parallaxImg');
  if (parallaxImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.08;
      parallaxImg.style.transform = `translateY(${rate}px)`;
    }, { passive: true });
  }

  /* ---- Magnetic Buttons ---- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  /* ---- Animated word cycling in differentiator ---- */
  const diffWords = document.querySelectorAll('.diff-word');
  const wordSets = [
    ['BUILD', 'CODE', 'ENGINEER'],
    ['SELL', 'MARKET', 'GROW'],
  ];
  let wIdx = 0;
  setInterval(() => {
    wIdx = (wIdx + 1) % 3;
    diffWords.forEach((w, i) => {
      w.style.opacity = '0';
      w.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        w.textContent = wordSets[i][wIdx];
        w.style.opacity = '1';
        w.style.transform = 'translateY(0)';
      }, 200);
    });
  }, 3000);

  diffWords.forEach(w => {
    w.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

  /* ---- Services Accordion Toggle ---- */
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');
      // If user clicks currently open item, toggle it closed.
      // Otherwise close other items and open this one.
      serviceItems.forEach(other => other.classList.remove('active'));
      if (!isCurrentlyActive) {
        item.classList.add('active');
      }
    });
  });

  /* ---- Looping Typewriter Effect for Hero ---- */
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const textToType = "HI, I am Qasim Siddiqi";
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 60;
    const pauseEnd = 2400;
    const pauseStart = 600;

    function typeLoop() {
      if (!isDeleting) {
        typewriterElement.textContent = textToType.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === textToType.length) {
          isDeleting = true;
          setTimeout(typeLoop, pauseEnd);
          return;
        }
        setTimeout(typeLoop, typingSpeed);
      } else {
        typewriterElement.textContent = textToType.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          setTimeout(typeLoop, pauseStart);
          return;
        }
        setTimeout(typeLoop, deletingSpeed);
      }
    }
    // Start after loader finishes
    setTimeout(typeLoop, 1400);
  }

})();
