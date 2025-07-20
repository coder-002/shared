import { brandThemes } from "./test-theme";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applyThemeCSSVars(themeKey: string) {
  const theme = brandThemes[themeKey] || brandThemes.default;
  const root = document.documentElement;

  root.style.setProperty("--background-color", theme.backgroundColor),
    root.style.setProperty("--primary-color", theme.colorPrimary);
  root.style.setProperty(
    "--primary-color-transparent-35",
    hexToRgba(theme.colorPrimary, 0.25)
  );
  root.style.setProperty(
    "--primary-color-transparent-55",
    hexToRgba(theme.colorPrimary, 0.55)
  );
  root.style.setProperty(
    "--primary-color-transparent-85",
    hexToRgba(theme.colorPrimary, 0.85)
  );
  root.style.setProperty(
    "--primary-color-transparent-95",
    hexToRgba(theme.colorPrimary, 0.95)
  );
  root.style.setProperty(
    "--primary-color-transparent-97",
    hexToRgba(theme.colorPrimary, 0.97)
  );
  root.style.setProperty(
    "--primary-color-transparent-98",
    hexToRgba(theme.colorPrimary, 0.98)
  );
}
