const fs = require('fs');

const { downloadFile, extractWords, getNextTmpFilename, unzipFiles } = require('../_lib');

const ZIP_URL = 'https://dexonline.ro/static/download/scrabble/loc-flexiuni-4.0.zip';
const ZIPPED_FILENAME = 'loc-flexiuni-4.0.txt';
const OUTPUT_FILENAME = 'romanian/loc-4.0.txt';

module.exports = async () => {
  const zipFilename = await downloadFile(ZIP_URL, getNextTmpFilename());

  await unzipFiles(zipFilename, (entry) => {
    if (entry.path === ZIPPED_FILENAME) {
      entry.pipe(fs.createWriteStream(OUTPUT_FILENAME));
    } else {
      entry.autodrain();
    }
  });

  fs.unlinkSync(zipFilename);

  const file = fs.readFileSync(OUTPUT_FILENAME, 'utf-8');
  const words = extractWords(file);

  fs.writeFileSync(OUTPUT_FILENAME, words);
};
