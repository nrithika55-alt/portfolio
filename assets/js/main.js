/**
 * Portfolio Main Javascript Engine
 * Contains: Theme toggling, Accessible Mobile Menu, Active page highlighter, and Scroll-reveal observer.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  highlightActiveLink();
  renderDynamicContent();
  initTiltEffect();
  initBackToTop();
  initScrollReveal();
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
