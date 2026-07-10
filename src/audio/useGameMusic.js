import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { MUSIC_FILES, MUSIC_VOLUME } from "./musicMap.js";

// Czas płynnego przejścia (fade in / fade out) w milisekundach.
const FADE_MS = 1200;
const DEFAULT_VOLUME = 0.45;

// Hook zarządzający muzyką tła zależną od aktualnego klimatu (musicKey).
//
// Zasady:
//  - muzyka gra tylko gdy enabled === true oraz muted === false,
//  - zmiana na TEN SAM musicKey nie restartuje utworu,
//  - zmiana na INNY musicKey: stary utwór robi fade out (i unload),
//    a nowy startuje od głośności 0 i robi fade in do docelowej głośności,
//  - każdy utwór gra w pętli (loop: true),
//  - cleanup zatrzymuje i zwalnia dźwięk po odmontowaniu.
export function useGameMusic({ musicKey, enabled, muted }) {
  // Aktualnie grający utwór: { key, howl } albo null.
  const currentRef = useRef(null);

  useEffect(() => {
    // Jaka muzyka powinna grać teraz? (null = cisza: menu lub wyciszenie)
    const desiredKey = enabled && !muted ? musicKey : null;
    const current = currentRef.current;

    // Nic się nie zmienia — właściwy utwór już gra (lub nadal cisza).
    if ((current?.key ?? null) === desiredKey) {
      return undefined;
    }

    // Wygaś i zwolnij poprzedni utwór (jeśli istnieje).
    if (current?.howl) {
      const old = current.howl;
      currentRef.current = null;
      try {
        old.fade(old.volume(), 0, FADE_MS);
      } catch {
        /* dźwięk mógł nie być gotowy — po prostu go zwolnimy */
      }
      // Po zakończeniu fade out zatrzymaj i zwolnij zasób.
      window.setTimeout(() => {
        old.stop();
        old.unload();
      }, FADE_MS + 50);
    }

    // Cisza (menu / mute) — nie startujemy nowego utworu.
    if (!desiredKey) {
      return undefined;
    }

    // Utwórz nowy utwór i zrób fade in od 0 do docelowej głośności.
    const targetVolume = MUSIC_VOLUME[desiredKey] ?? DEFAULT_VOLUME;
    const howl = new Howl({
      src: [MUSIC_FILES[desiredKey]],
      loop: true,
      volume: 0,
    });
    howl.play();
    howl.fade(0, targetVolume, FADE_MS);
    currentRef.current = { key: desiredKey, howl };

    return undefined;
  }, [musicKey, enabled, muted]);

  // Cleanup po odmontowaniu komponentu — zatrzymaj i zwolnij muzykę.
  useEffect(() => {
    return () => {
      const current = currentRef.current;
      if (current?.howl) {
        current.howl.stop();
        current.howl.unload();
        currentRef.current = null;
      }
    };
  }, []);
}
