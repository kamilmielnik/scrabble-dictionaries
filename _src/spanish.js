const fs = require('fs');

const { downloadFile, extractWords, getNextTmpFilename, unzipFiles } = require('./lib');

const download = async ({ jarUrl, outputFilename }) => {
  const zipFilename = await downloadFile(jarUrl);
  const tmpFilenames = [];
  const files = [];

  await unzipFiles(zipFilename, (entry) => {
    if (entry.path.endsWith('.txt')) {
      const tmpFilename = getNextTmpFilename();
      entry.pipe(fs.createWriteStream(tmpFilename));
      tmpFilenames.push(tmpFilename);
    } else {
      entry.autodrain();
    }
  });

  for (const filename of tmpFilenames) {
    const file = fs.readFileSync(filename, 'utf-8');
    files.push(file);
    fs.unlinkSync(filename);
  }

  const file = files.join('\n').replaceAll('�', 'ñ');
  const words = extractWords(file);

  fs.unlinkSync(zipFilename);
  fs.writeFileSync(outputFilename, words);
};

module.exports = async () => {
  await download({
    jarUrl: 'http://www.redeletras.com/diccionario/',
    outputFilename: './spanish/fise-2.txt',
  });
};
