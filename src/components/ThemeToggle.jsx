import { useTranslation } from "react-i18next";

// Przełącznik motywu w prawym górnym rogu.
// Jasny motyw -> ikona księżyca (hn-star-crescent)
// Ciemny motyw -> ikona słońca (hn-sun)
export default function ThemeToggle({ theme, onToggle }) {
  const { t } = useTranslation();
  const isLight = theme === "light";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isLight ? t("themeToDark") : t("themeToLight")}
      title={isLight ? t("themeDarkTitle") : t("themeLightTitle")}
    >
      <i
        className={isLight ? "hn hn-star-crescent" : "hn hn-sun"}
        aria-hidden="true"
      />
    </button>
  );
}
