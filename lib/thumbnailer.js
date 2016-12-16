'use strict';

const gm    = require('gm').subClass({imageMagick: true});
const https = require('https');
const fs    = require('fs');
const URL   = require('url');

module.exports = {
  process: process
}

function process(path) {
  return new Promise(function(resolve, reject) {
    let url = URL.parse(path);

    if( url.hostname ) {
      return https.get({
        hostname: url.hostname,
        path: url.path,
      }, function(stream) {
        resolve(convert(stream))
      })
    } else {
      if( !fs.existsSync(path) ) {
        let err = new Error('File not found');
        err.name = 'FileNotFound';
        return reject(err);
      }

      const stream = fs.createReadStream(path)
      return resolve(convert(stream))
    }
  })
}

function convert(stream) {
  return Promise.resolve(
    gm(stream)
      .autoOrient()
      .gravity('Center')
      .thumbnail(640, 640 + '^')
      .extent(640,640)
      .noProfile()
      .stream()
  )
}
