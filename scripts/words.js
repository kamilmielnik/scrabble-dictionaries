module.exports = {
  compareWords,
  extractWords,
};

function extractWords(file, locale) {
  const lines = file.split(/\r?\n/g);
  const words = new Set(lines.map((line) => line.trim().toLocaleLowerCase(locale).normalize('NFC')).filter(isWord));

  return Array.from(words).sort(compareWords(locale));
}

function isWord(line) {
  return /^\p{L}+$/u.test(line);
}

function compareWords(locale) {
  return new Intl.Collator(locale).compare;
}
