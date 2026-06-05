(function () {
  "use strict";

  const timeEl = document.getElementById("time");
  const meridiemEl = document.getElementById("meridiem");
  const dateEl = document.getElementById("date");
  const formatBtn = document.getElementById("formatBtn");
  const formatIcon = document.getElementById("formatIcon");
  const fontBtn = document.getElementById("fontBtn");
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const fullscreenIcon = document.getElementById("fullscreenIcon");
  const toastEl = document.getElementById("toast");

  const root = document.documentElement;
  const pad = (n) => String(n).padStart(2, "0");

  const days = ["일", "월", "화", "수", "목", "금", "토"];

  let use12Hour = false;

  // ---- 토스트 안내 ----
  let toastTimer = null;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1400);
  }

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const isPM = hours >= 12;

    if (use12Hour) {
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }
    // 오전/오후 보조 표시 (12·24시간제 공통)
    meridiemEl.textContent = isPM ? "PM" : "AM";

    timeEl.textContent =
      pad(hours) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());

    dateEl.textContent =
      now.getFullYear() +
      "년 " +
      (now.getMonth() + 1) +
      "월 " +
      now.getDate() +
      "일 (" +
      days[now.getDay()] +
      ")";
  }

  // ---- 12/24 시간제 ----
  function applyFormat(twelve) {
    use12Hour = twelve;
    formatIcon.textContent = twelve ? "12" : "24";
    try {
      localStorage.setItem("clock-12hour", twelve ? "1" : "0");
    } catch (e) {
      /* 무시 */
    }
    updateClock();
  }

  function initFormat() {
    let saved = null;
    try {
      saved = localStorage.getItem("clock-12hour");
    } catch (e) {
      /* 무시 */
    }
    applyFormat(saved === "1");
  }

  formatBtn.addEventListener("click", function () {
    applyFormat(!use12Hour);
    showToast(use12Hour ? "12시간제" : "24시간제");
  });

  // ---- 폰트 ----
  const fonts = [
    {
      name: "기본",
      value:
        '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif',
    },
    { name: "Orbitron", value: '"Orbitron", sans-serif' },
    { name: "Roboto Mono", value: '"Roboto Mono", monospace' },
    { name: "손글씨", value: '"Nanum Pen Script", cursive' },
  ];
  let fontIndex = 0;

  function applyFont(index, announce) {
    fontIndex = (index + fonts.length) % fonts.length;
    const font = fonts[fontIndex];
    root.style.setProperty("--clock-font", font.value);
    try {
      localStorage.setItem("clock-font", String(fontIndex));
    } catch (e) {
      /* 무시 */
    }
    if (announce) showToast("폰트: " + font.name);
  }

  function initFont() {
    let saved = null;
    try {
      saved = localStorage.getItem("clock-font");
    } catch (e) {
      /* 무시 */
    }
    const idx = parseInt(saved, 10);
    applyFont(isNaN(idx) ? 0 : idx, false);
  }

  fontBtn.addEventListener("click", function () {
    applyFont(fontIndex + 1, true);
  });

  // ---- 테마 ----
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    try {
      localStorage.setItem("clock-theme", theme);
    } catch (e) {
      /* localStorage 사용 불가 시 무시 */
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem("clock-theme");
    } catch (e) {
      /* 무시 */
    }
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  }

  themeBtn.addEventListener("click", function () {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // ---- 전체화면 ----
  function isFullscreen() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }

  function toggleFullscreen() {
    if (!isFullscreen()) {
      const el = document.documentElement;
      (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }

  function updateFullscreenIcon() {
    fullscreenIcon.textContent = isFullscreen() ? "🗗" : "⛶";
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenIcon);
  document.addEventListener("webkitfullscreenchange", updateFullscreenIcon);

  // F 키로 전체화면 토글
  document.addEventListener("keydown", function (e) {
    if ((e.key === "f" || e.key === "F") && !e.metaKey && !e.ctrlKey) {
      toggleFullscreen();
    }
  });

  // ---- 시작 ----
  initTheme();
  initFont();
  initFormat();
  updateClock();
  setInterval(updateClock, 1000);
})();
