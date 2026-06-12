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

const DEFAULT_BIOGRAPHY = {
  tagline: "My Background",
  title: "Who I Am & What I Stand For",
  paragraphs: "I am a Lead Full-Stack Engineer based in Chicago, IL, with over 8 years of professional software engineering experience. My technical journey began with building custom CSS layouts and has evolved into orchestrating microservice nodes and constructing robust, enterprise-grade web platforms.\n\nI operate on a simple engineering philosophy: Software must be fast, scalable, and inclusive by design. Many developers treat accessibility (WCAG compliance) as an audit checklist completed at the end of a project. I integrate accessibility into the architectural foundation, using semantic HTML, structured keyboard tab-loops, and logical heading graphs right from the start.",
  processTitle: "My Working Process",
  processText: "I believe in collaborating closely with design teams to translate design tokens into scalable CSS architectures. On the back-end, I focus on clean database indexing, secure authentication middleware, and modular serverless architectures that minimize resource utilization and load times."
};

const DEFAULT_PROFILE = {
  fullName: "Alex Rivers",
  title: "Lead Full-Stack Engineer",
  bioTagline: "My Background",
  bioTitle: "Who I Am & What I Stand For",
  bioParagraphs: "I am a Lead Full-Stack Engineer based in Chicago, IL, with over 8 years of professional software engineering experience. My technical journey began with building custom CSS layouts and has evolved into orchestrating microservice nodes and constructing robust, enterprise-grade web platforms.\n\nI operate on a simple engineering philosophy: Software must be fast, scalable, and inclusive by design. Many developers treat accessibility (WCAG compliance) as an audit checklist completed at the end of a project. I integrate accessibility into the architectural foundation, using semantic HTML, structured keyboard tab-loops, and logical heading graphs right from the start.",
  processTitle: "My Working Process",
  processText: "I believe in collaborating closely with design teams to translate design tokens into scalable CSS architectures. On the back-end, I focus on clean database indexing, secure authentication middleware, and modular serverless architectures that minimize resource utilization and load times.",
  skills: {
    clientSide: ["HTML5 (Semantic Layout)", "CSS3 (Grid, Flexbox, Variable Tokens)", "JavaScript (ES6+)", "TypeScript", "React.js & Next.js", "Tailwind CSS"],
    serverSide: ["Node.js & Express", "REST & GraphQL APIs", "Python (Django / Fast API)", "PostgreSQL", "MongoDB", "AWS Lambda (Serverless)"],
    standards: ["Web Accessibility (WCAG 2.1 AA)", "Jest & Playwright (E2E testing)", "CI/CD (GitHub Actions)", "Git Version Control", "Performance Auditing (Lighthouse)"]
  },
  education: "B.S. in Computer Science - University of Illinois (2013 — 2017)",
  contact: {
    email: "alex@alexrivers.dev",
    location: "Chicago, IL (Open to remote)",
    phone: "+1 (312) 555-0199",
    github: "https://github.com",
    linkedin: "https://linkedin.com"
  }
};

const STORAGE_KEYS = {
  PROJECTS: "portfolio_projects",
  EXPERIENCES: "portfolio_experiences",
  PROFILE_IMAGE: "portfolio_profile_image",
  BIOGRAPHY: "portfolio_biography",
  PROFILE: "portfolio_profile"
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

  getProfileImage() {
    const val = localStorage.getItem(STORAGE_KEYS.PROFILE_IMAGE);
    if (!val || val === "null" || val === "undefined") return "";
    return val;
  },

  saveProfileImage(base64) {
    localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE, base64);
  },

  getBiography() {
    const raw = localStorage.getItem(STORAGE_KEYS.BIOGRAPHY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BIOGRAPHY, JSON.stringify(DEFAULT_BIOGRAPHY));
      return DEFAULT_BIOGRAPHY;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.paragraphs) {
        return DEFAULT_BIOGRAPHY;
      }
      return parsed;
    } catch (e) {
      return DEFAULT_BIOGRAPHY;
    }
  },

  saveBiography(bio) {
    localStorage.setItem(STORAGE_KEYS.BIOGRAPHY, JSON.stringify(bio));
  },

  getProfile() {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return DEFAULT_PROFILE;
      }
      return {
        fullName: parsed.fullName || DEFAULT_PROFILE.fullName,
        title: parsed.title || DEFAULT_PROFILE.title,
        bioTagline: parsed.bioTagline || DEFAULT_PROFILE.bioTagline,
        bioTitle: parsed.bioTitle || DEFAULT_PROFILE.bioTitle,
        bioParagraphs: parsed.bioParagraphs || DEFAULT_PROFILE.bioParagraphs,
        processTitle: parsed.processTitle !== undefined ? parsed.processTitle : DEFAULT_PROFILE.processTitle,
        processText: parsed.processText !== undefined ? parsed.processText : DEFAULT_PROFILE.processText,
        skills: {
          clientSide: (parsed.skills && Array.isArray(parsed.skills.clientSide)) ? parsed.skills.clientSide : DEFAULT_PROFILE.skills.clientSide,
          serverSide: (parsed.skills && Array.isArray(parsed.skills.serverSide)) ? parsed.skills.serverSide : DEFAULT_PROFILE.skills.serverSide,
          standards: (parsed.skills && Array.isArray(parsed.skills.standards)) ? parsed.skills.standards : DEFAULT_PROFILE.skills.standards
        },
        education: parsed.education || DEFAULT_PROFILE.education,
        contact: {
          email: (parsed.contact && parsed.contact.email) ? parsed.contact.email : DEFAULT_PROFILE.contact.email,
          location: (parsed.contact && parsed.contact.location) ? parsed.contact.location : DEFAULT_PROFILE.contact.location,
          phone: (parsed.contact && parsed.contact.phone) ? parsed.contact.phone : DEFAULT_PROFILE.contact.phone,
          github: (parsed.contact && parsed.contact.github) ? parsed.contact.github : DEFAULT_PROFILE.contact.github,
          linkedin: (parsed.contact && parsed.contact.linkedin) ? parsed.contact.linkedin : DEFAULT_PROFILE.contact.linkedin
        }
      };
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(DEFAULT_EXPERIENCES));
    localStorage.setItem(STORAGE_KEYS.BIOGRAPHY, JSON.stringify(DEFAULT_BIOGRAPHY));
    localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  },

  importConfig(config) {
    if (config.projects && Array.isArray(config.projects)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(config.projects));
    }
    if (config.experiences && Array.isArray(config.experiences)) {
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(config.experiences));
    }
    if (config.profileImage) {
      localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE, config.profileImage);
    }
    if (config.biography) {
      localStorage.setItem(STORAGE_KEYS.BIOGRAPHY, JSON.stringify(config.biography));
    }
    if (config.profile) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(config.profile));
    }
  },

  exportConfig() {
    return {
      projects: this.getProjects(),
      experiences: this.getExperiences(),
      profileImage: this.getProfileImage(),
      biography: this.getBiography(),
      profile: this.getProfile()
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
