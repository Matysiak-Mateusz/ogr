# Ogr! — interaktywna gra paragrafowa

Dwujęzyczna (PL/EN) gra paragrafowa w klimacie pixel-art, zbudowana w React + Vite.
Prowadzisz bohatera przez las, by zdążyć z miksturą uzdrawiającą dla chorej siostry — a na drodze staje ogr. Twoje wybory decydują o zakończeniu.

## Live demo

🔗 _link zostanie dodany po wdrożeniu na Vercel_

## Funkcje

- **160+ paragraphów** z rozgałęzioną fabułą i wieloma zakończeniami
- **Dwujęzyczność (PL/EN)** — przełącznik języka + automatyczne wykrywanie języka przeglądarki (`i18next` / `react-i18next`)
- **Motyw jasny/ciemny** z płynnym przejściem, domyślnie wg preferencji systemu (`prefers-color-scheme`)
- **Dźwięk** w tle (`howler`) z możliwością wyciszenia
- Własny **parser markdown** zamieniający treść fabuły na silnik historii
- Dbałość o **dostępność** (focus-visible, cele dotykowe, `prefers-reduced-motion`)

## Stack

React 19 · Vite · i18next · Howler.js · pixel-art UI

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

## Build produkcyjny

```bash
npm run build
npm run preview
```

## Treść fabuły

Fabuła oparta na „Suddenly an Ogre" (CC BY-SA 4.0), zaadaptowana i przebudowana na potrzeby tej gry.
