var express = require('express');
var app = express();
var compression = require('compression');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var ffmpeg = require('fluent-ffmpeg');

module.exports = (directory, format, width, height, framerate, horizontalFlip, verticalFlip, compressionLevel, time, listSize, storageSize, port) => {
  // Create the camera output directory if it doesn't already exist
  // Sync, because this is only run once at startup and everything depends on it
  if (fs.existsSync(directory) === false) fs.mkdirSync(directory);

  // Start the camera stream
  var raspividOptions = ['-o', '-', '-t', '0', '-w', width, '-h', height, '-fps', framerate, '-g', framerate];
  if (horizontalFlip) raspividOptions.push('-hf');
  if (verticalFlip) raspividOptions.push('-vf');

  const cameraStream = spawn('raspivid', raspividOptions);

  // Setup up a special shutdown function that's called when encountering an error
  // so that we always shut down the camera stream properly
  const kill = (err) => {
    cameraStream.kill();
    throw err;
  };

  // Set up camera stream conversion
  let conversionStream = ffmpeg(cameraStream.stdout)
    .noAudio();

  if (format === 'hls') {
    const outputOptions = [
      '-hls_time',
      time,
      '-hls_list_size',
      listSize,
      '-hls_delete_threshold',
      storageSize,
      '-hls_flags',
      'split_by_time+delete_segments+second_level_segment_index',
      '-strftime',
      1,
      '-hls_segment_filename',
      path.join(directory, '%s-%%d.m4s'),
      '-hls_segment_type',
      'fmp4'
    ];

    conversionStream
      .videoCodec('copy')
      .format('hls')
      .inputOptions(['-re'])
      .outputOptions(outputOptions)
      .output(path.join(directory, 'livestream.m3u8'));
  }
  else if (format === 'dash') {
    const outputOptions = [
      '-seg_duration',
      time,
      '-window_size',
      listSize,
      '-extra_window_size',
      storageSize,
      '-init_seg_name',
      'init.m4s',
      '-media_seg_name',
      '$Time$-$Number$.m4s'
    ];

    conversionStream
      .videoCodec('copy')
      .format('dash')
      .inputOptions(['-re'])
      .outputOptions(outputOptions)
      .output(path.join(directory, 'livestream.mpd'));
  }
  else {
    kill(Error('unsupported format'));
  }

  // Start stream processing
  conversionStream
    .on('error', (err, stdout, stderr) => kill(err))
    .on('start', (commandLine) => console.log('started video processing: ' + commandLine))
    .on('stderr', (stderrLine) => console.log('conversion: ' + stderrLine))
    .run();

  // Endpoint the streaming files will be available on
  const endpoint = '/camera';

  // Setup express server
  app.use(cors());
  app.use(compression({ level: compressionLevel }));
  app.use(endpoint, express.static(directory));
  app.listen(port);

  console.log('camera stream server started');
};
