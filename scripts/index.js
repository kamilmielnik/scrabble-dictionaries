const romanian = require('./romanian');
const spanish = require('./spanish');

async function run() {
  await romanian();
  await spanish();
}

run();
