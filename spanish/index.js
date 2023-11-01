const fs = require('fs');
const unzipper = require('unzipper');

const { downloadFile, getNextTmpFilename } = require('./lib');

const JAR_URL = 'http://www.redeletras.com/diccionario/';
const OUTPUT_FILENAME = 'fise-2.txt';

async function run() {
  const zipFilename = await downloadFile(JAR_URL, getNextTmpFilename());
  const tmpFilenames = [];
  const files = [];

  await fs
    .createReadStream(zipFilename)
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      if (entry.path.endsWith('.txt')) {
        const outputFilename = getNextTmpFilename();
        entry.pipe(fs.createWriteStream(outputFilename));
        tmpFilenames.push(outputFilename);
      } else {
        entry.autodrain();
      }
    })
    .promise();

  fs.unlinkSync(zipFilename);

  for (const filename of tmpFilenames) {
    const file = fs.readFileSync(filename, 'utf-8');
    files.push(file);
    fs.unlinkSync(filename);
  }

  const lines = files.join('\n').split(/\r?\n/g);
  const words = lines
    .map((word) => word.trim().toLocaleLowerCase().replaceAll('�', 'ñ'))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const uniqueWords = Array.from(new Set(words));

  fs.writeFileSync(OUTPUT_FILENAME, uniqueWords.join('\n'));
}

run();
