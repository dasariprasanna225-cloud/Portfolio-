/* =========================================================
   Dasari Satya Prasanna — Portfolio (Vanilla JS)
   Smooth interactions: nav, typing, reveal, scroll, filters
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Lucide icons bootstrap ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
  document.addEventListener("DOMContentLoaded", renderIcons);

  /* ---------- Year in footer ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });

  /* ---------- Smooth scroll helper (exposed globally for inline use) ---------- */
  window.scrollToSection = function (id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMobileMenu();
  };

  /* ---------- Navbar: links, scrolled state, active section, mobile menu ---------- */
  var navbar = document.getElementById("navbar");
  var mobileMenu = document.getElementById("mobileMenu");
  var menuToggle = document.getElementById("menuToggle");

  function bindNavLinks() {
    document.querySelectorAll(".nav-link").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-target");
        window.scrollToSection(target);
      });
    });
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    if (menuToggle) menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    renderIcons();
  }

  function toggleMobileMenu() {
    if (!mobileMenu) return;
    var open = !mobileMenu.hidden;
    mobileMenu.hidden = open;
    menuToggle.innerHTML = open
      ? '<i data-lucide="menu"></i>'
      : '<i data-lucide="x"></i>';
    renderIcons();
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindNavLinks();
    if (menuToggle) menuToggle.addEventListener("click", toggleMobileMenu);
  });

  /* ---------- Scroll: progress bar + navbar shadow + back-to-top ---------- */
  var scrollBar = document.getElementById("scrollBar");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var doc = document.documentElement;
    var scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
    var pct = Math.min(Math.max(scrolled, 0), 1) * 100;
    if (scrollBar) scrollBar.style.width = pct + "%";

    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);
    if (toTop) toTop.hidden = window.scrollY <= 600;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("DOMContentLoaded", onScroll);

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Active section highlight ---------- */
  var SECTIONS = ["home", "about", "skills", "projects", "education",
    "certifications", "achievements", "contact"];

  function setActive(id) {
    document.querySelectorAll(".nav-link").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-target") === id);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in-view"); });
      animateSkillBars();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          // Animate skill bars when their card reveals
          if (e.target.classList.contains("skill-card")) {
            animateSkillBars(e.target);
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach(function (el) { io.observe(el); });
  });

  function animateSkillBars(scope) {
    var root = scope || document;
    root.querySelectorAll(".bar-fill").forEach(function (b) {
      var w = b.getAttribute("data-w") || "0%";
      requestAnimationFrame(function () { b.style.width = w; });
    });
  }

  /* ---------- Typing effect (Hero roles) ---------- */
  var ROLES = ["Frontend Developer", "BCA Student", "Tech Enthusiast"];
  document.addEventListener("DOMContentLoaded", function () {
    var node = document.getElementById("typed");
    if (!node) return;
    var roleIdx = 0, text = "", deleting = false;

    function tick() {
      var current = ROLES[roleIdx];
      var speed = deleting ? 45 : 90;
      if (!deleting) {
        text = current.slice(0, text.length + 1);
        node.textContent = text;
        if (text === current) {
          setTimeout(function () { deleting = true; tick(); }, 1400);
          return;
        }
      } else {
        text = current.slice(0, text.length - 1);
        node.textContent = text;
        if (text === "") {
          deleting = false;
          roleIdx = (roleIdx + 1) % ROLES.length;
        }
      }
      setTimeout(tick, speed);
    }
    tick();
  });

  /* ---------- Project filter ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var filters = document.querySelectorAll(".filter");
    var projects = document.querySelectorAll(".project");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        projects.forEach(function (card) {
          var tags = (card.getAttribute("data-tags") || "").split(",");
          card.classList.toggle("hidden", !(f === "All" || tags.indexOf(f) !== -1));
        });
      });
    });
  });

  /* ---------- Contact form ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");
    var submitBtn = document.getElementById("submitBtn");
    if (!form || !submitBtn) return;
    var labelSpan = submitBtn.querySelector("span");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitBtn.innerHTML = '<i data-lucide="check"></i> <span>Sent successfully</span>';
      renderIcons();
      form.reset();
      setTimeout(function () {
        submitBtn.innerHTML = '<i data-lucide="send"></i> <span>Send Message</span>';
        renderIcons();
      }, 3500);
    });
  });
})();