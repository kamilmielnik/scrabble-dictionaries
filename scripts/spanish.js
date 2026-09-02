const fs = require('fs');

const { dictionaryPath, downloadZipEntries, extractWords } = require('./lib');

module.exports = updateSpanish;

async function updateSpanish() {
  await download({
    jarUrl: 'http://www.redeletras.com/diccionario/',
    outputFilename: dictionaryPath('spanish', 'fise-2.txt'),
  });
}

async function download({ jarUrl, outputFilename }) {
  const files = await downloadZipEntries(jarUrl, (entry) => entry.path.endsWith('.txt'));
  const file = files.join('\n').replaceAll('�', 'ñ');
  const words = extractWords(file);

  fs.writeFileSync(outputFilename, words);
}
