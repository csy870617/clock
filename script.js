(function () {
  "use strict";

  const timeEl = document.getElementById("time");
  const meridiemEl = document.getElementById("meridiem");
  const dateEl = document.getElementById("date");
  const formatBtn = document.getElementById("formatBtn");
  const formatIcon = document.getElementById("formatIcon");
  const fontBtn = document.getElementById("fontBtn");
  const sizeDownBtn = document.getElementById("sizeDownBtn");
  const sizeUpBtn = document.getElementById("sizeUpBtn");
  const dateBtn = document.getElementById("dateBtn");
  const dateIcon = document.getElementById("dateIcon");
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const fullscreenIcon = document.getElementById("fullscreenIcon");
  const controlsEl = document.querySelector(".controls");
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
      // 12시간제에서만 오전/오후 표시 (24시간제에서는 숨김)
      meridiemEl.textContent = isPM ? "PM" : "AM";
    }

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
    // 24시간제에서는 AM/PM 영역을 숨김
    meridiemEl.classList.toggle("hidden", !twelve);
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

  // ---- 글자 크기 ----
  const SCALE_MIN = 0.4;
  const SCALE_MAX = 2.5;
  const SCALE_STEP = 0.1;
  let scale = 1;

  function applyScale(value, announce) {
    // 범위 제한 후 소수점 둘째 자리에서 반올림
    scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, Math.round(value * 100) / 100));
    root.style.setProperty("--clock-scale", String(scale));
    try {
      localStorage.setItem("clock-scale", String(scale));
    } catch (e) {
      /* 무시 */
    }
    if (announce) showToast("크기: " + Math.round(scale * 100) + "%");
  }

  function initScale() {
    let saved = null;
    try {
      saved = localStorage.getItem("clock-scale");
    } catch (e) {
      /* 무시 */
    }
    const v = parseFloat(saved);
    applyScale(isNaN(v) ? 1 : v, false);
  }

  sizeUpBtn.addEventListener("click", function () {
    applyScale(scale + SCALE_STEP, true);
  });
  sizeDownBtn.addEventListener("click", function () {
    applyScale(scale - SCALE_STEP, true);
  });

  // ---- 날짜 표시/숨김 ----
  let showDate = true;

  function applyDate(visible, announce) {
    showDate = visible;
    dateEl.classList.toggle("hidden", !visible);
    dateBtn.classList.toggle("off", !visible);
    try {
      localStorage.setItem("clock-date", visible ? "1" : "0");
    } catch (e) {
      /* 무시 */
    }
    if (announce) showToast(visible ? "날짜 표시" : "날짜 숨김");
  }

  function initDate() {
    let saved = null;
    try {
      saved = localStorage.getItem("clock-date");
    } catch (e) {
      /* 무시 */
    }
    applyDate(saved !== "0", false);
  }

  dateBtn.addEventListener("click", function () {
    applyDate(!showDate, true);
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

  function onFullscreenChange() {
    const fs = isFullscreen();
    fullscreenIcon.textContent = fs ? "🗗" : "⛶";
    // 전체화면일 때는 우측 상단 컨트롤을 숨김 (종료는 ESC)
    controlsEl.classList.toggle("hidden", !!fs);
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);

  // F 키로 전체화면 토글
  document.addEventListener("keydown", function (e) {
    if ((e.key === "f" || e.key === "F") && !e.metaKey && !e.ctrlKey) {
      toggleFullscreen();
    }
  });

  // ---- 시작 ----
  initTheme();
  initFont();
  initScale();
  initDate();
  initFormat();
  updateClock();
  setInterval(updateClock, 1000);
})();
