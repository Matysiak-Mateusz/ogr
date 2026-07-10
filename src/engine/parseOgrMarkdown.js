// Parser markdowna gry "Ogr!" -> struktura paragrafów dla silnika historii.
//
// Obsługiwany format (plik src/content/ogr.md):
//   # 59 :                      -> nagłówek paragrafu (id = "59")
//   # 20.1 : Racje żywnościowe   -> id = "20.1" (tytuł po dwukropku jest ignorowany)
//   # Prolog                    -> id = "Prolog"
//   ➢ Tekst wyboru: przejdź do 34.   -> wybór (cel = "34")
//   ➢ Pytanie? przejdź do 5.         -> wybór bez dwukropka (cel = "5")
//   **Przejdź do 31.**               -> automatyczne przejście (przycisk "Kontynuuj")
//   Wróć do 20.                      -> automatyczne przejście
//   **Koniec.**                      -> zakończenie
//
// Bloki ``` (code fence) są ignorowane, ale ich zawartość pozostaje tekstem.
// Numery docelowe zapisujemy w danych, ale nie pokazujemy ich graczowi.

// Wzorce przejść rozpoznają wersję polską ("przejdź/wróć do N")
// oraz angielską ("go to N" / "go back to N"), dzięki czemu ten sam
// parser obsługuje pliki ogr.md i ogr_en.md.
const TRANSITION_RE =
  /(?:(?:przejd[źz]|wr[óo][ćc])\s+do|go(?:\s+back)?\s+to)\s+([0-9]+(?:\.[0-9]+)?)/i;
const BARE_TRANSITION_RE =
  /^(?:(?:przejd[źz]|wr[óo][ćc])\s+do|go(?:\s+back)?\s+to)\s+[0-9]+(?:\.[0-9]+)?\.?$/i;
const END_RE = /^\**\s*(?:koniec|the\s+end)\.?\s*\**$/i;

function extractId(headerLine) {
  const raw = headerLine.replace(/^#+\s*/, "").trim();
  // id = pierwszy token przed dwukropkiem lub spacją, np. "20.1", "2", "Prolog"
  return raw.split(/[:\s]+/)[0].trim();
}

function cleanChoiceText(line) {
  let text = line.replace(/^\s*➢\s*/, "").trim();
  // usuń końcówkę typu ": przejdź do 34." / " przejdź do 5." / ": go to 25."
  text = text.replace(
    /[:.]?\s*(?:(?:przejd[źz]|wr[óo][ćc])\s+do|go(?:\s+back)?\s+to)\s+[0-9]+(?:\.[0-9]+)?\.?\s*$/i,
    "",
  );
  return text.replace(/[:\s]+$/, "").trim() || "Kontynuuj";
}

export function parseOgrMarkdown(markdown) {
  const lines = String(markdown).split(/\r?\n/);
  const collected = [];
  let current = null;

  for (const line of lines) {
    if (/^#\s+.+$/.test(line)) {
      if (current) collected.push(current);
      current = { id: extractId(line), rawLines: [] };
      continue;
    }
    if (current) current.rawLines.push(line);
  }
  if (current) collected.push(current);

  const order = collected.map((p) => p.id);
  const paragraphs = {};

  collected.forEach((p, index) => {
    const textLines = [];
    const choices = [];
    let autoNext = null;
    let isEnd = false;

    for (const rawLine of p.rawLines) {
      const line = rawLine.trim();

      if (line.startsWith("```")) continue; // pomiń znaczniki code fence

      if (line.startsWith("➢")) {
        const match = line.match(TRANSITION_RE);
        if (match)
          choices.push({ text: cleanChoiceText(line), target: match[1] });
        continue;
      }

      if (END_RE.test(line)) {
        isEnd = true;
        continue;
      }

      const bare = line.replace(/\*/g, "").trim();
      if (BARE_TRANSITION_RE.test(bare)) {
        const match = bare.match(TRANSITION_RE);
        if (match) autoNext = match[1];
        continue;
      }

      textLines.push(rawLine);
    }

    let type;
    let next = null;
    if (choices.length > 0) {
      type = "choices";
    } else if (isEnd) {
      type = "end";
    } else if (autoNext) {
      type = "continue";
      next = autoNext;
    } else {
      // brak jawnego przejścia (np. Prolog) -> kontynuuj do kolejnego paragrafu w pliku
      const fallback = order[index + 1] || null;
      if (fallback) {
        type = "continue";
        next = fallback;
      } else {
        type = "end";
      }
    }

    const text = textLines
      .join("\n")
      .replace(/\*\*/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    paragraphs[p.id] = { id: p.id, text, choices, type, next };
  });

  return { paragraphs, order, startId: order[0] || null };
}
