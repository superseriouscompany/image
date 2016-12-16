const expect      = require('expect');
const fs          = require('fs');
const thumbnailer = require('../lib/thumbnailer');
const sizeOf      = require('image-size');
const promisify   = require('bluebird').Promise.promisify;

describe('thumbnailer', function() {
  it("rejects when file is missing", function () {
    return thumbnailer.process(`${__dirname}/fixtures/nope.jpg`).then(shouldFail).catch(function(err) {
      expect(err.name).toEqual("FileNotFound", err.message);
    })
  });

  it("returns a valid stream", function () {
    var gm = require('gm').subClass({imageMagick: true});
    gm(__dirname + '/fixtures/tall.jpg').stream().pipe(fs.createWriteStream('./cool.jpg'));
  });

  it("works on a tall jpg", function () {
    const path = './tall.png';
    return thumbnailer.process(__dirname + '/fixtures/tall.jpg').then(function(stream) {
      expect(stream).toExist('No path returned from thumbnailer');
      const write = fs.createWriteStream(path);
      const promise = promisify(write.on, {context: write})('close');
      stream.pipe(write);
      return promise;
    }).then(function() {
      expect(fs.existsSync(path)).toExist(`File not created at: ${path}`);
      const dimensions = sizeOf(path);
      expect(dimensions.width).toEqual(640, `Image width of ${dimensions.width} is incorrect`);
      expect(dimensions.height).toEqual(640, `Image height of ${dimensions.height} is incorrect`);
      fs.unlinkSync(path);
    })
  });

  it("works on a wide png", function () {
    const path = './wide.png';
    return thumbnailer.process(__dirname + '/fixtures/wide.png').then(function(stream) {
      expect(stream).toExist('No path returned from thumbnailer');
      const write = fs.createWriteStream(path);
      const promise = promisify(write.on, {context: write})('close');
      stream.pipe(write);
      return promise;
    }).then(function() {
      expect(fs.existsSync(path)).toExist(`File not created at: ${path}`);
      const dimensions = sizeOf(path);
      expect(dimensions.width).toEqual(640, `Image width of ${dimensions.width} is incorrect`);
      expect(dimensions.height).toEqual(640, `Image height of ${dimensions.height} is incorrect`);
      fs.unlinkSync(path);
    })
  });
})

function shouldFail(result) {
  throw new Error(`Should have failed, but got ${result}`);
}
