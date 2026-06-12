/**
 * Admin Panel Javascript Controller
 * Coordinates: CRUD operations, File encoding/compression, Configuration backups,
 * Tabbed dashboard navigation, and Profile Settings management.
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

  // DOM Elements - Forms & CRUD
  const projectForm = document.getElementById("admin-project-form");
  const experienceForm = document.getElementById("admin-experience-form");

  // DOM Elements - Backup Panel
  const exportBtn = document.getElementById("btn-export-config");
  const importInput = document.getElementById("import-config-file");
  const resetBtn = document.getElementById("btn-reset-defaults");

  // Status Alerts
  const adminAlertSuccess = document.getElementById("admin-success-alert");
  const adminAlertError = document.getElementById("admin-error-alert");

  // DOM Elements - Dashboard Tabs
  const tabButtons = document.querySelectorAll(".profile-edit-tabs .tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // DOM Elements - Profile Settings Inputs
  const adminFullName = document.getElementById("admin-full-name");
  const adminProTitle = document.getElementById("admin-pro-title");
  const adminBioTagline = document.getElementById("admin-bio-tagline");
  const adminBioTitle = document.getElementById("admin-bio-title");
  const adminBioParagraphs = document.getElementById("admin-bio-paragraphs");
  const adminProcessTitle = document.getElementById("admin-process-title");
  const adminProcessText = document.getElementById("admin-process-text");
  const adminSkillsClient = document.getElementById("admin-skills-client");
  const adminSkillsServer = document.getElementById("admin-skills-server");
  const adminSkillsStandards = document.getElementById("admin-skills-standards");
  const adminEducation = document.getElementById("admin-education");
  const adminEmail = document.getElementById("admin-email");
  const adminLocation = document.getElementById("admin-location");
  const adminPhone = document.getElementById("admin-phone");
  const adminGithub = document.getElementById("admin-github");
  const adminLinkedin = document.getElementById("admin-linkedin");

  const saveProfileBtn = document.getElementById("btn-admin-save-profile");

  // Photo elements
  const photoInput = document.getElementById("admin-photo-file-input");
  const photoPreview = document.getElementById("admin-photo-preview");
  const photoDeleteBtn = document.getElementById("btn-admin-photo-delete");

  // Local draft state for image upload
  let draftProfileImage = "";

  // Initialize Lists & Inputs
  renderAdminProjects();
  renderAdminExperiences();
  populateProfileFields();
  initTabbedNavigation();
  initPhotoEditor();

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", saveProfileSettings);
  }

  /* ==========================================================================
     DASHBOARD TABBED NAVIGATION
     ========================================================================== */
  function initTabbedNavigation() {
    if (tabButtons.length === 0) return;

    function switchTab(tabId) {
      tabButtons.forEach(btn => {
        if (btn.getAttribute("aria-controls") === tabId) {
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
        } else {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        }
      });

      tabContents.forEach(content => {
        if (content.id === tabId) {
          content.style.display = "block";
          content.classList.add("active");
        } else {
          content.style.display = "none";
          content.classList.remove("active");
        }
      });
    }

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("aria-controls");
        switchTab(targetId);
        clearAdminAlerts();
      });
    });

    // Keyboard navigation for accessibility
    const tabList = document.querySelector(".profile-edit-tabs");
    if (tabList) {
      tabList.addEventListener("keydown", (e) => {
        const activeTab = document.activeElement;
        if (!activeTab || !activeTab.classList.contains("tab-btn")) return;

        let targetTab = null;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const tabArray = Array.from(tabButtons);
          const activeIndex = tabArray.indexOf(activeTab);

          if (e.key === "ArrowRight") {
            targetTab = tabArray[(activeIndex + 1) % tabArray.length];
          } else if (e.key === "ArrowLeft") {
            targetTab = tabArray[(activeIndex - 1 + tabArray.length) % tabArray.length];
          }

          if (targetTab) {
            targetTab.focus();
            switchTab(targetTab.getAttribute("aria-controls"));
            e.preventDefault();
          }
        }
      });
    }
  }

  /* ==========================================================================
     PROFILE SETTINGS FORM LOADER & SAVE
     ========================================================================== */
  function populateProfileFields() {
    const profile = window.PortfolioData.getProfile();
    draftProfileImage = window.PortfolioData.getProfileImage();

    // Populate values
    if (adminFullName) adminFullName.value = profile.fullName;
    if (adminProTitle) adminProTitle.value = profile.title;
    if (adminBioTagline) adminBioTagline.value = profile.bioTagline;
    if (adminBioTitle) adminBioTitle.value = profile.bioTitle;
    if (adminBioParagraphs) adminBioParagraphs.value = profile.bioParagraphs;
    if (adminProcessTitle) adminProcessTitle.value = profile.processTitle || "";
    if (adminProcessText) adminProcessText.value = profile.processText || "";

    if (adminEmail) adminEmail.value = profile.contact.email;
    if (adminLocation) adminLocation.value = profile.contact.location;
    if (adminPhone) adminPhone.value = profile.contact.phone || "";
    if (adminGithub) adminGithub.value = profile.contact.github || "";
    if (adminLinkedin) adminLinkedin.value = profile.contact.linkedin || "";

    if (adminEducation) adminEducation.value = profile.education || "";

    if (adminSkillsClient) adminSkillsClient.value = (profile.skills && profile.skills.clientSide) ? profile.skills.clientSide.join(", ") : "";
    if (adminSkillsServer) adminSkillsServer.value = (profile.skills && profile.skills.serverSide) ? profile.skills.serverSide.join(", ") : "";
    if (adminSkillsStandards) adminSkillsStandards.value = (profile.skills && profile.skills.standards) ? profile.skills.standards.join(", ") : "";

    // Sync image preview
    syncImagePreview();
  }

  function syncImagePreview() {
    if (!photoPreview) return;
    if (draftProfileImage) {
      photoPreview.src = draftProfileImage;
      if (photoDeleteBtn) photoDeleteBtn.style.display = "block";
    } else {
      photoPreview.src = "assets/images/profile.png?t=" + Date.now();
      if (photoDeleteBtn) photoDeleteBtn.style.display = "none";
    }
  }

  function initPhotoEditor() {
    if (!photoInput) return;

    photoInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showAdminError("Please select a valid image file.");
        photoInput.value = "";
        return;
      }

      try {
        const base64Raw = await readFileAsBase64(file);
        // Compress image to fit under LocalStorage capacity limits
        draftProfileImage = await window.PortfolioData.compressImage(base64Raw, 400, 400, 0.85);
        syncImagePreview();
        showAdminSuccess("Photo loaded into draft. Click 'Save Profile Settings' below to apply.");
      } catch (err) {
        console.error("Profile image upload error:", err);
        showAdminError("Failed to process profile image. Try a smaller size.");
      } finally {
        photoInput.value = "";
      }
    });

    if (photoDeleteBtn) {
      photoDeleteBtn.addEventListener("click", () => {
        draftProfileImage = "";
        syncImagePreview();
        showAdminSuccess("Photo cleared from draft. Click 'Save Profile Settings' below to apply.");
      });
    }
  }

  function saveProfileSettings() {
    clearAdminAlerts();

    // Required fields validation
    const errors = [];
    const nameVal = adminFullName ? adminFullName.value.trim() : "";
    const titleVal = adminProTitle ? adminProTitle.value.trim() : "";
    const taglineVal = adminBioTagline ? adminBioTagline.value.trim() : "";
    const bioTitleVal = adminBioTitle ? adminBioTitle.value.trim() : "";
    const bioParasVal = adminBioParagraphs ? adminBioParagraphs.value.trim() : "";
    const emailVal = adminEmail ? adminEmail.value.trim() : "";
    const locationVal = adminLocation ? adminLocation.value.trim() : "";
    const educationVal = adminEducation ? adminEducation.value.trim() : "";

    // Reset validations
    const inputs = document.querySelectorAll(".tab-content .form-input, .tab-content .form-textarea");
    inputs.forEach(el => el.removeAttribute("aria-invalid"));

    if (!nameVal) { errors.push("Full Name is required."); adminFullName.setAttribute("aria-invalid", "true"); }
    if (!titleVal) { errors.push("Professional Title is required."); adminProTitle.setAttribute("aria-invalid", "true"); }
    if (!taglineVal) { errors.push("Biography Tagline is required."); adminBioTagline.setAttribute("aria-invalid", "true"); }
    if (!bioTitleVal) { errors.push("Biography Headline is required."); adminBioTitle.setAttribute("aria-invalid", "true"); }
    if (!educationVal) { errors.push("Education details are required."); adminEducation.setAttribute("aria-invalid", "true"); }
    if (!bioParasVal) { errors.push("Biography paragraphs are required."); adminBioParagraphs.setAttribute("aria-invalid", "true"); }

    if (!emailVal) {
      errors.push("Email Address is required.");
      if (adminEmail) adminEmail.setAttribute("aria-invalid", "true");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        errors.push("Please enter a valid email address.");
        if (adminEmail) adminEmail.setAttribute("aria-invalid", "true");
      }
    }

    if (!locationVal) {
      errors.push("Location is required.");
      if (adminLocation) adminLocation.setAttribute("aria-invalid", "true");
    }

    // URL validations
    const githubVal = adminGithub ? adminGithub.value.trim() : "";
    const linkedinVal = adminLinkedin ? adminLinkedin.value.trim() : "";
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    if (githubVal && !urlRegex.test(githubVal)) {
      errors.push("Please enter a valid URL for GitHub Profile.");
      if (adminGithub) adminGithub.setAttribute("aria-invalid", "true");
    }
    if (linkedinVal && !urlRegex.test(linkedinVal)) {
      errors.push("Please enter a valid URL for LinkedIn Profile.");
      if (adminLinkedin) adminLinkedin.setAttribute("aria-invalid", "true");
    }

    if (errors.length > 0) {
      showAdminError(`
        <strong>Validation failed:</strong>
        <ul style="margin-top: 0.5rem; padding-left: 1.25rem; list-style: disc;">
          ${errors.map(msg => `<li>${msg}</li>`).join("")}
        </ul>
      `);
      return;
    }

    // Parse skills
    const clientSkills = adminSkillsClient ? adminSkillsClient.value.split(",").map(s => s.trim()).filter(Boolean) : [];
    const serverSkills = adminSkillsServer ? adminSkillsServer.value.split(",").map(s => s.trim()).filter(Boolean) : [];
    const standardsSkills = adminSkillsStandards ? adminSkillsStandards.value.split(",").map(s => s.trim()).filter(Boolean) : [];

    const updatedProfile = {
      fullName: nameVal,
      title: titleVal,
      bioTagline: taglineVal,
      bioTitle: bioTitleVal,
      bioParagraphs: bioParasVal,
      processTitle: adminProcessTitle ? adminProcessTitle.value.trim() : "",
      processText: adminProcessText ? adminProcessText.value.trim() : "",
      skills: {
        clientSide: clientSkills,
        serverSide: serverSkills,
        standards: standardsSkills
      },
      education: educationVal,
      contact: {
        email: emailVal,
        location: locationVal,
        phone: adminPhone ? adminPhone.value.trim() : "",
        github: githubVal,
        linkedin: linkedinVal
      }
    };

    // Save profile configurations
    window.PortfolioData.saveProfile(updatedProfile);
    window.PortfolioData.saveProfileImage(draftProfileImage);

    // Refresh logo headings inside admin page immediately
    const currentSpans = document.querySelectorAll('.logo span');
    currentSpans.forEach(span => {
      span.textContent = updatedProfile.fullName;
    });

    const currentFooter = document.querySelector('.footer-copyright');
    if (currentFooter) {
      currentFooter.innerHTML = `&copy; 2026 ${updatedProfile.fullName}. All rights reserved. Conforms to WCAG 2.1 AA accessibility guidelines.`;
    }

    showAdminSuccess("Biography and Personal Profile settings saved successfully!");
  }

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
      card.style.flexWrap = "wrap";
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
        .filter(Boolean);

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
      card.style.flexWrap = "wrap";
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
          if (config.projects || config.experiences || config.profile) {
            window.PortfolioData.importConfig(config);
            renderAdminProjects();
            renderAdminExperiences();
            populateProfileFields();
            showAdminSuccess("Portfolio configuration imported successfully!");
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
        populateProfileFields();
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
