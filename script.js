/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  menuToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

/* =========================================
   2. TYPING ANIMATION
========================================= */

const typingText = document.getElementById("typing-text");

const roles = [
  "Full Stack Developer",
  "MERN Stack Developer",
  "Frontend Developer",
  "Creative Problem Solver",
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeRole() {
  const currentRole = roles[roleIndex];

  if (deleting) {
    characterIndex--;
  } else {
    characterIndex++;
  }

  typingText.textContent = currentRole.substring(0, characterIndex);

  let delay = deleting ? 45 : 90;

  if (!deleting && characterIndex === currentRole.length) {
    deleting = true;
    delay = 1400;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  }

  window.setTimeout(typeRole, delay);
}

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (reduceMotion) {
  typingText.textContent = roles[0];
} else {
  typeRole();
}

/* =========================================
   3. SCROLL REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/* =========================================
   4. ACTIVE NAVIGATION ON SCROLL
========================================= */

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px",
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* =========================================
   5. DARK / LIGHT THEME SWITCHER
========================================= */

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);
  themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";

  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );

  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", isLight ? "#f5f7ff" : "#0b1020");
}

let savedTheme = "dark";

try {
  savedTheme = localStorage.getItem("portfolio-theme") || "dark";
} catch (error) {
  // The site still works if browser storage is unavailable.
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme")
    ? "dark"
    : "light";

  applyTheme(nextTheme);

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch (error) {
    // Theme switching still works for the current page.
  }
});

/* =========================================
   6. BACK TO TOP BUTTON
========================================= */

const backToTop = document.getElementById("back-to-top");

function updateBackToTop() {
  backToTop.classList.toggle("visible", window.scrollY > 450);
}

window.addEventListener("scroll", updateBackToTop, {
  passive: true,
});

updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth",
  });
});

/* =========================================
   7. CURRENT YEAR
========================================= */

document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================
   8. CONTACT FORM
   Opens the visitor's email application.
   This does not send messages through a server.
========================================= */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// Replace this with your real email address.
const contactEmail = "your.email@example.com";

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const formData = new FormData(contactForm);

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  const emailSubject = encodeURIComponent(subject);
  const emailBody = encodeURIComponent(
    `Name: ${name}\n` + `Email: ${email}\n\n` + `Message:\n${message}`
  );

  const mailtoLink = `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`;

  formStatus.textContent =
    "Opening your email application. Send the prepared email to complete your message.";

  window.location.href = mailtoLink;
});
