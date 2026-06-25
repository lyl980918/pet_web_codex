const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const animatedContent = document.querySelectorAll("[data-animated-content]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const syncNavToggle = () => {
  const isMobile = window.innerWidth <= 980;
  toggle.style.display = isMobile ? "inline-flex" : "none";
};

const initAnimatedContent = () => {
  if (!animatedContent.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    animatedContent.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("supports-scroll-reveal");

  animatedContent.forEach((element) => {
    const distance = Number(element.dataset.distance || 100);
    const direction = element.dataset.direction || "vertical";
    const reverse = element.dataset.reverse === "true";
    const offset = reverse ? -distance : distance;
    const duration = Number(element.dataset.duration || 0.8);
    const initialOpacity = Number(element.dataset.initialOpacity || 0);
    const scale = Number(element.dataset.scale || 1);
    const delay = Number(element.dataset.delay || 0);
    const threshold = Number(element.dataset.threshold || 0.1);

    element.style.setProperty("--reveal-x", direction === "horizontal" ? `${offset}px` : "0");
    element.style.setProperty("--reveal-y", direction === "vertical" ? `${offset}px` : "0");
    element.style.setProperty("--reveal-duration", `${duration}s`);
    element.style.setProperty("--reveal-opacity", initialOpacity);
    element.style.setProperty("--reveal-scale", scale);
    element.style.setProperty("--reveal-delay", `${delay}s`);

    element.querySelectorAll(".animated-stagger").forEach((child, index) => {
      child.style.setProperty("--stagger-index", index);
    });

    const reveal = () => {
      element.classList.add("is-visible");
    };

    const observer = new IntersectionObserver(
      ([entry], currentObserver) => {
        if (!entry.isIntersecting) return;
        reveal();
        currentObserver.unobserve(element);
      },
      { threshold }
    );

    observer.observe(element);

    if (window.location.hash && element.closest(window.location.hash)) {
      window.setTimeout(reveal, 80);
    }

    const revealIfAlreadyInView = () => {
      const rect = element.getBoundingClientRect();
      const triggerLine = window.innerHeight * (1 - threshold);
      if (rect.top <= triggerLine && rect.bottom >= 0) {
        reveal();
        observer.unobserve(element);
      }
    };

    requestAnimationFrame(revealIfAlreadyInView);
    window.setTimeout(revealIfAlreadyInView, 160);
  });
};

toggle.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  });
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", syncNavToggle);
setHeaderState();
syncNavToggle();
initAnimatedContent();
