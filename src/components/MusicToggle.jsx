import { useTranslation } from "react-i18next";

// Przełącznik muzyki w prawym górnym rogu (pod przełącznikiem motywu).
// Muzyka gra  -> ikona hn-sound-on
// Muzyka mute -> ikona hn-sound-mute
export default function MusicToggle({ muted, onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className="music-toggle"
      onClick={onToggle}
      aria-label={muted ? t("musicOn") : t("musicOff")}
      title={muted ? t("musicOn") : t("musicOff")}
      aria-pressed={muted}
    >
      <i
        className={muted ? "hn hn-sound-mute" : "hn hn-sound-on"}
        aria-hidden="true"
      />
    </button>
  );
}
