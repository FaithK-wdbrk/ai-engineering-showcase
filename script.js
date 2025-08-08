// Mobile menu toggle
const menuToggleButton = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggleButton && navMenu) {
  menuToggleButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
  
  // Close on link click (mobile UX)
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggleButton.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Animate skill bars when visible
const skillProgressBars = document.querySelectorAll('.skill-progress');
if (skillProgressBars.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const level = parseInt(el.getAttribute('data-level') || '0', 10);
          el.style.width = Math.max(0, Math.min(level, 100)) + '%';
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillProgressBars.forEach((bar) => observer.observe(bar));
}

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}