const { http, https } = require('follow-redirects');
const fs = require('fs');
const { pipeline } = require('stream/promises');
const unzipper = require('unzipper');

module.exports = {
  downloadFile,
  extractWords,
  readZipEntries,
};

async function downloadFile(url) {
  const filename = getNextTmpFilename();
  const response = await get(url);

  try {
    await pipeline(response, fs.createWriteStream(filename));
  } catch (error) {
    fs.rmSync(filename, { force: true });
    throw error;
  }

  return filename;
}

function get(url) {
  const protocol = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    protocol
      .get(url, (response) => {
        if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
          response.resume();
          reject(new Error(`Cannot download ${url}: HTTP ${response.statusCode}`));
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

let tmpFilenameIndex = 0;

function getNextTmpFilename() {
  return `tmp-${++tmpFilenameIndex}`;
}
