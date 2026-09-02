(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Resolve base path for partials and links when pages live in subfolders */
  function getBasePath() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/products/")) {
      return "../";
    }
    return "./";
  }

  /** Fix relative hrefs after partial injection */
  function fixRelativeLinks(container, basePath) {
    container.querySelectorAll("[data-root-href]").forEach(function (el) {
      el.setAttribute("href", basePath + el.getAttribute("data-root-href"));
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
    const path = window.location.pathname.replace(/\\/g, "/");
    const page = path.split("/").pop() || "index.html";
    const navMap = {
      "index.html": "home",
      "about.html": "about",
      "markets.html": "markets",
      "trading-supply.html": "trading",
      "logistics.html": "logistics",
      "quality-compliance.html": "quality",
      "contact.html": "contact",
      "index.html-products": "products",
    };

    let activeKey = navMap[page] || null;
    if (path.includes("/products/")) {
      activeKey = page === "index.html" ? "products" : null;
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

    const accordionToggle = mobileNav.querySelector(".mobile-nav__accordion-toggle");
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /** Contact form UI-only handler */
  function initContactForm() {
    const form = document.querySelector(".quote-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const notice = form.querySelector(".form-submit-notice");
      if (notice) {
        notice.hidden = false;
        notice.focus();
      }
    });
  }

  async function init() {
    await Promise.all([
      loadPartial("site-header", "partials/header.html"),
      loadPartial("site-footer", "partials/footer.html"),
    ]);

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
