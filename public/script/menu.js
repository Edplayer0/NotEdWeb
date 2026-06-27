const button = document.getElementById("menu-button");
const menu = document.getElementById("mobile-menu");
const icon = document.getElementById("menu-icon");

button.addEventListener("click", () => {
  menu.classList.toggle("hidden");

  const isOpen = !menu.classList.contains("hidden");
  button.setAttribute("aria-expanded", String(isOpen));
  icon.textContent = isOpen ? "close" : "menu";
});
