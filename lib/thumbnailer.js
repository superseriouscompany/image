module.exports = {
  process: process
}

function process() {
  return new Promise(function(resolve, reject) {
    resolve('./test/fixtures/tall.jpg');
  })
}
