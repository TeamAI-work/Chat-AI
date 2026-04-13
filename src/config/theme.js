// ─── Theme Configuration ─────────────────────────────────────────────────────
// Central color palette for the entire app.
// Change colors here → the whole app updates automatically.
// Works just like models.js — one file, one source of truth.
// ─────────────────────────────────────────────────────────────────────────────

// GREEN
// export const THEME = {
//   light: {
//     "bg":             "#f6f6f6",      // main page background
//     "bg-deep":        "#f5f5f5",      // sidebar, deep panels
//     "surface":        "#f2f2f2",      // cards, elevated areas
//     "text":           "#000000",      // primary text
//     "muted":          "#6b7280",      // secondary/muted text
//     "primary":        "#015958",      // primary accent (buttons, links, icons)
//     "secondary":      "#0CABA8",      // secondary accent (gradients, highlights)
//     "border":         "#0FC2C0",      // standard borders & dividers
//     "border-accent":  "#023535",      // accent borders (emphasized elements)
//   },
//   dark: {
//     "bg":             "#18191D",      // main page background
//     "bg-deep":        "#0F0F12",      // sidebar, deep panels
//     "surface":        "#25262D",      // cards, elevated areas
//     "text":           "#ffffff",      // primary text
//     "muted":          "#9ca3af",      // secondary/muted text
//     "primary":        "#015958",      // primary accent
//     "secondary":      "#0CABA8",      // secondary accent
//     "border":         "#023535", // standard borders
//     "border-accent":  "#ffffff",      // accent borders
//   }
// };

//ORANGE
export const THEME = {
  light: {
    "bg":             "#f6f6f6",      // main page background
    "bg-deep":        "#f5f5f5",      // sidebar, deep panels
    "surface":        "#f2f2f2",      // cards, elevated areas
    "text":           "#000000",      // primary text
    "muted":          "#6b7280",      // secondary/muted text
    "primary":        "#015958",      // primary accent (buttons, links, icons)
    "secondary":      "#0CABA8",      // secondary accent (gradients, highlights)
    "border":         "#0FC2C0",      // standard borders & dividers
    "border-accent":  "#023535",      // accent borders (emphasized elements)
  },
  dark: {
    "bg":             "#18191D",      // main page background
    "bg-deep":        "#0F0F12",      // sidebar, deep panels
    "surface":        "#25262D",      // cards, elevated areas
    "text":           "#ffffff",      // primary text
    "muted":          "#9ca3af",      // secondary/muted text
    "primary":        "#015958",      // primary accent
    "secondary":      "#0CABA8",      // secondary accent
    "border":         "#023535", // standard borders
    "border-accent":  "#ffffff",      // accent borders
  }
};

// ─── Apply Theme ─────────────────────────────────────────────────────────────
// Call this on app startup and whenever dark mode is toggled.
// It injects the correct color set as CSS custom properties on <html>.
export function applyTheme(mode) {
  const root = document.documentElement;
  const isDark =
    mode === "dark" || (mode === undefined && root.classList.contains("dark"));
  const colors = isDark ? THEME.dark : THEME.light;

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
}

// ─── Toggle Theme ────────────────────────────────────────────────────────────
// Convenience function: toggles the dark class AND re-applies CSS variables.
export function toggleTheme() {
  const root = document.documentElement;
  const willBeDark = !root.classList.contains("dark");

  if (willBeDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  applyTheme(willBeDark ? "dark" : "light");
  return willBeDark;
}
