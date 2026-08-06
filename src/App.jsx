import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

// Ekrany gry i autorów ładowane leniwie — nie obciążają startowego bundla
// (m.in. howler trafia do osobnego chunku i pobiera się dopiero w grze).
const GameScreen = lazy(() => import("./components/GameScreen.jsx"));
const CreditsScreen = lazy(() => import("./components/CreditsScreen.jsx"));

const MORE_TOLL_TARGETS = new Set(["20.4", "20.6", "20.7"]);
const TOLL_CHOICE_PARAGRAPHS = new Set(["20", "20.0"]);

export default function App() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("pl") ? "pl" : "en";
  const story = getStory(lang);

  const [theme, setTheme] = useState(() => loadTheme());
  const [screen, setScreen] = useState("start"); // 'start' | 'game' | 'credits'
  const [currentId, setCurrentId] = useState(
    () => loadSave()?.currentParagraphId || story.startId,
  );
  const [hiddenTollChoiceTargets, setHiddenTollChoiceTargets] = useState(
    () => loadSave()?.hiddenTollChoiceTargets || {},
  );
  const [canContinue, setCanContinue] = useState(() => hasSave());
  const [musicMuted, setMusicMuted] = useState(() => loadMusicMuted());

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
    setHiddenTollChoiceTargets({});
    saveProgress(id, {}); // "Nowa Gra" nadpisuje zapis startem
    setCanContinue(true);
    setScreen("game");
  }

  function continueGame() {
    const save = loadSave();
    const saved = save?.currentParagraphId;
    const id = story.has(saved) ? saved : story.startId;
    setHiddenTollChoiceTargets(save?.hiddenTollChoiceTargets || {});
    setCurrentId(id);
    setScreen("game");
  }

  function goToParagraph(id) {
    if (!story.has(id)) return;
    const isTollChoiceParagraph = TOLL_CHOICE_PARAGRAPHS.has(currentId);
    const shouldHideChoice =
      isTollChoiceParagraph && MORE_TOLL_TARGETS.has(id);

    const nextHiddenTargets = shouldHideChoice
      ? { ...hiddenTollChoiceTargets, [id]: true }
      : hiddenTollChoiceTargets;

    if (shouldHideChoice) {
      setHiddenTollChoiceTargets(nextHiddenTargets);
    }

    setCurrentId(id);
    saveProgress(id, nextHiddenTargets);
    setCanContinue(true);
  }

  function backToMenu() {
    setScreen("start");
    setCanContinue(hasSave());
  }

  if (screen === "credits") {
    return (
      <Suspense
        fallback={<div className="route-fallback" aria-hidden="true" />}
      >
        <CreditsScreen
          onToggleLanguage={toggleLanguage}
          onBack={() => setScreen("start")}
        />
      </Suspense>
    );
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
        onCredits={() => setScreen("credits")}
      />
    );
  }

  const sourceParagraph =
    story.getParagraph(currentId) || story.getParagraph(story.startId);

  const paragraph =
    sourceParagraph && TOLL_CHOICE_PARAGRAPHS.has(sourceParagraph.id)
      ? {
          ...sourceParagraph,
          choices: sourceParagraph.choices.filter(
            (choice) => !hiddenTollChoiceTargets[choice.target],
          ),
        }
      : sourceParagraph;

  return (
    <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
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
    </Suspense>
  );
}
