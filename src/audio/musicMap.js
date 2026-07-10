// Mapa muzyki tła zależnej od aktualnego paragrafu gry "Ogr!".
//
// Każdy paragraf należy do jednej z kategorii klimatycznych. Niektóre paragrafy
// pasują do kilku kategorii naraz — o wyborze decyduje priorytet (MUSIC_PRIORITY).

// Ścieżki do plików audio (serwowane z folderu public/).
// UWAGA: combat.OGG ma wielkie litery w rozszerzeniu — zalecana zmiana nazwy na
// combat.ogg, ale poniższa ścieżka działa też z obecną nazwą pliku.
export const MUSIC_FILES = {
  ending: "/audio/ending.mp3",
  combat: "/audio/combat.OGG",
  dark_forest: "/audio/dark_forest.ogg",
  ogre: "/audio/ogre.wav",
  black_gates: "/audio/black_gates.mp3",
};

// Docelowa głośność każdej kategorii (0..1). Combat odrobinę głośniejszy.
export const MUSIC_VOLUME = {
  ending: 0.45,
  combat: 0.5,
  dark_forest: 0.45,
  ogre: 0.45,
  black_gates: 0.45,
};

// Listy paragrafów przypisane do poszczególnych kategorii muzyki.
const MUSIC_GROUPS = {
  ending: [
    60, 76, 84, 90, 93, 99, 105, 117, 124, 70, 73, 97, 100, 102, 111, 119, 130,
  ],
  combat: [
    17, 19, 25, 27, 29, 33, 35, 36, 39, 43, 45, 50, 55, 57, 58, 61, 64, 66, 69,
    71, 74, 77, 83, 85, 87, 88, 91, 92, 94, 101, 106, 107, 113, 115, 116, 118,
    120, 121, 122, 124, 126, 127, 129, 131, 132, 133, 134, 135, 137, 138, 140,
    141, 142, 143, 144, 145, 146, 148, 149, 150, 151, 152, 153, 154, 155, 156,
    157, 158, 159, 160,
  ],
  dark_forest: [
    1, 2, 4, 7, 9, 10, 11, 13, 15, 16, 22, 23, 24, 30, 31, 37, 38, 40, 42, 49,
    63, 67, 68, 78, 86, 89, 95, 103, 108, 109,
  ],
  ogre: [
    3, 5, 6, 12, 18, 21, 26, 32, 34, 44, 47, 48, 51, 53, 59, 79, 96, 104, 112,
    125, 128, 8, 14, 20, 28, 41, 46, 52, 54, 62, 72, 76, 80, 82, 93, 105, 110,
    114, 123, 136, 147,
  ],
  black_gates: [75, 81, 90, 98, 99, 117],
};

// Priorytet: gdy paragraf pasuje do kilku kategorii, wygrywa pierwsza z listy.
// black_gates > ending > combat > ogre > dark_forest
export const MUSIC_PRIORITY = [
  "black_gates",
  "ending",
  "combat",
  "ogre",
  "dark_forest",
];

// Zwraca klucz muzyki dla podanego id paragrafu.
// Domyślnie (brak dopasowania / nienumeryczne id) -> 'dark_forest'.
export function getMusicKey(paragraphId) {
  const id = Number(paragraphId);
  if (!Number.isNaN(id)) {
    for (const key of MUSIC_PRIORITY) {
      if (MUSIC_GROUPS[key].includes(id)) {
        return key;
      }
    }
  }
  return "dark_forest";
}
