module.exports = {
  compareCodePoints,
  extractWords,
};

function extractWords(file, locale) {
  const lines = file.split(/\r?\n/g);
  const words = new Set(lines.map((line) => line.trim().toLocaleLowerCase(locale).normalize('NFC')).filter(isWord));

  return Array.from(words).sort(compareCodePoints);
}

function isWord(line) {
  return /^\p{L}+$/u.test(line);
}

function compareCodePoints(a, b) {
  const length = Math.min(a.length, b.length);

  for (let index = 0; index < length; index++) {
    const codePoint = a.codePointAt(index);
    const difference = codePoint - b.codePointAt(index);

    if (difference !== 0) {
      return difference;
    }

    if (codePoint > 0xffff) {
      index++;
    }
  }

  return a.length - b.length;
}
