// NineOrbit — shared front-end behaviour (no framework, kept intentionally light)
(function () {
  'use strict';

  // ---------- Mobile nav drawer ----------
  var toggle = document.querySelector('[data-nav-toggle]');
  var drawer = document.querySelector('[data-mobile-drawer]');
  var closeBtn = document.querySelector('[data-drawer-close]');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle && toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle && toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  // ---------- Contact form ----------
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var statusBox = form.querySelector('[data-form-status]');
    var submitBtn = form.querySelector('[data-submit-btn]');

    function setFieldError(field, message) {
      var wrap = field.closest('.form-field');
      var errorEl = wrap.querySelector('.error-text');
      if (message) {
        wrap.classList.add('invalid');
        if (errorEl) errorEl.textContent = message;
      } else {
        wrap.classList.remove('invalid');
        if (errorEl) errorEl.textContent = '';
      }
    }

    function validate() {
      var valid = true;
      var name = form.querySelector('#name');
      var phone = form.querySelector('#phone');
      var email = form.querySelector('#email');
      var message = form.querySelector('#message');

      if (!name.value.trim()) { setFieldError(name, 'Please enter your name.'); valid = false; }
      else setFieldError(name, '');

      var phoneDigits = phone.value.replace(/\D/g, '');
      if (phoneDigits.length < 10) { setFieldError(phone, 'Enter a valid phone number.'); valid = false; }
      else setFieldError(phone, '');

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) { setFieldError(email, 'Enter a valid email address.'); valid = false; }
      else setFieldError(email, '');

      if (!message.value.trim() || message.value.trim().length < 10) { setFieldError(message, 'Tell us a little about your project (10+ characters).'); valid = false; }
      else setFieldError(message, '');

      return valid;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot spam trap — real users never fill this hidden field
      var honeypot = form.querySelector('#company_website_hp');
      if (honeypot && honeypot.value) {
        return; // silently drop likely-bot submissions
      }

      if (!validate()) {
        statusBox.className = 'form-status error';
        statusBox.textContent = 'Please fix the highlighted fields and try again.';
        return;
      }

      var data = Object.fromEntries(new FormData(form).entries());
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusBox.className = 'form-status';
      statusBox.textContent = '';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json();
        })
        .then(function () {
          statusBox.className = 'form-status success';
          statusBox.textContent = "Thank you — your enquiry has been sent. Our team will get back to you shortly. You can also WhatsApp us directly for a faster response.";
          form.reset();
        })
        .catch(function () {
          statusBox.className = 'form-status error';
          statusBox.textContent = "We couldn't send your enquiry right now. Please WhatsApp us at +91 88106 55007 or email sushil194ss@gmail.com and we'll respond right away.";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request a Free Consultation';
        });
    });
  }

  // ---------- Footer year ----------
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ---------- Mark current nav link ----------
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
