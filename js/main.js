(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /** Resolve base path for partials and links when pages live in subfolders */
  function getBasePath() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/products/")) {
      return "../";
    }
    return "./";
  }

  /** Fix relative hrefs and image src after partial injection */
  function fixRelativeLinks(container, basePath) {
    container.querySelectorAll("[data-root-href]").forEach(function (el) {
      el.setAttribute("href", basePath + el.getAttribute("data-root-href"));
    });
    container.querySelectorAll("[data-root-src]").forEach(function (el) {
      el.setAttribute("src", basePath + el.getAttribute("data-root-src"));
    });
  }

  /** Strip .html from internal links for clean URLs */
  function cleanHref(href) {
    if (!href || /^(https?:|#|mailto:|tel:)/.test(href)) return href;
    return href
      .replace(/(^|\/)index\.html(?=$|[?#])/, "$1")
      .replace(/\.html(?=$|[?#])/, "");
  }

  function cleanInternalLinks(root) {
    root.querySelectorAll("a[href]").forEach(function (link) {
      const href = link.getAttribute("href");
      const cleaned = cleanHref(href);
      if (cleaned !== href) {
        link.setAttribute("href", cleaned);
      }
    });
  }

  /** Load HTML partial into target element */
  async function loadPartial(targetId, partialFile) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const basePath = getBasePath();
    try {
      const response = await fetch(basePath + partialFile);
      if (!response.ok) throw new Error("Failed to load " + partialFile);
      const html = await response.text();
      target.innerHTML = html;
      fixRelativeLinks(target, basePath);
    } catch (err) {
      console.warn("Partial load failed:", err.message);
      target.innerHTML =
        '<p style="padding:1rem;text-align:center;color:#64748b;">Navigation could not load. Please use a local server.</p>';
    }
  }

  /** Highlight active nav link based on current page */
  function setActiveNav() {
    const path = window.location.pathname
      .replace(/\\/g, "/")
      .replace(/\/$/, "");
    const page = path.split("/").pop() || "index";
    const pageName = page.replace(/\.html$/, "");
    const navMap = {
      index: "home",
      about: "about",
      markets: "markets",
      "trading-supply": "trading",
      logistics: "logistics",
      "quality-compliance": "quality",
      contact: "contact",
    };

    let activeKey = navMap[pageName] || null;
    if (path.includes("/products")) {
      activeKey =
        pageName === "index" || pageName === "products" ? "products" : null;
    }

    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === activeKey) {
        link.classList.add("is-active");
      }
    });
  }

  /** Desktop products dropdown */
  function initDropdown() {
    const dropdown = document.querySelector(".nav-dropdown");
    if (!dropdown) return;

    const toggle = dropdown.querySelector(".nav-dropdown__toggle");

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dropdown.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    document.addEventListener("click", function () {
      dropdown.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  /** Mobile navigation */
  function initMobileNav() {
    const toggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    if (!toggle || !mobileNav) return;

    toggle.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", isOpen);
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", isOpen);
      mobileNav.hidden = !isOpen;
    });

    const accordionToggle = mobileNav.querySelector(
      ".mobile-nav__accordion-toggle",
    );
    const submenu = mobileNav.querySelector(".mobile-nav__submenu");
    if (accordionToggle && submenu) {
      accordionToggle.addEventListener("click", function () {
        const isOpen = submenu.classList.toggle("is-open");
        accordionToggle.setAttribute("aria-expanded", isOpen);
      });
    }

    mobileNav.querySelectorAll(".mobile-nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
        mobileNav.hidden = true;
      });
    });
  }

  /** Scroll reveal animations */
  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /** Contact form — Web3Forms email delivery */
  function initContactForm() {
    const form = document.querySelector(".quote-form");
    if (!form) return;

    const config = window.MNA_FORM_CONFIG || {};
    const submitBtn = form.querySelector(".quote-form__submit");
    const successNotice = form.querySelector(".form-submit-notice");
    const errorNotice = form.querySelector(".form-error-notice");
    const defaultBtnText = submitBtn
      ? submitBtn.textContent
      : "Request a Quote";

    function hideNotices() {
      if (successNotice) successNotice.hidden = true;
      if (errorNotice) {
        errorNotice.hidden = true;
        errorNotice.textContent = "";
      }
    }

    function showError(message) {
      hideNotices();
      if (errorNotice) {
        errorNotice.textContent = message;
        errorNotice.hidden = false;
        errorNotice.focus();
      }
    }

    function showSuccess() {
      hideNotices();
      if (successNotice) {
        successNotice.hidden = false;
        successNotice.focus();
      }
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.classList.toggle("is-loading", isLoading);
      submitBtn.textContent = isLoading ? "Sending…" : defaultBtnText;
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideNotices();

      const honeypot = form.querySelector('[name="botcheck"]');
      if (honeypot && honeypot.value.trim()) {
        return;
      }

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const product = form.querySelector('[name="product"]').value.trim();

      if (!name) {
        showError("Please enter your name.");
        form.querySelector('[name="name"]').focus();
        return;
      }

      if (!email || !isValidEmail(email)) {
        showError("Please enter a valid email address.");
        form.querySelector('[name="email"]').focus();
        return;
      }

      if (!product) {
        showError("Please enter the product you are interested in.");
        form.querySelector('[name="product"]').focus();
        return;
      }

      if (!config.accessKey || config.accessKey === "YOUR_ACCESS_KEY_HERE") {
        showError(
          "Form is not configured yet. Add your Web3Forms access key in js/form-config.js.",
        );
        return;
      }

      const payload = {
        access_key: config.accessKey,
        subject: config.subject || "MNA Global Trading — New Quote Request",
        from_name: name,
        email: email,
        product: product,
        quantity: form.querySelector('[name="quantity"]').value.trim(),
        specification: form
          .querySelector('[name="specification"]')
          .value.trim(),
        origin: form.querySelector('[name="origin"]').value.trim(),
        destination: form.querySelector('[name="destination"]').value.trim(),
        delivery_period: form
          .querySelector('[name="delivery_period"]')
          .value.trim(),
        incoterm: form.querySelector('[name="incoterm"]').value,
        message: form.querySelector('[name="message"]').value.trim(),
      };

      setLoading(true);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          form.reset();
          showSuccess();
        } else {
          showError(
            result.message || "Something went wrong. Please try again later.",
          );
        }
      } catch (err) {
        showError(
          "Unable to send your request. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    });
  }

  async function init() {
    await Promise.all([
      loadPartial("site-header", "partials/header.html"),
      loadPartial("site-footer", "partials/footer.html"),
    ]);

    cleanInternalLinks(document);
    setActiveNav();
    initDropdown();
    initMobileNav();
    initScrollReveal();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
