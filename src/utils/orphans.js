// Wstawianie niełamliwych spacji po polskich "sierotkach" — słowach, które
// nie powinny zostawać na końcu wiersza (jednoliterowe przyimki/spójniki
// oraz krótkie spójniki i przyimki, np. "ale", "lub", "oraz").
//
// Uwaga: nie korzystamy z pakietu `sierotki`, ponieważ używa on `\W` jako
// granicy słowa, a `\W` traktuje polskie znaki diakrytyczne (ą, ę, ż, ...)
// jako granicę — przez co błędnie sklejał ze sobą także dłuższe wyrazy.
// Poniższy skrypt jest świadomy liter Unicode (\p{L}) i działa poprawnie.

const NBSP = "\u00A0";

// Wieloliterowe spójniki i przyimki, które mają trzymać się następnego słowa.
const WORDS = [
  "ale",
  "albo",
  "lub",
  "oraz",
  "czy",
  "czyli",
  "ani",
  "bądź",
  "więc",
  "lecz",
  "zaś",
  "niż",
  "jak",
  "aby",
  "żeby",
  "gdy",
  "gdyż",
  "choć",
  "chociaż",
  "toteż",
  "tudzież",
  "bowiem",
  "jednak",
  "we",
  "ze",
  "za",
  "na",
  "do",
  "od",
  "po",
  "bo",
  "że",
  "by",
  "iż",
  "ku",
  "nad",
  "pod",
  "bez",
  "dla",
  "przy",
  "przez",
];

// Sieroty jednoliterowe: a, i, o, u, w, z (oraz wersje wielkie).
// Lookbehind (?<![\p{L}]) zapewnia, że przed słowem nie stoi żadna litera,
// dzięki czemu poprawnie obsługujemy też sąsiadujące spójniki.
const singleRegExp = /(?<![\p{L}])([aiouwz]) /giu;
const wordsRegExp = new RegExp(
  "(?<![\\p{L}])(" + WORDS.join("|") + ") ",
  "giu",
);

export function fixOrphans(text) {
  if (typeof text !== "string" || text.length === 0) return text;
  return text
    .replace(singleRegExp, "$1" + NBSP)
    .replace(wordsRegExp, "$1" + NBSP);
}
