const romanian = require('./romanian');
const spanish = require('./spanish');

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function run() {
  await romanian();
  await spanish();
}
