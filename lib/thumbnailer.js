'use strict';

const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});

module.exports = {
  process: process
}

function process(path) {
  return new Promise(function(resolve, reject) {
    if( !fs.existsSync(path) ) {
      let err = new Error('File not found');
      err.name = 'FileNotFound';
      return reject(err);
    }

    const outputPath = `${__dirname}/../artifacts/${Math.floor(Math.random() * 1000)}.png`;

    // convert -define jpeg:size=640x640 ~/Desktop/tall.jpg -thumbnail 640x640^ -gravity center -extent 640x640 cutTall.jpg
    // convert -define png:size=640x640 ~/Desktop/wide.png -thumbnail 640x640^ -gravity center -extent 640x640 cutWide.png

    gm(path)
      .autoOrient()
      .gravity('Center')
      .thumbnail(640, 640 + '^')
      .extent(640,640)
      .noProfile()
      .write(outputPath, function(err) {
        if( err ) { return reject(err); }
        resolve(outputPath);
      });
  })
}
