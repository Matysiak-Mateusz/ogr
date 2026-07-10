// Konfiguracja internacjonalizacji (i18next + react-i18next).
//
// Domyślny język wykrywany jest z przeglądarki: użytkownik z językiem polskim
// dostaje wersję polską, każdy inny — angielską. Wybór jest zapamiętywany
// w localStorage pod kluczem "ogr:lang".
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  pl: {
    translation: {
      title: "Ogr!",
      imageAlt: "Ogr",
      newGame: "Nowa Gra",
      continue: "Kontynuuj",
      backToMenu: "Powrót do menu",
      end: "Koniec.",
      themeToDark: "Włącz ciemny motyw",
      themeToLight: "Włącz jasny motyw",
      themeDarkTitle: "Ciemny motyw",
      themeLightTitle: "Jasny motyw",
      musicOn: "Włącz muzykę",
      musicOff: "Wycisz muzykę",
      languageShort: "EN",
      switchLanguage: "Zmień język na angielski",
    },
  },
  en: {
    translation: {
      title: "Ogre!",
      imageAlt: "Ogre",
      newGame: "New Game",
      continue: "Continue",
      backToMenu: "Back to menu",
      end: "The End.",
      themeToDark: "Switch to dark theme",
      themeToLight: "Switch to light theme",
      themeDarkTitle: "Dark theme",
      themeLightTitle: "Light theme",
      musicOn: "Play music",
      musicOff: "Mute music",
      languageShort: "PL",
      switchLanguage: "Switch language to Polish",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["pl", "en"],
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "ogr:lang",
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
