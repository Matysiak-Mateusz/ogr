import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle.jsx";
import MusicToggle from "./MusicToggle.jsx";
import PixelButton from "./PixelButton.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

// Obrazy leżą w public/, aby można je było preloadować w index.html (LCP).
const OGRE_LIGHT = "/ogre-light.webp";
const OGRE_DARK = "/ogre-dark.webp";
// Intrinsyczne wymiary grafiki — rezerwują miejsce (brak przesunięć układu / CLS).
const OGRE_W = 2840;
const OGRE_H = 2088;

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
  onCredits,
}) {
  const { t } = useTranslation();
  const ogreSrc = theme === "light" ? OGRE_LIGHT : OGRE_DARK;

  const imgRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  // Czy czcionka tytułu (Daydream) jest już gotowa — jeśli tak (np. cache),
  // od razu pokazujemy tytuł bez migotania szkieletu.
  const [fontReady, setFontReady] = useState(() => {
    try {
      return document.fonts?.check?.('1rem "Daydream"') ?? true;
    } catch {
      return true;
    }
  });

  // Reset stanu ładowania obrazu przy zmianie motywu (inne źródło).
  // Obrazy z cache mogą być gotowe zanim podłączy się onLoad — sprawdzamy complete.
  useEffect(() => {
    setImgLoaded(Boolean(imgRef.current?.complete));
  }, [ogreSrc]);

  // Czekaj na załadowanie czcionki Daydream, potem odsłoń tytuł (bez skoku układu).
  useEffect(() => {
    if (fontReady || !document.fonts?.load) return undefined;
    let alive = true;
    const done = () => alive && setFontReady(true);
    document.fonts.load('1rem "Daydream"').then(done, done);
    return () => {
      alive = false;
    };
  }, [fontReady]);

  return (
    <main className="start-screen">
      <div className="top-bar">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <MusicToggle muted={musicMuted} onToggle={onToggleMusic} />
        <LanguageToggle onToggle={onToggleLanguage} />
      </div>

      <div className={`ogre-wrap${imgLoaded ? " is-loaded" : ""}`}>
        <div className="ogre-skeleton" aria-hidden="true" />
        <img
          ref={imgRef}
          className="ogre-image"
          src={ogreSrc}
          alt={t("imageAlt")}
          width={OGRE_W}
          height={OGRE_H}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      <div className="title-wrap">
        {!fontReady && <span className="title-skeleton" aria-hidden="true" />}
        <h1 className={`game-title${fontReady ? " is-ready" : ""}`}>
          {t("title")}
        </h1>
      </div>

      <div className="menu">
        <PixelButton onClick={onNewGame}>{t("newGame")}</PixelButton>
        <PixelButton onClick={onContinue} disabled={!canContinue}>
          {t("continue")}
        </PixelButton>
        <PixelButton onClick={onCredits}>{t("credits")}</PixelButton>
      </div>
    </main>
  );
}
