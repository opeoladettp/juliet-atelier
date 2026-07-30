// JavaScript for Onyeodime Atelier — onyeodimeatelier.com.ng

const FORMSEND_API_KEY = '113a536319929b3fbf6105d2e57f6c96a30a29388d965b6da4ae1a6245926004';
const FORMSEND_ENDPOINT = 'https://api.formsend.ezeroandone.io/submit';

document.addEventListener('DOMContentLoaded', () => {

  /* ───────────────────────────────────────────
     Mobile Navigation
  ─────────────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks   = document.getElementById('nav-links');
  const menuIcon   = menuToggle ? menuToggle.querySelector('span') : null;

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('active');
    if (menuIcon) menuIcon.textContent = 'menu';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuIcon.textContent = isOpen ? 'close' : 'menu';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click / touch
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') &&
          !navLinks.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenu();
    });
  }

  /* ───────────────────────────────────────────
     Contact Form — FormSend API
  ─────────────────────────────────────────── */
  const form       = document.getElementById('consultationForm');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = document.getElementById('submitBtnText');
  const btnLoader  = document.getElementById('submitBtnLoader');

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.textContent  = loading ? 'Sending…' : 'Submit Atelier Request';
    if (loading) {
      btnLoader.classList.remove('hidden');
    } else {
      btnLoader.classList.add('hidden');
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideError() {
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';
  }

  if (form && successMsg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      const name    = document.getElementById('fullName').value.trim();
      const email   = document.getElementById('emailAddress').value.trim();
      const subject = document.getElementById('serviceType').value;
      const message = document.getElementById('notes').value.trim();

      // Basic client-side validation
      if (!name || !email || !message) {
        showError('Please fill in all required fields before submitting.');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(FORMSEND_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: FORMSEND_API_KEY,
            name,
            email,
            subject,
            message,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          form.classList.add('hidden');
          successMsg.classList.remove('hidden');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          showError(data.message || 'Something went wrong. Please try again shortly.');
        }
      } catch {
        showError('Network error — please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    });
  }

  /* ───────────────────────────────────────────
     Parallax (desktop only)
  ─────────────────────────────────────────── */
  const hero           = document.querySelector('.hero');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  let mouseX = 0, mouseY = 0;
  let scrollY = window.pageYOffset;

  function updateParallax() {
    if (window.innerWidth <= 1024) {
      parallaxLayers.forEach(l => (l.style.transform = 'none'));
      return;
    }
    parallaxLayers.forEach(layer => {
      const sSpeed = parseFloat(layer.dataset.speed) || 0.15;
      const mSpeed = parseFloat(layer.dataset.mouseSpeed) || 0.1;
      const yScroll = scrollY * sSpeed;
      const xMouse  = mouseX * 50 * mSpeed;
      const yMouse  = mouseY * 50 * mSpeed;
      layer.style.transform = `translate3d(${xMouse}px, ${yScroll + yMouse}px, 0) scale(1.05)`;
    });
  }

  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / r.width  - 0.5;
      mouseY = (e.clientY - r.top)  / r.height - 0.5;
      updateParallax();
    });

    hero.addEventListener('mouseleave', () => {
      const t0 = performance.now(), sx = mouseX, sy = mouseY, dur = 400;
      const reset = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const e = p * (2 - p);
        mouseX = sx * (1 - e);
        mouseY = sy * (1 - e);
        updateParallax();
        if (p < 1) requestAnimationFrame(reset);
      };
      requestAnimationFrame(reset);
    });
  }

  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    updateParallax();
  }, { passive: true });

  updateParallax();

  /* ───────────────────────────────────────────
     Counter Animation
  ─────────────────────────────────────────── */
  const counters = document.querySelectorAll('.counter-value');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target) || 0;
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1500;
    const t0       = performance.now();

    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      const e = p * (2 - p);
      el.textContent = prefix + Math.floor(e * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    };
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting && target.classList.contains('counter-value') && !target.dataset.animated) {
        target.dataset.animated = 'true';
        animateCounter(target);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(el => observer.observe(el));

});
