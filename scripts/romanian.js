const fs = require('fs');

const { downloadZipEntries, extractWords } = require('./lib');

module.exports = updateRomanian;

async function updateRomanian() {
  await download({
    zipUrl: 'https://dexonline.ro/static/download/scrabble/loc-flexiuni-4.0.zip',
    zippedFilename: 'loc-flexiuni-4.0.txt',
    outputFilename: './romanian/loc-4.0.txt',
  });
  await download({
    zipUrl: 'https://dexonline.ro/static/download/scrabble/loc-flexiuni-4.1.zip',
    zippedFilename: 'loc-flexiuni-4.1.txt',
    outputFilename: './romanian/loc-4.1.txt',
  });
  await download({
    zipUrl: 'https://dexonline.ro/static/download/scrabble/loc-flexiuni-5.0.zip',
    zippedFilename: 'loc-flexiuni-5.0.txt',
    outputFilename: './romanian/loc-5.0.txt',
  });
  await download({
    zipUrl: 'https://dexonline.ro/static/download/scrabble/loc-flexiuni-6.0.zip',
    zippedFilename: 'loc-flexiuni-6.0.txt',
    outputFilename: './romanian/loc-6.0.txt',
  });
}

async function download({ zipUrl, zippedFilename, outputFilename }) {
  const [file] = await downloadZipEntries(zipUrl, (entry) => entry.path === zippedFilename);
  const words = extractWords(file);

  fs.writeFileSync(outputFilename, words);
}
