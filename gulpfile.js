const { src, dest, task } = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const webpack = require('webpack-stream');

function build(debug) {
  return src('src/bytearray.js')
    .pipe(babel())
    .pipe(webpack({
      mode: !debug?'production':'development',
      devtool: !debug?false: 'source-map',
      output: {
        library: 'ByteArray',
        libraryTarget: 'global'
      }
    }))
    .pipe(concat('bytearray.min.js'))
    .pipe(dest('output/'));
}

task('debug', () => build(true));
task('release', () => build(false));

exports.default = () => build(false);