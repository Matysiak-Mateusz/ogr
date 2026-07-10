import { useTranslation } from "react-i18next";

// Przełącznik języka w prawym górnym rogu (obok motywu i muzyki).
// Gdy gra jest po polsku, przycisk pokazuje "EN"; po angielsku — "PL".
export default function LanguageToggle({ onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className="language-toggle"
      onClick={onToggle}
      aria-label={t("switchLanguage")}
      title={t("switchLanguage")}
    >
      {t("languageShort")}
    </button>
  );
}
