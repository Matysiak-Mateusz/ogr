import { useTranslation } from "react-i18next";
import ogreDark from "../assets/ogre-dark.webp";
import ogreLight from "../assets/ogre-light.webp";
import LanguageToggle from "./LanguageToggle.jsx";
import MusicToggle from "./MusicToggle.jsx";
import PixelButton from "./PixelButton.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

// Ekran startowy: grafika ogra, tytuł, menu oraz przyciski w prawym górnym rogu.
export default function StartScreen({
  theme,
  onToggleTheme,
  musicMuted,
  onToggleMusic,
  onToggleLanguage,
  canContinue,
  onNewGame,
  onContinue,
}) {
  const { t } = useTranslation();
  const ogre = theme === "light" ? ogreLight : ogreDark;

  return (
    <div className="start-screen">
      <div className="top-bar">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <MusicToggle muted={musicMuted} onToggle={onToggleMusic} />
        <LanguageToggle onToggle={onToggleLanguage} />
      </div>

      <img className="ogre-image" src={ogre} alt={t("imageAlt")} />

      <h1 className="game-title">{t("title")}</h1>

      <div className="menu">
        <PixelButton onClick={onNewGame}>{t("newGame")}</PixelButton>
        <PixelButton onClick={onContinue} disabled={!canContinue}>
          {t("continue")}
        </PixelButton>
      </div>
    </div>
  );
}
