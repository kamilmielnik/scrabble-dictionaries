const { http, https } = require('follow-redirects');
const fs = require('fs');
const unzipper = require('unzipper');

module.exports = {
  downloadFile,
  extractWords,
  readZipEntries,
};

function downloadFile(url) {
  const filename = getNextTmpFilename();

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const writeStream = fs.createWriteStream(filename);
    const request = protocol.get(url, (response) => {
      if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
        reject(new Error(`Cannot download file: ${url}`));
        return;
      }

      response.on('error', (error) => {
        writeStream.close();
        reject(error);
      });

      response.on('end', () => {
        writeStream.on('finish', () => {
          writeStream.close();
          resolve(filename);
        });
      });

      response.pipe(writeStream);
    });

    request.on('error', (error) => {
      writeStream.close();
      reject(error);
    });
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
