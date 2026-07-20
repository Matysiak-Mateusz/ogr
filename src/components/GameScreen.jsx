import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMusicKey } from "../audio/musicMap.js";
import { useGameMusic } from "../audio/useGameMusic.js";
import LanguageToggle from "./LanguageToggle.jsx";
import MusicToggle from "./MusicToggle.jsx";
import PixelButton from "./PixelButton.jsx";
import PixelFrame from "./PixelFrame.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

// Czas wypisywania jednego znaku (ms). Wygodne tempo czytania: ~40 znaków/s.
const TYPE_SPEED_MS = 24;

// Odstęp czasowy między pojawianiem się kolejnych przycisków (ms) — efekt schodkowy.
const CHOICE_STAGGER_MS = 300;

// Ekran gry: ramka z tekstem paragrafu (efekt pisania), wybory i zakończenia.
export default function GameScreen({
  paragraph,
  theme,
  onToggleTheme,
  musicMuted,
  onToggleMusic,
  onToggleLanguage,
  onChoose,
  onEndNewGame,
  onBackToMenu,
}) {
  const { t } = useTranslation();
  const [displayed, setDisplayed] = useState(""); // aktualnie wypisany fragment
  const [revealed, setRevealed] = useState(false); // czy cały tekst jest już widoczny
  const [visibleCount, setVisibleCount] = useState(0); // ile przycisków już wyszło (efekt schodkowy)
  const [skipped, setSkipped] = useState(false); // czy gracz pominął animacje (klik)
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);
  const revealTimerRef = useRef(null);

  // Muzyka gra tylko na ekranie gry (ten komponent renderuje się wyłącznie w grze).
  // Autoplay odblokowany, bo wchodzimy tu po kliknięciu "Nowa Gra" / "Kontynuuj".
  useGameMusic({
    musicKey: getMusicKey(paragraph.id),
    enabled: true,
    muted: musicMuted,
  });

  const isEnd = paragraph.type === "end";

  // Lista akcji (wyborów / kontynuacji) dla aktualnego paragrafu.
  const actions = useMemo(() => {
    if (paragraph.type === "choices") {
      return paragraph.choices.map((choice) => ({
        label: choice.text,
        onSelect: () => onChoose(choice.target),
      }));
    }
    if (paragraph.type === "continue" && paragraph.next) {
      return [
        { label: t("continue"), onSelect: () => onChoose(paragraph.next) },
      ];
    }
    return [];
  }, [paragraph, onChoose, t]);

  // Efekt maszyny do pisania: dopisuj znaki jeden po drugim.
  // Własna implementacja jest odporna na podwójny montaż w React StrictMode.
  useEffect(() => {
    const full = paragraph.text;
    setDisplayed("");
    setRevealed(false);
    setSkipped(false);
    setFocusedIndex(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    if (!full) {
      setRevealed(true);
      return undefined;
    }

    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRevealed(true);
      }
    }, TYPE_SPEED_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [paragraph.id, paragraph.text]);

  // Po odsłonięciu tekstu wróć na górę, aby kontekst paragrafu był widoczny
  // (gracz nie może zostać z samymi wyborami bez treści).
  useEffect(() => {
    if (revealed && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [revealed]);

  // Schodkowe pojawianie się przycisków: po odsłonięciu tekstu montujemy je
  // pojedynczo, jeden po drugim, z odstępem czasowym (ładna kaskada).
  useEffect(() => {
    if (!revealed) {
      setVisibleCount(0);
      return undefined;
    }
    const total = isEnd ? 3 : actions.length;
    if (total === 0) return undefined;

    // Po pominięciu (klik) pokazujemy wszystkie przyciski od razu, bez kaskady.
    if (skipped) {
      setVisibleCount(total);
      return undefined;
    }

    setVisibleCount(1); // pierwszy element od razu
    let n = 1;
    revealTimerRef.current = setInterval(() => {
      n += 1;
      setVisibleCount(n);
      if (n >= total) {
        clearInterval(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    }, CHOICE_STAGGER_MS);

    return () => {
      if (revealTimerRef.current) {
        clearInterval(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [revealed, isEnd, actions.length, skipped]);

  // Nawigacja klawiaturą po wyborach.
  useEffect(() => {
    function onKey(event) {
      if (!revealed || actions.length === 0) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((i) => (i + 1) % actions.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((i) => (i - 1 + actions.length) % actions.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        actions[focusedIndex]?.onSelect();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, actions, focusedIndex]);

  // Kliknięcie w obszar gry pomija animacje: najpierw dopisanie tekstu,
  // a potem (przy kolejnym kliknięciu lub od razu) natychmiastowe wyborów.
  function handleSkip() {
    if (!revealed) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setDisplayed(paragraph.text);
      setRevealed(true);
      setSkipped(true);
    } else {
      // Tekst już widoczny, ale przyciski wciąż wchodzą kaskadą — pokaż wszystkie.
      setSkipped(true);
    }
  }

  return (
    <main className="game-screen" onClick={handleSkip}>
      <div className="top-bar" onClick={(e) => e.stopPropagation()}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <MusicToggle muted={musicMuted} onToggle={onToggleMusic} />
        <LanguageToggle onToggle={onToggleLanguage} />
      </div>

      <PixelFrame className="game-frame">
        <div className="game-scroll" ref={scrollRef}>
          <div className="paragraph-text">
            {revealed ? paragraph.text : displayed}
          </div>

          {revealed && (
            <div className={`choices${skipped ? " no-anim" : ""}`}>
              {isEnd ? (
                <>
                  {visibleCount >= 1 && (
                    <h2 className="ending-label">{t("end")}</h2>
                  )}
                  {visibleCount >= 2 && (
                    <PixelButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onEndNewGame();
                      }}
                    >
                      {t("newGame")}
                    </PixelButton>
                  )}
                  {visibleCount >= 3 && (
                    <PixelButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onBackToMenu();
                      }}
                    >
                      {t("backToMenu")}
                    </PixelButton>
                  )}
                </>
              ) : (
                actions.slice(0, visibleCount).map((action, index) => (
                  <PixelButton
                    key={index}
                    active={index === focusedIndex}
                    aria-label={action.label}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onSelect();
                    }}
                  >
                    <span aria-hidden="true">► </span>
                    {action.label}
                  </PixelButton>
                ))
              )}
            </div>
          )}
        </div>
      </PixelFrame>
    </main>
  );
}
