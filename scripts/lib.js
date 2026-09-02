const { https } = require('follow-redirects');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pipeline } = require('stream/promises');
const unzipper = require('unzipper');

module.exports = {
  dictionaryPath,
  downloadZipEntries,
  extractWords,
};

function dictionaryPath(language, filename) {
  return path.join(__dirname, '..', language, filename);
}

async function downloadZipEntries(url, isWantedEntry, encoding = 'utf8') {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scrabble-dictionaries-'));

  try {
    const zipFilename = path.join(tmpDir, 'archive.zip');
    await downloadFile(url, zipFilename);
    return await readZipEntries(zipFilename, isWantedEntry, encoding);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function downloadFile(url, filename) {
  const response = await get(url);
  await pipeline(response, fs.createWriteStream(filename));
}

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
          response.resume();
          reject(new Error(`Cannot download ${url}: HTTP ${response.statusCode}`));
          return;
        }

        if (new URL(response.responseUrl).protocol !== 'https:') {
          response.resume();
          reject(new Error(`Refusing insecure redirect from ${url} to ${response.responseUrl}`));
          return;
        }

        resolve(response);
      })
      .on('error', reject);
  });
}

async function readZipEntries(zipFilename, isWantedEntry, encoding) {
  const directory = await unzipper.Open.file(zipFilename);
  const files = [];

  for (const entry of directory.files.filter(isWantedEntry)) {
    const buffer = await entry.buffer();
    files.push(buffer.toString(encoding));
  }

  return files;
}

function extractWords(file, locale) {
  const lines = file.split(/\r?\n/g);
  const words = new Set(lines.map((line) => line.trim().toLocaleLowerCase(locale).normalize('NFC')).filter(Boolean));

  return Array.from(words).sort(compareCodePoints).join('\n');
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
