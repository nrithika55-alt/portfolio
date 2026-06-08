/**
 * Portfolio Data Engine
 * Manages local database sync using LocalStorage, including image compression.
 * Contains extremely detailed, realistic default developer data models.
 */

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Aura Flow",
    description: "A real-time workspace collaborative analytical dashboard designed with fully responsive glassmorphism UI layouts. Built using React.js and HTML5/CSS3 custom variables. Implements WebSocket protocol to coordinate state changes between user sessions with sub-15ms sync speeds. Powered by a Node.js microservice architecture and MongoDB data layers, it handles up to 5,000 concurrent metrics updates per second.",
    tags: ["React.js", "WebSockets", "Node.js", "CSS Modules"],
    githubUrl: "https://github.com/alexrivers/aura-flow",
    demoUrl: "https://auraflow.alexrivers.dev",
    imageUrl: "assets/images/aura-flow.png"
  },
  {
    id: "proj-2",
    title: "AccessSync Engine",
    description: "An automated site auditing tool validating HTML pages against WCAG 2.1 AA guidelines. Operates as a Node.js background process, utilizing Headless Puppeteer to traverse DOM nodes and audit them against color contrast algorithms and focus ring accessibility checks. Outputs machine-readable JSON reports detailing exactly which nodes lack proper ARIA labeling or trap keyboard navigation.",
    tags: ["Vanilla JS", "Node.js", "Puppeteer", "Axe-Core"],
    githubUrl: "https://github.com/alexrivers/accesssync-engine",
    demoUrl: "",
    imageUrl: "assets/images/access-sync.png"
  },
  {
    id: "proj-3",
    title: "EcoSphere API",
    description: "A high-performance serverless microservice offering global carbon footprint and environmental telemetry data. Designed with Express.js and deployed on AWS Lambda with PostgreSQL. Features customized database index layouts and query execution plans that optimize response times down to 35ms under peak loads of 1.2 million daily requests.",
    tags: ["Express.js", "PostgreSQL", "AWS Lambda", "Serverless"],
    githubUrl: "https://github.com/alexrivers/ecosphere-api",
    demoUrl: "",
    imageUrl: "assets/images/ecosphere.png"
  },
  {
    id: "proj-4",
    title: "Apex Design System",
    description: "A fully semantic, WCAG-compliant design system library. Standardizes color tokens with custom CSS variables, includes accessible keyboard focus rings, responsive typography scales, and modular Web Component button systems. Exceeds standard contrast requirements and secures a perfect score on accessibility validation checks.",
    tags: ["HTML5", "CSS3", "Custom Properties", "Web Components"],
    githubUrl: "https://github.com/alexrivers/apex-design-system",
    demoUrl: "",
    imageUrl: ""
  },
  {
    id: "proj-5",
    title: "Nebula Store",
    description: "A lightweight and lightning-fast e-commerce shopping platform focusing on mobile-first grid scalability. Integrates custom Service Workers for offline asset caching, offline product browsing, and seamless synchronization. Uses CSS Grid and Flexbox to deliver a smooth shopping experience across mobile viewports down to 320px.",
    tags: ["Vanilla JS", "CSS Grid", "Service Worker", "LocalStorage"],
    githubUrl: "https://github.com/alexrivers/nebula-store",
    demoUrl: "",
    imageUrl: ""
  },
  {
    id: "proj-6",
    title: "Quantum Tasks",
    description: "An offline-first personal task manager prioritizing keyboard-navigable operations. Configured with focus trap containers and logical screen-reader focus tracking, mapping tasks directly to the browser's local client IndexedDB database nodes for 100% offline functionality.",
    tags: ["HTML5", "Vanilla JS", "IndexedDB", "PWA"],
    githubUrl: "https://github.com/alexrivers/quantum-tasks",
    demoUrl: "",
    imageUrl: ""
  }
];

const DEFAULT_EXPERIENCES = [
  {
    id: "exp-1",
    title: "Lead Software Engineer",
    company: "WebScale Dynamics",
    type: "Full-Time",
    dateRange: "2023 — Present",
    description: "Directing architectural designs for client-facing analytics panels and SaaS interfaces. Leading a team of 6 engineers to refactor legacy codebases into a semantic Web Component system, resulting in a 34% increase in user retention, 98% browser accessibility rating, and reducing dashboard latency by 45% through custom SQL index refactoring."
  },
  {
    id: "exp-2",
    title: "Senior Front-End Developer",
    company: "AccessFlow",
    type: "Full-Time",
    dateRange: "2020 — 2023",
    description: "Designed accessible user interfaces for a high-traffic online banking application, ensuring full WCAG 2.1 AA compatibility and screen reader support. Created automated accessibility auditing tools using Node.js and Axe-core, helping 12 development teams identify and resolve color contrast issues and keyboard traps before deployment."
  },
  {
    id: "exp-3",
    title: "Full-Stack Engineer",
    company: "PixelCraft Studios",
    type: "Full-Time",
    dateRange: "2017 — 2020",
    description: "Developed responsive websites and RESTful backend APIs for retail brands. Managed database migrations in PostgreSQL, built secure login middleware utilizing JWT tokens, and automated software deployment builds using GitHub Actions CI/CD pipelines."
  }
];

const STORAGE_KEYS = {
  PROJECTS: "portfolio_projects",
  EXPERIENCES: "portfolio_experiences"
};

// Database Accessor Methods
const PortfolioData = {
  getProjects() {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      // Initialize with defaults if empty
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(raw);
  },

  saveProject(project) {
    const projects = this.getProjects();
    if (project.id) {
      // Edit existing
      const idx = projects.findIndex(p => p.id === project.id);
      if (idx !== -1) projects[idx] = project;
    } else {
      // Add new
      project.id = "proj-" + Date.now();
      projects.push(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return project;
  },

  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
  },

  getExperiences() {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(DEFAULT_EXPERIENCES));
      return DEFAULT_EXPERIENCES;
    }
    return JSON.parse(raw);
  },

  saveExperience(exp) {
    const exps = this.getExperiences();
    if (exp.id) {
      const idx = exps.findIndex(e => e.id === exp.id);
      if (idx !== -1) exps[idx] = exp;
    } else {
      exp.id = "exp-" + Date.now();
      exps.push(exp);
    }
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(exps));
    return exp;
  },

  deleteExperience(id) {
    const exps = this.getExperiences();
    const filtered = exps.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(filtered));
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(DEFAULT_EXPERIENCES));
  },

  importConfig(config) {
    if (config.projects && Array.isArray(config.projects)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(config.projects));
    }
    if (config.experiences && Array.isArray(config.experiences)) {
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(config.experiences));
    }
  },

  exportConfig() {
    return {
      projects: this.getProjects(),
      experiences: this.getExperiences()
    };
  },

  // Helper: Resize and Compress Base64 Images (to prevent LocalStorage quota limits)
  compressImage(base64Str, maxWidth = 600, maxHeight = 400, quality = 0.7) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Apply scale constraints
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed jpeg data url
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => {
        resolve(base64Str); // Fallback to original if load fails
      };
    });
  }
};

// Expose globally for browser scripts
window.PortfolioData = PortfolioData;
