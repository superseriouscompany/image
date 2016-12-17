const expect      = require('expect');
const fs          = require('fs');
const thumbnailer = require('../functions/hello/thumbnailer');
const sizeOf      = require('image-size');
const promisify   = require('bluebird').Promise.promisify;
const AWS         = require('aws-sdk');
const config      = require('../config');
AWS.config.update({
  accessKeyId: config.accessKey,
  secretAccessKey: config.secretKey
})
const s3 = new AWS.S3();

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

  it("works on a url", function () {
    this.timeout(10000);

    const path = './remote.png';
    return thumbnailer.process('https://s3-us-west-2.amazonaws.com/giggles-production-submissions/a1c043a0-b990-11e6-a32f-9356c83e3bd9.jpg').then(function(stream) {
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

  it("allows uploading to s3", function () {
    this.timeout(20000);
    return thumbnailer.process('https://s3-us-west-2.amazonaws.com/giggles-production-submissions/a1c043a0-b990-11e6-a32f-9356c83e3bd9.jpg').then(function(stream) {
      var params = {Bucket: 'image.superseriouscompany.com', Key: 'cool.png', Body: stream, ACL: 'public-read', ContentType: 'image/png'}

      return promisify(s3.upload, {context: s3})(params)
    }).then(function(data) {
      expect(data.Location).toExist();
    })
  });
})

function shouldFail(result) {
  throw new Error(`Should have failed, but got ${result}`);
}
