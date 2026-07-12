// Wstawianie niełamliwych spacji po jednoliterowych i dwuliterowych spójnikach
// oraz przyimkach (polskie "sierotki"), aby nie zostawały na końcu wiersza.
//
// Pakiet `sierotki` zwraca encję HTML "&nbsp;", więc zamieniamy ją na realny
// znak spacji niełamliwej (\u00A0), który poprawnie renderuje się w React.
import { Sierotki } from "sierotki";

const NBSP = "\u00A0";

export function fixOrphans(text) {
  if (typeof text !== "string" || text.length === 0) return text;
  return Sierotki.orphansFix(text).replace(/&nbsp;/g, NBSP);
}
