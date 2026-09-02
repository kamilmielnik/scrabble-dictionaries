const fs = require('fs');

const { downloadFile, extractWords, readZipEntries } = require('./lib');

module.exports = updateSpanish;

async function updateSpanish() {
  await download({
    jarUrl: 'http://www.redeletras.com/diccionario/',
    outputFilename: './spanish/fise-2.txt',
  });
}

async function download({ jarUrl, outputFilename }) {
  const zipFilename = await downloadFile(jarUrl);
  const files = await readZipEntries(zipFilename, (entry) => entry.path.endsWith('.txt'));
  const file = files.join('\n').replaceAll('�', 'ñ');
  const words = extractWords(file);

  fs.unlinkSync(zipFilename);
  fs.writeFileSync(outputFilename, words);
}
