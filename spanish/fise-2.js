const fs = require('fs');

const { downloadFile, extractWords, getNextTmpFilename, unzipFiles } = require('../_lib');

const JAR_URL = 'http://www.redeletras.com/diccionario/';
const OUTPUT_FILENAME = 'spanish/fise-2.txt';

module.exports = async () => {
  const zipFilename = await downloadFile(JAR_URL, getNextTmpFilename());
  const tmpFilenames = [];
  const files = [];

  await unzipFiles(zipFilename, (entry) => {
    if (entry.path.endsWith('.txt')) {
      const outputFilename = getNextTmpFilename();
      entry.pipe(fs.createWriteStream(outputFilename));
      tmpFilenames.push(outputFilename);
    } else {
      entry.autodrain();
    }
  });

  fs.unlinkSync(zipFilename);

  for (const filename of tmpFilenames) {
    const file = fs.readFileSync(filename, 'utf-8');
    files.push(file);
    fs.unlinkSync(filename);
  }

  const file = files.join('\n').replaceAll('�', 'ñ');
  const words = extractWords(file);

  fs.writeFileSync(OUTPUT_FILENAME, words);
};
