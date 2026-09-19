// Shared behaviour across all pages: mobile nav toggle + dark/light theme toggle.
(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  var THEME_KEY = "ielts-theme";
  var themeToggle = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  var saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (e) {
    /* localStorage unavailable (private mode) — fall back to system theme */
  }
  applyTheme(saved);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      var isDark = current ? current === "dark" : prefersDark;
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  // Offline app-shell caching (PWA).
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {
        /* offline support unavailable (e.g. file:// or unsupported browser) */
      });
    });
  }

  // Highlight the current page in the nav.
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
})();

// Generic accordion (used on lessons.html).
function initAccordion(root) {
  root.querySelectorAll(".accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    trigger.addEventListener("click", function () {
      item.classList.toggle("open");
    });
  });
}

// Generic tabs (used on lessons.html + question-bank.html).
function initTabs(root) {
  var buttons = root.querySelectorAll(".tab-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");
      root.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
      root.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active");
      root.querySelector('.tab-panel[data-tab="' + target + '"]').classList.add("active");
    });
  });
}

function showToast(message) {
  var toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}
