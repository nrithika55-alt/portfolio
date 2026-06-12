/**
 * Portfolio Contact Form Validation Module
 * Standard: WCAG 2.1 AA Compliant Accessibility Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const formFields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => value.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).'
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => {
        if (!value.trim()) return 'Please enter your email address.';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim()) ? '' : 'Please enter a valid email address (e.g., name@example.com).';
      }
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subject-error'),
      validate: (value) => value.trim().length >= 4 ? '' : 'Please enter a subject (at least 4 characters).'
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => value.trim().length >= 10 ? '' : 'Please enter a message (at least 10 characters).'
    }
  };

  const successAlert = document.getElementById('form-success-alert');
  const errorAlert = document.getElementById('form-error-alert');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitText = submitButton ? submitButton.querySelector('.btn-text') : null;

  // Real-time validation on blur and input typing
  Object.keys(formFields).forEach(key => {
    const field = formFields[key];
    
    if (field.input) {
      // Validate on blur (focus loss)
      field.input.addEventListener('blur', () => {
        validateField(field);
      });

      // Clear error states on input change if they correct it
      field.input.addEventListener('input', () => {
        if (field.input.getAttribute('aria-invalid') === 'true') {
          const errorMessage = field.validate(field.input.value);
          if (!errorMessage) {
            clearFieldError(field);
          }
        }
      });
    }
  });

  // Helper: Validate a single field
  function validateField(field) {
    const errorMessage = field.validate(field.input.value);
    const parent = field.input.closest('.form-group');

    if (errorMessage) {
      field.input.setAttribute('aria-invalid', 'true');
      field.input.setAttribute('aria-describedby', field.error.id);
      field.error.textContent = errorMessage;
      if (parent) parent.classList.add('has-error');
      return false;
    } else {
      clearFieldError(field);
      return true;
    }
  }

  // Helper: Clear a single field's error
  function clearFieldError(field) {
    const parent = field.input.closest('.form-group');
    field.input.removeAttribute('aria-invalid');
    field.input.removeAttribute('aria-describedby');
    if (parent) parent.classList.remove('has-error');
    field.error.textContent = '';
  }

  // Handle Form Submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset alert states
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';

    let firstInvalidInput = null;
    let isFormValid = true;

    // Validate all fields
    Object.keys(formFields).forEach(key => {
      const field = formFields[key];
      const isValid = validateField(field);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = field.input;
        }
      }
    });

    if (!isFormValid) {
      // Trigger overall error notice
      errorAlert.style.display = 'flex';
      
      // Accessibility best practice: Set focus back to first invalid input
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // If valid, simulate contact submission API call
    submitFormMock();
  });

  // Mock API post handler
  function submitFormMock() {
    // Enter Loading State
    if (submitButton) {
      submitButton.disabled = true;
      if (submitText) submitText.textContent = 'Sending Message...';
    }

    setTimeout(() => {
      // Exit Loading State
      if (submitButton) {
        submitButton.disabled = false;
        if (submitText) submitText.textContent = 'Send Message';
      }

      // Display Success Alert
      successAlert.style.display = 'flex';
      
      // Accessibility best practice: Set focus on success alert so it is read out immediately
      successAlert.focus();
      
      // Clear form
      contactForm.reset();
      
      // Clear all error aria tags
      Object.keys(formFields).forEach(key => {
        clearFieldError(formFields[key]);
      });
      
    }, 1500);
  }
});
