(function () {
  "use strict";

  const timeEl = document.getElementById("time");
  const meridiemEl = document.getElementById("meridiem");
  const dateEl = document.getElementById("date");
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const fullscreenIcon = document.getElementById("fullscreenIcon");

  const root = document.documentElement;
  const pad = (n) => String(n).padStart(2, "0");

  const days = ["일", "월", "화", "수", "목", "금", "토"];

  function updateClock() {
    const now = new Date();
    timeEl.textContent =
      pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());

    // 24시간 표기라 오전/오후만 보조 표시
    meridiemEl.textContent = now.getHours() < 12 ? "AM" : "PM";

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
  updateClock();
  setInterval(updateClock, 1000);
})();
