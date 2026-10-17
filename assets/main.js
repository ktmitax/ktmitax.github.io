(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteNav = document.getElementById("site-menu");
  const mobileQuery = window.matchMedia("(max-width: 820px)");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function setMenuOpen(isOpen, restoreFocus = false) {
    if (!header || !menuToggle) return;

    header.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");

    if (!isOpen && restoreFocus) {
      menuToggle.focus();
    }
  }

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.contains("menu-open");
      setMenuOpen(!isOpen);
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (
        header.classList.contains("menu-open") &&
        !header.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("menu-open")) {
        setMenuOpen(false, true);
      }
    });

    mobileQuery.addEventListener("change", (event) => {
      if (!event.matches) setMenuOpen(false);
    });
  }

  for (const year of document.querySelectorAll("[data-year]")) {
    year.textContent = String(new Date().getFullYear());
  }

  const revealItems = document.querySelectorAll("[data-reveal]");

  if (
    reduceMotion.matches ||
    typeof IntersectionObserver === "undefined"
  ) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const isAboveViewport = entry.boundingClientRect.top < 0;
          if (!entry.isIntersecting && !isAboveViewport) continue;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08
      }
    );

    revealItems.forEach((item, index) => {
      if (index === 0) {
        window.requestAnimationFrame(() => {
          item.classList.add("is-visible");
        });
      }
      observer.observe(item);
    });
  }

  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  });
})();
