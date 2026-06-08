/**
 * Admin Panel Javascript Controller
 * Coordinates: CRUD operations, File encoding/compression, Configuration backups.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check dependency
  if (!window.PortfolioData) {
    console.error("PortfolioData engine not loaded!");
    return;
  }

  // DOM Elements - Lists
  const projectsList = document.getElementById("admin-projects-list");
  const experiencesList = document.getElementById("admin-experiences-list");

  // DOM Elements - Forms
  const projectForm = document.getElementById("admin-project-form");
  const experienceForm = document.getElementById("admin-experience-form");

  // DOM Elements - Backup Panel
  const exportBtn = document.getElementById("btn-export-config");
  const importInput = document.getElementById("import-config-file");
  const resetBtn = document.getElementById("btn-reset-defaults");

  // Status Alerts
  const adminAlertSuccess = document.getElementById("admin-success-alert");
  const adminAlertError = document.getElementById("admin-error-alert");

  // Initialize Lists
  renderAdminProjects();
  renderAdminExperiences();

  /* ==========================================================================
     CRUD - PROJECTS MANAGEMENT
     ========================================================================== */
  function renderAdminProjects() {
    if (!projectsList) return;
    const projects = window.PortfolioData.getProjects();
    projectsList.innerHTML = "";

    if (projects.length === 0) {
      projectsList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem 0;">No projects available. Add a project above or reset to defaults.</p>`;
      return;
    }

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.display = "flex";
      card.style.gap = "1.5rem";
      card.style.alignItems = "center";
      card.style.padding = "1.25rem";
      card.style.marginBottom = "1rem";

      const previewHtml = project.imageUrl 
        ? `<img src="${project.imageUrl}" alt="" style="width: 70px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color);">`
        : `<div style="width: 70px; height: 50px; background: linear-gradient(135deg, var(--bg-tertiary), rgba(var(--accent-primary-rgb), 0.15)); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--accent-primary); border: 1px solid var(--border-color);">Code</div>`;

      card.innerHTML = `
        ${previewHtml}
        <div style="flex-grow: 1;">
          <h4 style="margin-bottom: 0.25rem;">${project.title}</h4>
          <p style="font-size: 0.85rem; margin-bottom: 0; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${project.description}</p>
        </div>
        <button class="btn btn-secondary delete-proj-btn" data-id="${project.id}" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-color: hsl(0, 84%, 60%); color: hsl(0, 84%, 60%);" aria-label="Delete project ${project.title}">
          Delete
        </button>
      `;

      projectsList.appendChild(card);
    });

    // Hook delete events
    const deleteBtns = projectsList.querySelectorAll(".delete-proj-btn");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this project?")) {
          window.PortfolioData.deleteProject(id);
          renderAdminProjects();
          triggerNotification("Project deleted successfully!");
        }
      });
    });
  }

  // Project submission
  if (projectForm) {
    projectForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAdminAlerts();

      const titleInput = document.getElementById("proj-title");
      const descInput = document.getElementById("proj-desc");
      const tagsInput = document.getElementById("proj-tags");
      const githubInput = document.getElementById("proj-github");
      const demoInput = document.getElementById("proj-demo");
      const fileInput = document.getElementById("proj-image");

      if (!titleInput.value.trim() || !descInput.value.trim()) {
        showAdminError("Please fill out the Title and Description fields.");
        return;
      }

      // Convert tags
      const tags = tagsInput.value.split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const newProject = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        tags: tags,
        githubUrl: githubInput.value.trim(),
        demoUrl: demoInput.value.trim(),
        imageUrl: ""
      };

      // Read and compress image if uploaded
      const file = fileInput.files[0];
      if (file) {
        try {
          const base64Raw = await readFileAsBase64(file);
          // Compress image to fit under LocalStorage capacity
          newProject.imageUrl = await window.PortfolioData.compressImage(base64Raw);
        } catch (err) {
          console.error("Image processing error", err);
          showAdminError("Failed to upload image. Please try a different file.");
          return;
        }
      }

      window.PortfolioData.saveProject(newProject);
      projectForm.reset();
      renderAdminProjects();
      showAdminSuccess("Project added successfully!");
    });
  }

  /* ==========================================================================
     CRUD - EXPERIENCE TIMELINE MANAGEMENT
     ========================================================================== */
  function renderAdminExperiences() {
    if (!experiencesList) return;
    const experiences = window.PortfolioData.getExperiences();
    experiencesList.innerHTML = "";

    if (experiences.length === 0) {
      experiencesList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem 0;">No timeline milestones available. Add an experience above or reset to defaults.</p>`;
      return;
    }

    experiences.forEach(exp => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.display = "flex";
      card.style.gap = "1.5rem";
      card.style.alignItems = "center";
      card.style.padding = "1.25rem";
      card.style.marginBottom = "1rem";

      card.innerHTML = `
        <div style="flex-grow: 1;">
          <h4 style="margin-bottom: 0.25rem;">${exp.title} <span style="font-weight: 500; font-size: 0.95rem; color: var(--accent-secondary);">@ ${exp.company}</span></h4>
          <p style="font-size: 0.85rem; margin-bottom: 0; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${exp.description}</p>
        </div>
        <button class="btn btn-secondary delete-exp-btn" data-id="${exp.id}" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-color: hsl(0, 84%, 60%); color: hsl(0, 84%, 60%);" aria-label="Delete job ${exp.title}">
          Delete
        </button>
      `;

      experiencesList.appendChild(card);
    });

    // Hook delete events
    const deleteBtns = experiencesList.querySelectorAll(".delete-exp-btn");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this experience timeline marker?")) {
          window.PortfolioData.deleteExperience(id);
          renderAdminExperiences();
          triggerNotification("Experience record deleted!");
        }
      });
    });
  }

  // Experience submission
  if (experienceForm) {
    experienceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAdminAlerts();

      const titleInput = document.getElementById("exp-title");
      const companyInput = document.getElementById("exp-company");
      const typeInput = document.getElementById("exp-type");
      const dateInput = document.getElementById("exp-date");
      const descInput = document.getElementById("exp-desc");

      if (!titleInput.value.trim() || !companyInput.value.trim() || !dateInput.value.trim() || !descInput.value.trim()) {
        showAdminError("Please fill out all required fields.");
        return;
      }

      const newExp = {
        title: titleInput.value.trim(),
        company: companyInput.value.trim(),
        type: typeInput.value,
        dateRange: dateInput.value.trim(),
        description: descInput.value.trim()
      };

      window.PortfolioData.saveExperience(newExp);
      experienceForm.reset();
      renderAdminExperiences();
      showAdminSuccess("Experience milestone added successfully!");
    });
  }

  /* ==========================================================================
     BACKUP & MAINTENANCE
     ========================================================================== */
  // Export JSON Config
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const data = window.PortfolioData.exportConfig();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `portfolio-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerNotification("Portfolio configuration exported!");
    });
  }

  // Import JSON Config
  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const config = JSON.parse(evt.target.result);
          if (config.projects || config.experiences) {
            window.PortfolioData.importConfig(config);
            renderAdminProjects();
            renderAdminExperiences();
            showAdminSuccess("Portfolio configuration imported successfully!");
            // Refresh fields
            importInput.value = "";
          } else {
            showAdminError("Invalid backup format. Missing projects or experiences variables.");
          }
        } catch (err) {
          console.error("JSON parse error", err);
          showAdminError("Failed to parse backup file. Please ensure it is a valid JSON document.");
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset to Baseline Defaults
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all portfolio records to the baseline templates? This will overwrite custom uploads.")) {
        window.PortfolioData.resetToDefaults();
        renderAdminProjects();
        renderAdminExperiences();
        showAdminSuccess("Portfolio database reset to baseline defaults!");
      }
    });
  }

  /* ==========================================================================
     UTILITIES & HELPERS
     ========================================================================== */
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  function triggerNotification(message) {
    showAdminSuccess(message);
    setTimeout(() => {
      clearAdminAlerts();
    }, 4000);
  }

  function showAdminSuccess(msg) {
    if (!adminAlertSuccess) return;
    adminAlertSuccess.querySelector("div").innerHTML = `<strong>Success:</strong> ${msg}`;
    adminAlertSuccess.style.display = "flex";
    adminAlertError.style.display = "none";
    adminAlertSuccess.focus();
  }

  function showAdminError(msg) {
    if (!adminAlertError) return;
    adminAlertError.querySelector("div").innerHTML = `<strong>Error:</strong> ${msg}`;
    adminAlertError.style.display = "flex";
    adminAlertSuccess.style.display = "none";
    adminAlertError.focus();
  }

  function clearAdminAlerts() {
    if (adminAlertSuccess) adminAlertSuccess.style.display = "none";
    if (adminAlertError) adminAlertError.style.display = "none";
  }
});
