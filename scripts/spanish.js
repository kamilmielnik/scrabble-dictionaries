const fs = require('fs');

const { dictionaryPath, downloadZipEntries, extractWords } = require('./lib');

module.exports = updateSpanish;

async function updateSpanish() {
  await download({
    jarUrl: 'https://www.redeletras.com/diccionario/',
    outputFilename: dictionaryPath('spanish', 'fise-2.txt'),
  });
}

async function download({ jarUrl, outputFilename }) {
  const files = await downloadZipEntries(jarUrl, (entry) => entry.path.endsWith('.txt'), 'latin1');
  const file = files.join('\n');
  const words = extractWords(file, 'es');

  fs.writeFileSync(outputFilename, words);
}
