// JavaScript Logic for Onyeodime Atelier

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Hero Carousel Control
  const prevSlide = document.getElementById('prevSlide');
  const nextSlide = document.getElementById('nextSlide');
  const slideIndexEl = document.getElementById('slideIndex');
  const progressBar = document.getElementById('progressBar');
  const heroImage = document.getElementById('heroImage');
  const heroTextCard = document.getElementById('heroTextCard');

  const slides = [
    {
      index: '01',
      progress: '50%',
      text: 'Blending indigenous textile techniques with structured contemporary tailoring. Onyeodime Atelier specializes in bespoke menswear and womenswear, custom-crafted utilizing hand-dyed indigo Adire and hand-woven Aso-Oke.',
      filter: 'grayscale(100%)'
    },
    {
      index: '02',
      progress: '100%',
      text: 'Every garment tells a story of West African identity. We collaborate directly with weaver guilds in Iseyin and master dyers at the Nike Art Gallery to secure premium, authentic hand-crafted raw materials.',
      filter: 'grayscale(30%) sepia(20%)'
    }
  ];

  let currentSlide = 0;

  function updateSlide(dir) {
    if (dir === 'next') {
      currentSlide = (currentSlide + 1) % slides.length;
    } else {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    const slide = slides[currentSlide];
    
    // Animate text transition
    heroTextCard.style.opacity = 0;
    heroImage.style.opacity = 0.5;
    
    setTimeout(() => {
      slideIndexEl.textContent = slide.index;
      progressBar.style.width = slide.progress;
      heroTextCard.querySelector('p').textContent = slide.text;
      heroImage.style.filter = slide.filter;
      
      heroTextCard.style.opacity = 1;
      heroImage.style.opacity = 1;
    }, 250);
  }

  if (prevSlide && nextSlide) {
    prevSlide.addEventListener('click', () => updateSlide('prev'));
    nextSlide.addEventListener('click', () => updateSlide('next'));
  }

  // Fitting Form submission simulation
  const fittingForm = document.getElementById('fittingForm');
  const successMsg = document.getElementById('successMsg');

  if (fittingForm && successMsg) {
    fittingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value;
      const email = document.getElementById('clientEmail').value;

      if (name && email) {
        fittingForm.classList.add('hidden');
        successMsg.classList.remove('hidden');
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
        
        layer.style.transform = `translate3d(${xOffsetMouse}px, ${yOffsetScroll + yOffsetMouse}px, 0) scale(1.1)`;
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


