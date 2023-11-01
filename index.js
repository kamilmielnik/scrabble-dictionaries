// const romanian = require('./romanian');
const spanish = require('./spanish');

const dictionaries = [/* romanian, */ spanish];

async function run() {
  for (const updateDictionary of dictionaries) {
    await updateDictionary();
  }
}

run();
