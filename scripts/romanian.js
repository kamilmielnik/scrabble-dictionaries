const fs = require('fs');

const { downloadFile, extractWords, unzipFile } = require('./lib');

const download = async ({ zipUrl, zippedFilename, outputFilename }) => {
  const zipFilename = await downloadFile(zipUrl);
  const file = await unzipFile(zipFilename, zippedFilename);
  const words = extractWords(file);

  fs.unlinkSync(zipFilename);
  fs.writeFileSync(outputFilename, words);
};

module.exports = async () => {
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
};
