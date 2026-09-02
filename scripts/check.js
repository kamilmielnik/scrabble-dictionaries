const fs = require('fs');
const path = require('path');
const locales = require('./locales');
const { compareCodePoints } = require('./words');

const ROOT = path.join(__dirname, '..');
const MAX_REPORTED_PROBLEMS = 10;

process.exitCode = checkAllDictionaries() ? 0 : 1;

function checkAllDictionaries() {
  let allValid = true;

  for (const [language, locale] of Object.entries(locales)) {
    for (const filename of listDictionaries(language)) {
      const problems = checkDictionary(path.join(ROOT, language, filename), locale);
      report(`${language}/${filename}`, problems);
      allValid &&= problems.length === 0;
    }
  }

  return allValid;
}

function listDictionaries(language) {
  return fs
    .readdirSync(path.join(ROOT, language))
    .filter((filename) => filename.endsWith('.txt'))
    .sort();
}

function checkDictionary(filePath, locale) {
  const content = fs.readFileSync(filePath, 'utf8');
  const problems = [];

  if (content.startsWith('﻿')) {
    problems.push('starts with a byte order mark');
  }

  if (content.includes('�')) {
    problems.push('contains invalid UTF-8');
  }

  if (content.includes('\r')) {
    problems.push('contains CR characters');
  }

  if (content.endsWith('\n')) {
    problems.push('ends with a trailing line feed');
  }

  const words = content.split('\n');

  words.forEach((word, index) => {
    const line = index + 1;

    if (word === '') {
      problems.push(`line ${line}: empty`);
    } else if (word !== word.trim()) {
      problems.push(`line ${line}: surrounding whitespace`);
    }

    if (word !== word.toLocaleLowerCase(locale)) {
      problems.push(`line ${line}: not lowercase: ${word}`);
    }

    if (word !== word.normalize('NFC')) {
      problems.push(`line ${line}: not NFC-normalized: ${word}`);
    }

    if (index > 0) {
      const order = compareCodePoints(words[index - 1], word);

      if (order === 0) {
        problems.push(`line ${line}: duplicate: ${word}`);
      } else if (order > 0) {
        problems.push(`line ${line}: out of order: ${words[index - 1]} > ${word}`);
      }
    }
  });

  return problems;
}

function report(name, problems) {
  if (problems.length === 0) {
    console.log(`OK    ${name}`);
    return;
  }

  console.log(`FAIL  ${name} (${problems.length} problems)`);

  for (const problem of problems.slice(0, MAX_REPORTED_PROBLEMS)) {
    console.log(`      ${problem}`);
  }

  if (problems.length > MAX_REPORTED_PROBLEMS) {
    console.log(`      ... and ${problems.length - MAX_REPORTED_PROBLEMS} more`);
  }
}
