(function () {
  const card = document.getElementById("card");
  const themeToggle = document.getElementById("themeToggle");
  const toastEl = document.getElementById("toast");
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
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"
      );
    }
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

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  initTheme();

  let toastTimer;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("toast--visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("toast--visible");
    }, 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => copyTextFallback(text)
      );
    }
    return Promise.resolve(copyTextFallback(text));
  }

  function copyTextFallback(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      ta.remove();
    }
  }

  function buildVCard() {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:ybhsos",
      "N:;;;;",
      "ORG:엔티소프트",
      "TITLE:바이브코딩 풀스택 개발자 / CTO",
      "EMAIL;TYPE=INTERNET:ybhsos@naver.com",
      "TEL;TYPE=CELL:+821047201042",
      "URL:https://ybhsos.github.io/card/",
      "NOTE:디지털 명함. SRM TMS MES 전문가. LinkedIn https://www.linkedin.com/in/byung-hoon-yeo-527b14193/ YouTube https://www.youtube.com/@ybhsos8864",
      "END:VCARD",
    ];
    return lines.join("\r\n");
  }

  document.getElementById("saveContact")?.addEventListener("click", () => {
    const vcard = buildVCard();
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ybhsos-card.vcf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("연락처 파일을 저장했습니다. 열어서 연락처에 추가하세요.");
  });

  document.querySelector(".card__contact")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy-url]");
    if (!btn) return;
    const url = btn.getAttribute("data-copy-url");
    if (!url) return;
    copyText(url).then((ok) => {
      showToast(ok ? "링크를 복사했습니다." : "복사에 실패했습니다. 주소를 직접 선택해 복사해 주세요.");
    });
  });

  const CARD_PAGE_URL = "https://ybhsos.github.io/card/";
  const qrTarget = document.getElementById("qrcode");
  if (qrTarget && typeof QRCode !== "undefined") {
    new QRCode(qrTarget, {
      text: CARD_PAGE_URL,
      width: 132,
      height: 132,
      colorDark: "#0f1219",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

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
