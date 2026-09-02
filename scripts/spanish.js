const { updateDictionary } = require('./lib');

module.exports = updateSpanish;

async function updateSpanish() {
  await updateDictionary({
    language: 'spanish',
    filename: 'fise-2.txt',
    url: 'https://www.redeletras.com/diccionario/',
    encoding: 'latin1',
    isWantedEntry: (entry) => entry.path.endsWith('.txt'),
  });
}
