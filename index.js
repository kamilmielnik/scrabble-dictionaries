const romanianLoc4_0 = require('./romanian/loc-4.0');
const romanianLoc4_1 = require('./romanian/loc-4.1');
const romanianLoc5_0 = require('./romanian/loc-5.0');
const romanianLoc6_0 = require('./romanian/loc-6.0');
const spanishFise2 = require('./spanish/fise-2');

const dictionaries = [romanianLoc4_0, romanianLoc4_1, romanianLoc5_0, romanianLoc6_0, spanishFise2];

async function run() {
  for (const updateDictionary of dictionaries) {
    await updateDictionary();
  }
}

run();
