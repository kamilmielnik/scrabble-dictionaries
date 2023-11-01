const fs = require('fs');

const { downloadFile, extractWords, unzipFile } = require('../_lib');

const ZIP_URL = 'https://dexonline.ro/static/download/scrabble/loc-flexiuni-6.0.zip';
const ZIPPED_FILENAME = 'loc-flexiuni-6.0.txt';
const OUTPUT_FILENAME = 'romanian/loc-6.0.txt';

module.exports = async () => {
  const zipFilename = await downloadFile(ZIP_URL);
  const file = await unzipFile(zipFilename, ZIPPED_FILENAME);
  const words = extractWords(file);

  fs.unlinkSync(zipFilename);
  fs.writeFileSync(OUTPUT_FILENAME, words);
};
