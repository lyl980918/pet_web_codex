const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const syncNavToggle = () => {
  const isMobile = window.innerWidth <= 980;
  toggle.style.display = isMobile ? "inline-flex" : "none";
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
