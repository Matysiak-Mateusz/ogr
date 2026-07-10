import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMusicKey } from "./audio/musicMap.js";
import { useGameMusic } from "./audio/useGameMusic.js";
import GameScreen from "./components/GameScreen.jsx";
import StartScreen from "./components/StartScreen.jsx";
import {
  hasSave,
  loadMusicMuted,
  loadSave,
  loadTheme,
  saveMusicMuted,
  saveProgress,
  saveTheme,
} from "./engine/storage.js";
import { getStory } from "./engine/storyEngine.js";

export default function App() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("pl") ? "pl" : "en";
  const story = getStory(lang);

  const [theme, setTheme] = useState(() => loadTheme());
  const [screen, setScreen] = useState("start"); // 'start' | 'game'
  const [currentId, setCurrentId] = useState(
    () => loadSave()?.currentParagraphId || story.startId,
  );
  const [canContinue, setCanContinue] = useState(() => hasSave());
  const [musicMuted, setMusicMuted] = useState(() => loadMusicMuted());

  // Muzyka gra wyłącznie w trakcie rozgrywki (ekran 'game'), nigdy w menu.
  // Autoplay jest odblokowany, bo do 'game' wchodzimy tylko po kliknięciu
  // "Nowa Gra" / "Kontynuuj".
  useGameMusic({
    musicKey: getMusicKey(currentId),
    enabled: screen === "game",
    muted: musicMuted,
  });

  // Motyw sterowany atrybutem data-theme na <body>.
  useEffect(() => {
    document.body.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  // Atrybut lang na <html> podąża za wybranym językiem interfejsu.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  function toggleMusic() {
    setMusicMuted((m) => {
      const next = !m;
      saveMusicMuted(next);
      return next;
    });
  }

  function toggleLanguage() {
    i18n.changeLanguage(lang === "pl" ? "en" : "pl");
  }

  function startNewGame() {
    const id = story.startId;
    setCurrentId(id);
    saveProgress(id); // "Nowa Gra" nadpisuje zapis startem
    setCanContinue(true);
    setScreen("game");
  }

  function continueGame() {
    const saved = loadSave()?.currentParagraphId;
    const id = story.has(saved) ? saved : story.startId;
    setCurrentId(id);
    setScreen("game");
  }

  function goToParagraph(id) {
    if (!story.has(id)) return;
    setCurrentId(id);
    saveProgress(id);
    setCanContinue(true);
  }

  function backToMenu() {
    setScreen("start");
    setCanContinue(hasSave());
  }

  if (screen === "start") {
    return (
      <StartScreen
        theme={theme}
        onToggleTheme={toggleTheme}
        musicMuted={musicMuted}
        onToggleMusic={toggleMusic}
        onToggleLanguage={toggleLanguage}
        canContinue={canContinue}
        onNewGame={startNewGame}
        onContinue={continueGame}
      />
    );
  }

  const paragraph =
    story.getParagraph(currentId) || story.getParagraph(story.startId);

  return (
    <GameScreen
      paragraph={paragraph}
      theme={theme}
      onToggleTheme={toggleTheme}
      musicMuted={musicMuted}
      onToggleMusic={toggleMusic}
      onToggleLanguage={toggleLanguage}
      onChoose={goToParagraph}
      onEndNewGame={startNewGame}
      onBackToMenu={backToMenu}
    />
  );
}
