export function getTheme() {
  return localStorage.getItem("theme") || "light";
}

export function setTheme(theme) {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "light" ? "dark" : "light";
  setTheme(next);
}
