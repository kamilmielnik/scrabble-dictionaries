const { https } = require('follow-redirects');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { text } = require('stream/consumers');
const { pipeline } = require('stream/promises');
const unzipper = require('unzipper');
const locales = require('./locales');
const { extractWords } = require('./words');

module.exports = {
  updateDictionary,
  updateTextDictionary,
};

async function updateDictionary({ language, filename, url, encoding, isWantedEntry }) {
  console.log(`Downloading ${url}`);
  const files = await downloadZipEntries(url, isWantedEntry, encoding);
  saveDictionary(language, filename, files.join('\n'));
}

async function updateTextDictionary({ language, filename, url, getWord }) {
  console.log(`Downloading ${url}`);
  const file = await text(await get(url));
  saveDictionary(language, filename, file.split('\n').map(getWord).join('\n'));
}

function saveDictionary(language, filename, file) {
  const words = extractWords(file, locales[language]);
  fs.writeFileSync(path.join(__dirname, '..', language, filename), words.join('\n'));
  console.log(`Saved ${words.length} words to ${language}/${filename}`);
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
