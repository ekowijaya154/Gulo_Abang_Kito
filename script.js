/* =========================================================
   Gulo Abang Kito — Vanilla JavaScript
   1. Loading animation
   2. Theme (dark mode + localStorage)
   3. Scroll reveal animations
   4. Ripple effect
   5. Back to top
   6. Copy link
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Loading animation ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("is-hidden");
    }
    revealAll();
  });

  /* ---------- 2. Theme handling ---------- */
  var STORAGE_KEY = "gak-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");

  function detectInitialTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      saved = null;
    }
    if (
  saved === "light" ||
  saved === "dark" ||
  saved === "moonlight"
) {
  return saved;
}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (toggle) {
    toggle.setAttribute(
      "aria-pressed",
      theme === "dark" ? "true" : "false"
    );

    if (theme === "dark") {
      toggle.innerHTML =
        '<i class="fa-solid fa-sun" aria-hidden="true"></i>';

    } else if (theme === "moonlight") {
      toggle.innerHTML =
        '<i class="fa-solid fa-star" aria-hidden="true"></i>';

    } else {
      toggle.innerHTML =
        '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    /* storage unavailable — ignore */
  }
}

  applyTheme(detectInitialTheme());
  window.setTheme = function(theme) {
  applyTheme(theme);
};

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function revealAll() {
    revealItems.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add("is-visible");
      }, 90 * i);
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealAll();
  }

  /* ---------- 4. Ripple effect ---------- */
  function createRipple(event, element) {
    var rect = element.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    var y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

    var span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = size + "px";
    span.style.left = x + "px";
    span.style.top = y + "px";

    element.appendChild(span);
    setTimeout(function () {
      span.remove();
    }, 600);
  }

  document.querySelectorAll(".link-btn").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      createRipple(event, btn);
    });
    // Keyboard activation also triggers the ripple
    btn.addEventListener("keyup", function (event) {
      if (event.key === "Enter" || event.key === " ") createRipple(event, btn);
    });
  });

  /* ---------- 5. Back to top ---------- */
  var toTop = document.getElementById("toTop");

  window.addEventListener(
    "scroll",
    function () {
      if (!toTop) return;
      toTop.classList.toggle("is-visible", window.scrollY > 220);
    },
    { passive: true }
  );

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 6. Copy link ---------- */
  var copyBtn = document.getElementById("copyBtn");
  var copyLabel = document.getElementById("copyLabel");
  var liveRegion = document.getElementById("liveRegion");

  function feedback(message) {
    if (copyLabel) copyLabel.textContent = message;
    if (liveRegion) liveRegion.textContent = message;
    setTimeout(function () {
      if (copyLabel) copyLabel.textContent = "Salin Link";
    }, 1800);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          function () {
            feedback("Link tersalin!");
          },
          function () {
            feedback("Gagal menyalin");
          }
        );
      } else {
        var input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        try {
          document.execCommand("copy");
          feedback("Link tersalin!");
        } catch (e) {
          feedback("Gagal menyalin");
        }
        input.remove();
      }
    });
  }
})();
