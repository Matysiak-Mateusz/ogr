// Obsługa zapisu stanu gry i motywu w localStorage.

export const STORAGE_KEYS = {
  save: "ogr:save",
  theme: "ogr:theme",
  musicMuted: "ogr:music-muted",
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.save);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProgress(currentParagraphId) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.save,
      JSON.stringify({ currentParagraphId }),
    );
  } catch {
    /* localStorage niedostępny - ignorujemy */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(STORAGE_KEYS.save);
  } catch {
    /* ignoruj */
  }
}

export function hasSave() {
  const save = loadSave();
  return Boolean(save && save.currentParagraphId);
}

// Domyślny motyw pobierany z ustawień systemu/przeglądarki użytkownika.
function systemTheme() {
  try {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export function loadTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.theme) || systemTheme();
  } catch {
    return systemTheme();
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch {
    /* ignoruj */
  }
}

// Wyciszenie muzyki: przechowywane jako 'true' / 'false'.
export function loadMusicMuted() {
  try {
    return localStorage.getItem(STORAGE_KEYS.musicMuted) === "true";
  } catch {
    return false;
  }
}

export function saveMusicMuted(muted) {
  try {
    localStorage.setItem(STORAGE_KEYS.musicMuted, muted ? "true" : "false");
  } catch {
    /* ignoruj */
  }
}
