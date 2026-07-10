// Warstwa silnika historii inspirowana koncepcją ink / inkjs.
//
// Udostępnia proste API (startId, getParagraph, has), z którego korzysta UI.
// Historia istnieje w dwóch językach (polskim i angielskim) o identycznych
// identyfikatorach paragrafów, dzięki czemu zapis gry i bieżący paragraf
// pozostają poprawne po zmianie języka.
//   { id, text, choices: [{ text, target }], type: 'choices'|'continue'|'end', next }

import ogrPlRaw from "../content/ogr.md?raw";
import ogrEnRaw from "../content/ogr_en.md?raw";
import { parseOgrMarkdown } from "./parseOgrMarkdown.js";

function buildStory(raw) {
  const parsed = parseOgrMarkdown(raw);
  return {
    startId: parsed.startId,
    order: parsed.order,
    getParagraph(id) {
      return parsed.paragraphs[id] || null;
    },
    has(id) {
      return Boolean(id && parsed.paragraphs[id]);
    },
  };
}

const stories = {
  pl: buildStory(ogrPlRaw),
  en: buildStory(ogrEnRaw),
};

export function getStory(lang) {
  return stories[lang] || stories.pl;
}

export const story = stories.pl;

export default story;
