var thumbnailer = require('./thumbnailer');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

console.log('starting function')
exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)

  thumbnailer.process('https://s3-us-west-2.amazonaws.com/giggles-production-submissions/a1c043a0-b990-11e6-a32f-9356c83e3bd9.jpg').then(function(stream) {
    var params = {Bucket: 'image.superseriouscompany.com', Key: 'lambda.png', Body: stream, ACL: 'public-read', ContentType: 'image/png'}

    s3.upload(params, function(err, data) {
      if( err ) { return cb(err); }
      return cb(null, data);
    });
  })
}
