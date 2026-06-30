const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll(".count-up");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js-enabled");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeNav = () => {
  toggle?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
};

toggle?.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

const animateCounter = (counter) => {
  if (counter.dataset.done === "true") return;

  const target = Number(counter.dataset.count || "0");
  counter.dataset.done = "true";

  if (reduceMotion || !Number.isFinite(target)) {
    counter.textContent = String(target);
    return;
  }

  const duration = 900;
  const start = performance.now();
  const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeOut(progress));
    counter.textContent = String(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const revealElement = (element) => {
  element.classList.add("is-visible");

  if (element.hasAttribute("data-timeline")) {
    element.classList.add("is-visible");
  }

  element.querySelectorAll(".count-up").forEach(animateCounter);
};

const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
};

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const revealVisibleItems = () => {
    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible") || !isInViewport(item)) return;
      revealElement(item);
      revealObserver.unobserve(item);
    });
  };

  requestAnimationFrame(revealVisibleItems);
  window.addEventListener("load", revealVisibleItems, { once: true });

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.4,
    }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  revealItems.forEach(revealElement);
  counters.forEach(animateCounter);
}

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", closeNav);
setHeaderState();
