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

async function downloadZipEntries(url, isWantedEntry) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scrabble-dictionaries-'));

  try {
    const zipFilename = path.join(tmpDir, 'archive.zip');
    await downloadFile(url, zipFilename);
    return await readZipEntries(zipFilename, isWantedEntry);
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

async function readZipEntries(zipFilename, isWantedEntry) {
  const directory = await unzipper.Open.file(zipFilename);
  const files = [];

  for (const entry of directory.files.filter(isWantedEntry)) {
    const buffer = await entry.buffer();
    files.push(buffer.toString('utf-8'));
  }

  return files;
}

function extractWords(file) {
  const lines = file.toLocaleLowerCase().split(/\r?\n/g);
  const words = lines
    .map((word) => word.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const uniqueWords = Array.from(new Set(words));
  const output = uniqueWords.join('\n');

  return output;
}
