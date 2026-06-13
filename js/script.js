// JavaScript Logic for Juliet Onyanta Atelier

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Toggle menu icon
      const icon = menuToggle.querySelector('span');
      if (icon.textContent === 'menu') {
        icon.textContent = 'close';
      } else {
        icon.textContent = 'menu';
      }
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('span');
        icon.textContent = 'menu';
      });
    });
  }

  // Appointment Form Simulation
  const form = document.getElementById('consultationForm');
  const successMsg = document.getElementById('formSuccess');

  if (form && successMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform validation
      const name = document.getElementById('fullName').value;
      const email = document.getElementById('emailAddress').value;
      
      if (name && email) {
        // Hide form and show success message with animation
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
        
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Robust Combined Scroll & Mousemove Parallax System
  const hero = document.querySelector('.hero');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = window.pageYOffset || document.documentElement.scrollTop;

  function updateParallax() {
    if (window.innerWidth > 1024) {
      parallaxLayers.forEach(layer => {
        const speedScroll = parseFloat(layer.getAttribute('data-speed')) || 0.15;
        const speedMouse = parseFloat(layer.getAttribute('data-mouse-speed')) || 0.1;
        
        const yOffsetScroll = scrollY * speedScroll;
        const xOffsetMouse = mouseX * 50 * speedMouse; // 50px max travel
        const yOffsetMouse = mouseY * 50 * speedMouse;
        
        layer.style.transform = `translate3d(${xOffsetMouse}px, ${yOffsetScroll + yOffsetMouse}px, 0) scale(1.05)`;
      });
    } else {
      parallaxLayers.forEach(layer => {
        layer.style.transform = 'none';
      });
    }
  }

  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      updateParallax();
    });

    hero.addEventListener('mouseleave', () => {
      const startTime = performance.now();
      const startX = mouseX;
      const startY = mouseY;
      const duration = 400;

      const resetPos = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress);
        
        mouseX = startX * (1 - ease);
        mouseY = startY * (1 - ease);
        
        updateParallax();
        if (progress < 1) {
          requestAnimationFrame(resetPos);
        }
      };
      requestAnimationFrame(resetPos);
    });
  }

  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    updateParallax();
  });

  // Initial update
  updateParallax();

  // Statistics Animations
  const countUpElements = document.querySelectorAll('.counter-value');

  // Counter animation logic
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress); // OutQuad easing
      const current = Math.floor(ease * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    };
    requestAnimationFrame(updateCount);
  };

  // Setup Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // Trigger counter
        if (el.classList.contains('counter-value') && !el.classList.contains('animated')) {
          el.classList.add('animated');
          animateCounter(el);
        }
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // Observe statistics numbers
  countUpElements.forEach(el => animationObserver.observe(el));
});

