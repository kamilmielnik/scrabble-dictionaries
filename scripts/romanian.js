const { updateDictionary } = require('./lib');

const LOC_VERSIONS = ['4.0', '4.1', '5.0', '6.0'];

module.exports = updateRomanian;

async function updateRomanian() {
  for (const version of LOC_VERSIONS) {
    await updateDictionary({
      language: 'romanian',
      filename: `loc-${version}.txt`,
      url: `https://dexonline.ro/static/download/scrabble/loc-flexiuni-${version}.zip`,
      isWantedEntry: (entry) => entry.path === `loc-flexiuni-${version}.txt`,
    });
  }
}
