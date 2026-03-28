(function () {
  const card = document.getElementById("card");
  const themeToggle = document.getElementById("themeToggle");
  const STORAGE_KEY = "card-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.setAttribute(
      "aria-label",
      theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"
    );
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
      return;
    }
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
  });

  initTheme();

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!card || reduceMotion) return;

  let bounds = card.getBoundingClientRect();

  function updateBounds() {
    bounds = card.getBoundingClientRect();
  }

  window.addEventListener("resize", updateBounds);

  card.addEventListener("pointermove", (e) => {
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const px = (x / bounds.width - 0.5) * 2;
    const py = (y / bounds.height - 0.5) * 2;
    const maxTilt = 8;
    const rotateY = px * maxTilt;
    const rotateX = -py * maxTilt;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
})();
