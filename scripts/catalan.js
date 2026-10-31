const { updateTextDictionary } = require('./lib');

module.exports = updateCatalan;

async function updateCatalan() {
  await updateTextDictionary({
    language: 'catalan',
    filename: 'disc.txt',
    url: 'https://raw.githubusercontent.com/jmontane/disc/main/sortida.txt',
    getWord: (line) => line.split('|')[0],
  });
}
