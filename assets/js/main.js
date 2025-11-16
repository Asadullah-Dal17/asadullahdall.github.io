document.addEventListener('DOMContentLoaded', () => {
  // =====================
  // Dark Mode Toggle
  // =====================
  const toggleBtn = document.getElementById('darkModeToggle');
  const icon = document.getElementById('darkModeIcon');
  const nav = document.querySelector('.nav');

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedPref = localStorage.getItem('darkMode');

  function setDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    if (icon) {
      icon.className = on ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem('darkMode', on);
    if (nav) {
      nav.style.background = on ? 'rgba(10, 10, 10, 0.95)' : 'rgba(252, 249, 245, 0.95)';
    }
  }

  if (toggleBtn) {
    if (storedPref === null) {
      setDarkMode(prefersDark);
    } else {
      setDarkMode(storedPref === 'true');
    }

    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      setDarkMode(!isDark);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    });
  } else {
    console.warn('Dark mode toggle element (#darkModeToggle) not found.');
  }

  // =====================
  // Typing Animation
  // =====================
  const typingElement = document.querySelector('.typing-animation');
  if (typingElement) {
    let strings = typingElement.dataset.strings;
    try {
      strings = JSON.parse(strings);
    } catch {
      strings = ['Portfolio Website'];
    }
    let currentString = 0,
      charIndex = 0,
      isDeleting = false;
    function type() {
      const fullTxt = strings[currentString];
      typingElement.innerHTML = `<span class="typed-text">${fullTxt.substring(0, charIndex)}</span><span class="blinking-caret">|</span>`;
      const caret = typingElement.querySelector('.blinking-caret');
      if (caret) {
        caret.style.animation = 'blink-caret 0.75s step-end infinite';
      }
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      if (!isDeleting && charIndex > fullTxt.length) {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 1200);
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        currentString = (currentString + 1) % strings.length;
        setTimeout(type, 400);
      } else {
        setTimeout(type, isDeleting ? 60 : 120);
      }
    }
    setTimeout(type, 600);
  } else {
    console.warn('Typing animation element (.typing-animation) not found.');
  }

  // =====================
  // Project Filtering
  // =====================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  } else {
    console.warn('No .filter-btn elements found for project filtering.');
  }

  // =====================
  // Smooth Scrolling
  // =====================
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');
        document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
        
        // Scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active nav link
        updateActiveNavLink(targetId);
      }
    });
  });

  // Update active navigation link on scroll
  function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      }
    });
  }

  // Track scroll position and update active nav link
  window.addEventListener('scroll', () => {
    let currentSection = '';
    
    // Get all sections
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // =====================
  // Mobile Menu Toggle
  // =====================
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  } else {
    console.warn('Mobile menu elements (.menu-toggle or .nav-links) not found.');
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // =====================
  // Contact Form
  // =====================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const budgetRange = document.getElementById('budgetRange');
    const budgetValue = document.getElementById('budgetValue');
    if (budgetRange && budgetValue) {
      budgetRange.addEventListener('input', () => {
        budgetValue.textContent = budgetRange.value;
      });
    } else {
      console.warn('Budget slider elements (#budgetRange or #budgetValue) not found.');
    }

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields');
        return;
      }
      console.log('Form submitted:', data);
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success';
      successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Thank you for your message! I will get back to you soon.</p>
      `;
      contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
      contactForm.reset();
      setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => successMsg.remove(), 300);
      }, 3000);
    });
  } else {
    console.warn('Contact form (#contactForm) not found.');
  }

  // =====================
  // Project Demo Modal
  // =====================
  const demoModal = document.querySelector('.project-demo-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const demoLinks = document.querySelectorAll('.project-link.demo');
  if (demoModal && closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      demoModal.style.display = 'none';
      const videoContainer = demoModal.querySelector('.video-container');
      if (videoContainer) videoContainer.innerHTML = '';
    });
    demoModal.addEventListener('click', e => {
      if (e.target === demoModal) {
        demoModal.style.display = 'none';
        const videoContainer = demoModal.querySelector('.video-container');
        if (videoContainer) videoContainer.innerHTML = '';
      }
    });
    if (demoLinks.length > 0) {
      demoLinks.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const projectCard = link.closest('.project-card');
          if (!projectCard) return;
          const projectTitle = projectCard.querySelector('.project-title')?.textContent || 'Project Demo';
          const projectDescription = projectCard.querySelector('.project-description')?.textContent || '';
          const demoUrl = link.getAttribute('href');
          const githubLink = projectCard.querySelector('.project-link.code')?.getAttribute('href') || '#';
          demoModal.querySelector('.demo-title').textContent = projectTitle;
          demoModal.querySelector('.demo-description').textContent = projectDescription;
          const githubLinkElement = demoModal.querySelector('#demo-github-link');
          if (githubLinkElement) githubLinkElement.setAttribute('href', githubLink);
          const videoUrl = demoUrl.includes('youtube.com') ? demoUrl.replace('watch?v=', 'embed/') : demoUrl;
          const videoContainer = demoModal.querySelector('.video-container');
          if (videoContainer) {
            videoContainer.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
          }
          demoModal.style.display = 'block';
        });
      });
    } else {
      console.warn('No demo links (.project-link.demo) found.');
    }
  } else {
    console.warn('Project modal elements (.project-demo-modal or .close-modal) not found.');
  }

  // =====================
  // Skills Animation
  // =====================
  const skillMeters = document.querySelectorAll('.skill-meter');
  if (skillMeters.length > 0) {
    if (!('IntersectionObserver' in window)) {
      skillMeters.forEach(meter => meter.classList.add('active'));
      console.warn('IntersectionObserver not supported, using fallback animation.');
    } else {
      const skillsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.2,
        }
      );
      skillMeters.forEach((meter, index) => {
        // Calculate delay based on position within category
        const category = meter.closest('.skill-category');
        const metersInCategory = category.querySelectorAll('.skill-meter');
        const categoryIndex = Array.from(document.querySelectorAll('.skill-category')).indexOf(category);
        const meterIndex = Array.from(metersInCategory).indexOf(meter);
        const baseDelay = categoryIndex * 0.4; // Base delay from category
        const delay = baseDelay + meterIndex * 0.1; // Incremental delay within category
        meter.style.setProperty('--delay', `${delay}s`);
        skillsObserver.observe(meter);
      });
      console.log('Skills observer initialized');
    }
  } else {
    console.warn('No .skill-meter elements found in the DOM.');
  }

  // =====================
  // Metrics Counter
  // =====================
  const animateCounters = () => {
    const counters = document.querySelectorAll('.metric-value');
    const speed = 200;
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      let count = +counter.innerText || 0;
      const increment = target / speed;
      const updateCount = () => {
        if (count < target) {
          count = Math.min(count + increment, target);
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  const checkCounters = () => {
    const metricsSection = document.getElementById('metrics');
    if (metricsSection) {
      const metricsPosition = metricsSection.getBoundingClientRect().top;
      const screenPosition = window.innerHeight * 0.8;
      if (metricsPosition < screenPosition) {
        animateCounters();
        window.removeEventListener('scroll', checkCounters);
      }
    }
  };

  // =====================
  // Scroll Animations
  // =====================
  const animatedElements = document.querySelectorAll('.slide-up, .fade-in, .scale-in');
  if (animatedElements.length > 0) {
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      if (el.classList.contains('slide-up')) {
        el.style.transform = 'translateY(30px)';
      } else if (el.classList.contains('scale-in')) {
        el.style.transform = 'scale(0.8)';
      }
    });
    const animationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.style.getPropertyValue('--delay') || '0s';
            el.style.animationDelay = delay;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
            observer.unobserve(el);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    animatedElements.forEach(el => animationObserver.observe(el));
  }

  // =====================
  // FAQ Accordion
  // =====================
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  } else {
    console.warn('No .faq-item elements found.');
  }

  // =====================
  // Nav Link Hover Effects
  // =====================
  const navLinkElements = document.querySelectorAll('.nav-link');
  if (navLinkElements.length > 0) {
    navLinkElements.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const span = link.querySelector('span');
        if (span) {
          span.style.transform = 'translateX(3px)';
        }
      });
      link.addEventListener('mouseleave', () => {
        const span = link.querySelector('span');
        if (span && !link.classList.contains('active')) {
          span.style.transform = 'translateX(0)';
        }
      });
    });
  } else {
    console.warn('No .nav-link elements found.');
  }

  // =====================
  // Tool Icon Animations
  // =====================
  const toolIcons = document.querySelectorAll('.tool-icon');
  if (toolIcons.length > 0) {
    toolIcons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        const title = icon.getAttribute('title');
        if (title) {
          const iconElement = icon.querySelector('i');
          if (iconElement) {
            switch (title) {
              case 'Python':
                iconElement.style.animation = 'spinIcon 0.8s';
                break;
              case 'OpenCV':
                iconElement.style.animation = 'pulseIcon 0.7s';
                break;
              case 'MediaPipe':
                iconElement.style.animation = 'floatIcon 1s infinite alternate';
                break;
              case 'TensorFlow':
                iconElement.style.animation = 'pulseIcon 0.7s infinite alternate';
                break;
              case 'PyTorch':
                iconElement.style.animation = 'flameIcon 0.6s infinite alternate';
                break;
            }
          }
        }
      });
      icon.addEventListener('mouseleave', () => {
        const iconElement = icon.querySelector('i');
        if (iconElement) {
          iconElement.style.animation = '';
        }
      });
    });
  } else {
    console.warn('No .tool-icon elements found.');
  }

  // =====================
  // Initialize Animations
  // =====================
  window.addEventListener('load', () => {
    checkCounters();
  });
  window.addEventListener('scroll', checkCounters);

  // Form submission handler
  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      const formData = new FormData(form);
      
      // Using FormSubmit.co (free service - no backend needed)
      const response = await fetch('https://formsubmit.co/ajax/asadullah92c@gmail.com', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        form.reset();
        
        // Reset after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error! Try again';
      submitBtn.disabled = false;
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 3000);
    }
  });

  // Budget slider display
  document.getElementById('budgetRange')?.addEventListener('input', (e) => {
    document.getElementById('budgetValue').textContent = e.target.value;
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});