// Warstwa silnika historii inspirowana koncepcją ink / inkjs.
//
// Udostępnia proste API (startId, getParagraph, has), z którego korzysta UI.
// Historia istnieje w dwóch językach (polskim i angielskim) o identycznych
// identyfikatorach paragrafów, dzięki czemu zapis gry i bieżący paragraf
// pozostają poprawne po zmianie języka.
//   { id, text, choices: [{ text, target }], type: 'choices'|'continue'|'end', next }

import ogrPlRaw from "../content/ogr.md?raw";
import ogrEnRaw from "../content/ogr_en.md?raw";
import { fixOrphans } from "../utils/orphans.js";
import { parseOgrMarkdown } from "./parseOgrMarkdown.js";

// `transform` pozwala przetworzyć tekst paragrafów i wyborów (np. wersja
// polska dostaje niełamliwe spacje po jednoliterowych spójnikach).
function buildStory(raw, transform = (s) => s) {
  const parsed = parseOgrMarkdown(raw);
  const paragraphs = {};
  for (const id of parsed.order) {
    const p = parsed.paragraphs[id];
    paragraphs[id] = {
      ...p,
      text: transform(p.text),
      choices: p.choices.map((c) => ({ ...c, text: transform(c.text) })),
    };
  }
  return {
    startId: parsed.startId,
    order: parsed.order,
    getParagraph(id) {
      return paragraphs[id] || null;
    },
    has(id) {
      return Boolean(id && paragraphs[id]);
    },
  };
}

const stories = {
  pl: buildStory(ogrPlRaw, fixOrphans),
  en: buildStory(ogrEnRaw),
};

export function getStory(lang) {
  return stories[lang] || stories.pl;
}

export const story = stories.pl;

export default story;
