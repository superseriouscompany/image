const expect      = require('expect');
const fs          = require('fs');
const thumbnailer = require('../lib/thumbnailer');
const sizeOf      = require('image-size');

describe('thumbnailer', function() {
  it("rejects when file is missing", function () {
    return thumbnailer.process(`${__dirname}/fixtures/nope.jpg`).then(shouldFail).catch(function(err) {
      expect(err.name).toEqual("FileNotFound", err.message);
    })
  });

  it("works", function () {
    return thumbnailer.process(__dirname + '/fixtures/tall.jpg').then(function(path) {
      expect(path).toExist('No path returned from thumbnailer');
      expect(fs.existsSync(path)).toExist(`File not found at: ${path}`);
      const dimensions = sizeOf(path);
      expect(dimensions.width).toEqual(640, `Image width of ${dimensions.width} is incorrect`);
      expect(dimensions.height).toEqual(640, `Image height of ${dimensions.height} is incorrect`);
    })
  });
})

function shouldFail(result) {
  throw new Error(`Should have failed, but got ${result}`);
}
