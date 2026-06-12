/**
 * Portfolio Main Javascript Engine
 * Contains: Theme toggling, Accessible Mobile Menu, Active page highlighter, and Scroll-reveal observer.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader(); // Premium overlay loader
  initTheme();
  initMobileMenu();
  highlightActiveLink();
  renderDynamicContent();
  initTiltEffect();
  initBackToTop();
  initCuteCursor();
  initScrollReveal();
  initTwinklingBackground();
  initScrollProgress(); // Header scroll progress indicator
  initSkillsProgress(); // Scroll-triggered skill proficiency bars
  renderProfileImage(); // Render custom uploaded profile photo
  initProfileSystem(); // Unified Personal Profile Management System
});

/* ==========================================================================
   THEME MANAGER (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve saved theme or check system default preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set default theme: prioritize saved selection, fallback to dark theme as default
  let currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'dark');
  
  // Apply theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonAria(themeToggleBtn, currentTheme);

  // Theme change listener
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonAria(themeToggleBtn, newTheme);
  });
}

function updateThemeButtonAria(button, theme) {
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
}

/* ==========================================================================
   ACCESSIBLE MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const header = document.querySelector('.header');
  
  if (!menuToggle || !navLinks) return;

  // Focus trap configurations
  const focusableEls = navLinks.querySelectorAll('a, button');
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];

  function toggleMenu(open) {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = open !== undefined ? open : !isExpanded;

    menuToggle.setAttribute('aria-expanded', shouldOpen.toString());
    navLinks.classList.toggle('open', shouldOpen);

    if (shouldOpen) {
      document.body.style.overflow = 'hidden'; // prevent scrolling behind menu
      firstFocusableEl.focus(); // Shift focus to navigation menu
      
      // Setup focus trap inside active drawer
      navLinks.addEventListener('keydown', trapFocus);
    } else {
      document.body.style.overflow = '';
      menuToggle.focus(); // Restore focus to hamburger button
      navLinks.removeEventListener('keydown', trapFocus);
    }
  }

  // Trap focus helper
  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    }
  }

  // Toggle button click listener
  menuToggle.addEventListener('click', () => toggleMenu());

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickInsideToggle = menuToggle.contains(e.target);
    if (!isClickInsideMenu && !isClickInsideToggle && navLinks.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Header styling when scrolled
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   ACTIVE PAGE HIGH LIGHTER
   ========================================================================== */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  const footerLinks = document.querySelectorAll('.footer-nav-link');

  function matchLink(links) {
    let matched = false;
    links.forEach(link => {
      // Get filename from href
      const hrefAttr = link.getAttribute('href');
      if (!hrefAttr) return;
      
      // Check if href matches ending of pathname
      const isIndex = (currentPath === '/' || currentPath.endsWith('index.html')) && hrefAttr.includes('index.html');
      const isMatch = currentPath.endsWith(hrefAttr) || (currentPath.includes(hrefAttr.replace('.html', '')) && hrefAttr !== 'index.html');

      if (isIndex || isMatch) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        matched = true;
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
    return matched;
  }

  // Fallback to Home if nothing matches
  const pageMatched = matchLink(navLinks);
  matchLink(footerLinks);

  if (!pageMatched && navLinks.length > 0) {
    // default to index if path doesn't match directly (e.g. root workspace local folders)
    const homeLink = Array.from(navLinks).find(link => link.getAttribute('href').includes('index.html'));
    if (homeLink) {
      homeLink.classList.add('active');
      homeLink.setAttribute('aria-current', 'page');
    }
  }
}

/* ==========================================================================
   SCROLL REVEAL EFFECT (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it fully rolls into viewport
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Browser fallback
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   PORTFOLIO DYNAMIC CONTENT INJECTOR
   ========================================================================== */
function renderDynamicContent() {
  const featuredGrid = document.getElementById("featured-projects-grid");
  const allProjectsGrid = document.getElementById("all-projects-grid");
  const timelineContainer = document.getElementById("experience-timeline-container");

  // Render Featured Projects on Index
  if (featuredGrid && window.PortfolioData) {
    const projects = window.PortfolioData.getProjects().slice(0, 3);
    if (projects.length > 0) {
      featuredGrid.innerHTML = projects.map(p => renderProjectCard(p)).join("");
    }
  }

  // Render All Projects on Projects Catalog
  if (allProjectsGrid && window.PortfolioData) {
    const projects = window.PortfolioData.getProjects();
    if (projects.length > 0) {
      allProjectsGrid.innerHTML = projects.map(p => renderProjectCard(p)).join("");
    }
  }

  // Render Experience Timeline on About
  if (timelineContainer && window.PortfolioData) {
    const exps = window.PortfolioData.getExperiences();
    if (exps.length > 0) {
      timelineContainer.innerHTML = exps.map(e => renderExperienceItem(e)).join("");
    }
  }

}

function renderProjectCard(project) {
  const tagsHtml = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join("");
  const previewHtml = project.imageUrl 
    ? `<img src="${project.imageUrl}" alt="Visual preview of the ${project.title} application" class="project-image" loading="lazy">`
    : `<div class="project-image" style="background: linear-gradient(135deg, var(--bg-tertiary), rgba(var(--accent-primary-rgb), 0.12)); display: flex; align-items: center; justify-content: center; height: 100%;">
         <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="opacity: 0.6;">
           <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
           <polyline points="2 17 12 22 22 17"></polyline>
           <polyline points="2 12 12 17 22 12"></polyline>
         </svg>
       </div>`;

  const githubHtml = project.githubUrl 
    ? `<a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener" aria-label="View ${project.title} repository on GitHub">
         <span>GitHub</span>
         <svg width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0 9 18.13V22"></path></svg>
       </a>`
    : "";

  const demoHtml = project.demoUrl 
    ? `<a href="${project.demoUrl}" class="project-link" target="_blank" rel="noopener" aria-label="Open live demo of ${project.title}">
         <span>Live Demo</span>
         <svg width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
       </a>`
    : "";

  const detailsHtml = `
    <a href="projects.html" class="project-link" aria-label="Read details about ${project.title} project">
      <span>Details</span>
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </a>`;

  return `
    <article class="card project-card reveal">
      <div class="project-image-wrapper">
        ${previewHtml}
      </div>
      <div class="project-tags">
        ${tagsHtml}
      </div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <div class="project-links">
        ${githubHtml}
        ${demoHtml || detailsHtml}
      </div>
    </article>
  `;
}

function renderExperienceItem(exp) {
  return `
    <article class="timeline-item reveal">
      <div class="timeline-marker" aria-hidden="true"></div>
      <div class="timeline-date">${exp.dateRange}</div>
      <h3 class="timeline-title">${exp.title}</h3>
      <div class="timeline-company">${exp.company} • ${exp.type}</div>
      <p>${exp.description}</p>
    </article>
  `;
}

/* ==========================================================================
   3D CARD TILT & SHINE EFFECT
   ========================================================================== */
function initTiltEffect() {
  const cards = document.querySelectorAll(".card, .sidebar-aside");

  cards.forEach(card => {
    // Skip on small touch viewports to avoid tap bugs
    if (window.innerWidth < 768) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      // Mouse coords relative to card center
      const mouseX = e.clientX - rect.left - cardWidth / 2;
      const mouseY = e.clientY - rect.top - cardHeight / 2;

      // Degree calculation (max 6 degrees for smooth subtle rotation)
      const rotateX = -(mouseY / (cardHeight / 2)) * 6;
      const rotateY = (mouseX / (cardWidth / 2)) * 6;

      // Mouse coordinate overrides for the custom radial-gradient CSS
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = "transform 0.05s ease-out";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease-out";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });
}

/* ==========================================================================
   ACCESSIBLE SMOOTH BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  // Check if button already exists
  if (document.getElementById("back-to-top")) return;

  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top of page");
  btn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    // Accessibility focus reset
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
      skipLink.focus();
    }
  });
}

/* ==========================================================================
   CUTE DYNAMIC CURSOR & SPARKLE GLITTER TRAIL
   ========================================================================== */
function initCuteCursor() {
  // Prevent custom cursor on non-desktop touch screens
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  // We only create the follower ring, as we normalized the cursor (showing default mouse pointer)
  const follower = document.createElement("div");
  follower.className = "custom-cursor-follower";
  follower.innerHTML = '<div class="follower-ring" aria-hidden="true"></div>';

  document.body.appendChild(follower);

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  
  let lastSpawnTime = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Spawn glitter particles with throttling (max 1 particle per 40ms)
    const now = Date.now();
    if (now - lastSpawnTime > 40) {
      createGlitter(mouseX, mouseY, false);
      lastSpawnTime = now;
    }
  });

  // Burst of sparkles on click!
  document.addEventListener("mousedown", (e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    
    // Spawn 10 to 12 particles in a satisfying burst dispersion
    const burstCount = Math.floor(Math.random() * 3) + 10;
    for (let i = 0; i < burstCount; i++) {
      createGlitter(e.clientX, e.clientY, true);
    }
    
    // Shrink the outer ring briefly to give a tactile click feedback
    follower.classList.add("clicked");
    setTimeout(() => {
      follower.classList.remove("clicked");
    }, 150);
  });

  // Smooth follow animation for the outer ring using frame interpolation
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  // Hook interactive hover states dynamically for all links and buttons
  function refreshHoverHooks() {
    const interactiveElements = document.querySelectorAll("a, button, input, textarea, select, .card, .logo, .theme-toggle, .contact-social-btn, .project-card, .btn");
    interactiveElements.forEach(el => {
      // Avoid duplicate event attachments
      if (el.dataset.hasCursorHook) return;
      el.dataset.hasCursorHook = "true";

      el.addEventListener("mouseenter", () => {
        follower.classList.add("hovered");
      });
      el.addEventListener("mouseleave", () => {
        follower.classList.remove("hovered");
      });
    });
  }

  // Initial hook binding
  refreshHoverHooks();

  // Re-hook dynamic elements when dynamic database is updated / re-rendered
  const featuredGrid = document.getElementById("featured-projects-grid");
  const allProjectsGrid = document.getElementById("all-projects-grid");
  const timelineContainer = document.getElementById("experience-timeline-container");
  
  if (featuredGrid || allProjectsGrid || timelineContainer) {
    const observer = new MutationObserver(() => {
      refreshHoverHooks();
    });
    if (featuredGrid) observer.observe(featuredGrid, { childList: true, subtree: true });
    if (allProjectsGrid) observer.observe(allProjectsGrid, { childList: true, subtree: true });
    if (timelineContainer) observer.observe(timelineContainer, { childList: true, subtree: true });
  }

  // Clean hide/show cursor when mouse leaves or enters window frame
  document.addEventListener("mouseleave", () => {
    follower.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    follower.style.opacity = "1";
  });
}

function createGlitter(x, y, isBurst = false) {
  const particle = document.createElement("div");
  particle.className = "glitter-particle";
  
  // A colorful assortment of sparkles, stars, flowers, hearts, and bubbles
  const symbols = isBurst 
    ? ["⭐", "✨", "🌸", "💎", "💖", "💛", "💜", "✨", "🌈", "🍭", "🎀"]
    : ["⭐", "✨", "🌸", "✨", "💎", "💖"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  particle.textContent = symbol;

  // Particle sizes (larger pop for bursts, cute trailing sizes for movement)
  const size = isBurst 
    ? Math.random() * 14 + 10  // between 10px and 24px
    : Math.random() * 10 + 6;   // between 6px and 16px
  particle.style.fontSize = `${size}px`;

  // Random drift vector
  const angle = Math.random() * Math.PI * 2;
  const distance = isBurst 
    ? Math.random() * 75 + 35  // further dispersion for click bursts
    : Math.random() * 30 + 10;  // close trailing drift
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;
  const rot = Math.random() * 360 - 180;

  // Set particle starting coordinates
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  // Custom properties passed to keyframes animation
  particle.style.setProperty("--dx", `${dx}px`);
  particle.style.setProperty("--dy", `${dy}px`);
  particle.style.setProperty("--rot", `${rot}deg`);

  // Randomized animation timings for natural-looking fading decay
  const duration = isBurst 
    ? Math.random() * 0.4 + 0.6  // 0.6s to 1.0s
    : Math.random() * 0.3 + 0.5;  // 0.5s to 0.8s
  particle.style.animationDuration = `${duration}s`;

  // Apply a cute, glowing neon drop-shadow matching dynamic pastel colors
  const glowColors = ["#ff79c6", "#8be9fd", "#50fa7b", "#f1fa8c", "#bd93f9", "#ffb86c", "#ff9ff3", "#feca57"];
  const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];
  particle.style.filter = `drop-shadow(0 0 5px ${glowColor})`;

  document.body.appendChild(particle);

  // Clean up element after animation finishes
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, duration * 1000);
}

/* ==========================================================================
   TWINKLING BACKGROUND SPARKLES GENERATOR
   ========================================================================== */
function initTwinklingBackground() {
  // Select main background sections
  const sections = document.querySelectorAll("section, .hero-grid, .footer");
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const area = rect.width * (rect.height || 500);
    // Spawn roughly 1 sparkle per 80,000 square pixels, bounded between 3 and 8 per section
    const sparkleCount = Math.min(Math.max(Math.round(area / 80000), 3), 8);
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      sparkle.setAttribute("class", "bg-sparkle");
      sparkle.setAttribute("viewBox", "0 0 24 24");
      sparkle.setAttribute("aria-hidden", "true");
      
      // Random coordinates
      const left = Math.random() * 90 + 5; // keep 5% padding boundaries
      const top = Math.random() * 90 + 5;
      sparkle.style.left = `${left}%`;
      sparkle.style.top = `${top}%`;
      
      // Random scale and animation delay
      const size = Math.random() * 8 + 6; // 6px to 14px
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      
      const delay = Math.random() * 5; // 0s to 5s delay to offset stars twinkling
      sparkle.style.animationDelay = `${delay}s`;
      
      // Alternate colors: primary, secondary, and soft gold
      const colors = ["var(--accent-primary)", "var(--accent-secondary)", "hsl(45, 100%, 65%)"];
      const fill = colors[Math.floor(Math.random() * colors.length)];
      
      sparkle.innerHTML = `<path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" fill="${fill}" />`;
      
      // Ensure the section is positioned relatively to bound absolute coords
      const computedStyle = window.getComputedStyle(section);
      if (computedStyle.position === "static") {
        section.style.position = "relative";
      }
      
      section.appendChild(sparkle);
    }
  });
}

/* ==========================================================================
   DYNAMIC PREMIUM PAGE LOADER
   ========================================================================== */
function initPageLoader() {
  const loader = document.createElement("div");
  loader.id = "page-loader";
  loader.className = "page-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-logo">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </div>
      <div class="loader-spinner" aria-hidden="true"></div>
    </div>
  `;
  document.body.prepend(loader);

  // Fade out loader once everything is ready
  window.addEventListener("load", () => {
    loader.classList.add("loaded");
    setTimeout(() => {
      loader.remove();
    }, 600);
  });

  // Safety fallback in case loading stalls (limit to 1.5 seconds)
  setTimeout(() => {
    if (loader.parentNode) {
      loader.classList.add("loaded");
      setTimeout(() => loader.remove(), 600);
    }
  }, 1500);
}

/* ==========================================================================
   HEADER SCROLL PROGRESS BAR INDICATOR
   ========================================================================== */
function initScrollProgress() {
  const header = document.querySelector(".header");
  if (!header) return;

  const container = document.createElement("div");
  container.className = "scroll-progress-container";
  container.setAttribute("aria-hidden", "true");
  
  const bar = document.createElement("div");
  bar.id = "scroll-progress-bar";
  bar.className = "scroll-progress-bar";
  
  container.appendChild(bar);
  header.appendChild(container);

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${progress}%`;
  });
}

/* ==========================================================================
   ANIMATED CORE SKILLS PROFICIENCY BARS
   ========================================================================== */
function initSkillsProgress() {
  const skillBars = document.querySelectorAll(".skill-progress-bar-fill");
  if (skillBars.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetPercent = bar.getAttribute("data-progress");
          bar.style.width = targetPercent;
          obs.unobserve(bar); // Trigger animation once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -20px 0px"
    });

    skillBars.forEach(bar => observer.observe(bar));
  } else {
    // Immediate fallback
    skillBars.forEach(bar => {
      bar.style.width = bar.getAttribute("data-progress");
    });
  }
}

/* ==========================================================================
   RENDER CUSTOM BIO PROFILE IMAGE
   ========================================================================== */
function renderProfileImage() {
  if (!window.PortfolioData) return;
  const base64 = window.PortfolioData.getProfileImage();
  const photos = document.querySelectorAll(".about-photo");
  const deleteBtn = document.getElementById("btn-photo-delete-under");
  
  if (base64) {
    photos.forEach(img => {
      img.src = base64;
    });
    if (deleteBtn) deleteBtn.style.display = "block";
  } else {
    photos.forEach(img => {
      img.src = "assets/images/profile.png?t=" + Date.now();
    });
    if (deleteBtn) deleteBtn.style.display = "none";
  }
}



/* ==========================================================================
   TOAST SYSTEM
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconSvg = type === 'success' 
    ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-message">${message}</div>
  `;

  container.appendChild(toast);

  // Trigger entering animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove toast after 4s
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 400);
  }, 4000);
}

/* ==========================================================================
   PERSONAL PROFILE MANAGEMENT SYSTEM
   ========================================================================== */
function initProfileSystem() {
  if (!window.PortfolioData) return;
  const profile = window.PortfolioData.getProfile();

  // 1. Update Logo Branding across all pages
  const logoSpans = document.querySelectorAll('.logo span');
  logoSpans.forEach(span => {
    span.textContent = profile.fullName;
  });

  // 2. Update Footer Copyright across all pages
  const footerCopyright = document.querySelector('.footer-copyright');
  if (footerCopyright) {
    footerCopyright.innerHTML = `&copy; 2026 ${profile.fullName}. All rights reserved. Conforms to WCAG 2.1 AA accessibility guidelines.`;
  }

  // 3. Update Home Page Intro if present
  const heroLead = document.querySelector('.hero-content .lead');
  if (heroLead) {
    heroLead.innerHTML = `Hi, I'm <strong>${profile.fullName}</strong>. A ${profile.title} dedicated to building clean, fast, and fully WCAG-compliant digital experiences that look premium and scale effectively.`;
  }

  // 4. Update About Page Profile display
  const aboutViewSection = document.getElementById('about-profile-view');
  if (aboutViewSection) {
    // View Mode Display Elements
    const displayName = document.getElementById('card-profile-name');
    const displayTitle = document.getElementById('card-profile-title');
    const displayContactList = document.getElementById('card-profile-contact');
    const displayEducation = document.getElementById('display-education-text');
    const displaySkillsTags = document.getElementById('display-skills-tags-container');
    const displayBioTagline = document.getElementById('display-bio-tagline');
    const displayBioTitle = document.getElementById('display-bio-title');
    const displayBioParagraphs = document.getElementById('display-bio-paragraphs');
    const displayProcessTitle = document.getElementById('display-process-title');
    const displayProcessText = document.getElementById('display-process-text');

    // Render View Mode DOM
    function renderProfileDOM() {
      const currentProfile = window.PortfolioData.getProfile();
      
      if (displayName) displayName.textContent = currentProfile.fullName;
      if (displayTitle) displayTitle.textContent = currentProfile.title;
      if (displayEducation) displayEducation.textContent = currentProfile.education;
      
      // Render Contact
      if (displayContactList) {
        displayContactList.innerHTML = `
          <li class="profile-card-contact-item" aria-label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <a href="mailto:${currentProfile.contact.email}">${currentProfile.contact.email}</a>
          </li>
          <li class="profile-card-contact-item" aria-label="Location">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${currentProfile.contact.location}</span>
          </li>
        `;
        if (currentProfile.contact.phone) {
          displayContactList.innerHTML += `
            <li class="profile-card-contact-item" aria-label="Phone">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:${currentProfile.contact.phone}">${currentProfile.contact.phone}</a>
            </li>
          `;
        }
        if (currentProfile.contact.github) {
          displayContactList.innerHTML += `
            <li class="profile-card-contact-item" aria-label="GitHub URL">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              <a href="${currentProfile.contact.github}" target="_blank" rel="noopener">GitHub Profile</a>
            </li>
          `;
        }
        if (currentProfile.contact.linkedin) {
          displayContactList.innerHTML += `
            <li class="profile-card-contact-item" aria-label="LinkedIn URL">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <a href="${currentProfile.contact.linkedin}" target="_blank" rel="noopener">LinkedIn Profile</a>
            </li>
          `;
        }
      }

      // Render Skills Tags
      if (displaySkillsTags) {
        const allSkills = [
          ...currentProfile.skills.clientSide,
          ...currentProfile.skills.serverSide,
          ...currentProfile.skills.standards
        ];
        displaySkillsTags.innerHTML = allSkills.map(s => `<span class="project-tag" style="font-size: 0.75rem; margin-right: 0.15rem; margin-bottom: 0.15rem;">${s}</span>`).join("");
      }

      // Render Bio Text
      if (displayBioTagline) displayBioTagline.textContent = currentProfile.bioTagline;
      if (displayBioTitle) displayBioTitle.textContent = currentProfile.bioTitle;
      if (displayBioParagraphs) {
        const pArray = currentProfile.bioParagraphs.split('\n\n').filter(p => p.trim());
        displayBioParagraphs.innerHTML = pArray.map(p => `<p>${p}</p>`).join("");
      }
      const cardProcess = document.getElementById('card-profile-process');
      const hasProcess = currentProfile.processTitle || currentProfile.processText;
      if (cardProcess) {
        cardProcess.style.display = hasProcess ? "block" : "none";
      }

      if (displayProcessTitle && currentProfile.processTitle) {
        const titleSpan = displayProcessTitle.querySelector('span');
        if (titleSpan) {
          titleSpan.textContent = currentProfile.processTitle;
        } else {
          displayProcessTitle.textContent = currentProfile.processTitle;
        }
        displayProcessTitle.style.display = "flex";
      } else if (displayProcessTitle) {
        displayProcessTitle.style.display = "none";
      }
      if (displayProcessText && currentProfile.processText) {
        displayProcessText.textContent = currentProfile.processText;
        displayProcessText.style.display = "block";
      } else if (displayProcessText) {
        displayProcessText.style.display = "none";
      }

      // Render Skills lists on index.html if we are on that page
      const indexSkillsLists = document.querySelectorAll('.skills-list');
      if (indexSkillsLists.length >= 3) {
        indexSkillsLists[0].innerHTML = currentProfile.skills.clientSide.map(s => `<li class="skill-tag">${s}</li>`).join("");
        indexSkillsLists[1].innerHTML = currentProfile.skills.serverSide.map(s => `<li class="skill-tag">${s}</li>`).join("");
        indexSkillsLists[2].innerHTML = currentProfile.skills.standards.map(s => `<li class="skill-tag">${s}</li>`).join("");
      }
    }

    // Initial render
    renderProfileDOM();
  }
}
