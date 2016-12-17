var thumbnailer = require('./thumbnailer');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

console.log('starting function')
exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)

  if( !e.url ) {
    return cb(new Error('No url provided'));
  }

  thumbnailer.process(e.url).then(function(stream) {
    var params = {Bucket: 'image.superseriouscompany.com', Key: 'lambda.png', Body: stream, ACL: 'public-read', ContentType: 'image/png'}

    s3.upload(params, function(err, data) {
      if( err ) { return cb(err); }
      return cb(null, {url: data.Location, event: e});
    });
  })
}
