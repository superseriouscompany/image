const expect      = require('expect');
const fs          = require('fs');
const thumbnailer = require('../lib/thumbnailer');

describe('thumbnailer', function() {
  it("works", function () {
    return thumbnailer.process('./fixtures/tall.jpg').then(function(path) {
      expect(path).toExist('No path returned from thumbnailer');
      expect(fs.existsSync(path)).toExist(`File not found at: ${path}`);
    })
  });
})
