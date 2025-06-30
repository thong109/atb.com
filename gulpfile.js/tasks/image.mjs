import { src, dest } from 'gulp';
import changed from 'gulp-changed';
import imageMinify, { svgo, optipng, gifsicle } from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import webp from 'gulp-webp';
import rename from 'gulp-rename';
import { base as config } from '../config/index.mjs';

const minifyImage = () => {
  return src([config.image.path.inputFiles].concat(config.ignore).concat(config.image.ignore), { encoding: false })
    .pipe(changed(config.image.path.output))
    .pipe(imageMinify([
      pngquant({
        quality: [0.7, 0.8],
        speed: 1,
      }),
      mozjpeg({ progressive: true, quality: 70 }),
      svgo({
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      }),
      optipng(),
      gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(dest(config.image.path.output));
};

const convertToWebp = () => {
  return src([config.image.path.inputFiles].concat(config.ignore).concat(config.image.ignore), { encoding: false })
    .pipe(imageMinify([
      pngquant({
        quality: [0.7, 0.8],
        speed: 1,
      }),
      mozjpeg({ progressive: true, quality: 70 }),
      svgo({
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      }),
      optipng(),
      gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(rename((path) => {
      path.basename += '.' + path.extname.replace(/^\./, '');
    }))
    .pipe(webp({
      quality: 80,
      method: 6
    }))
    .pipe(dest(config.image.path.output));
};

export {
  minifyImage,
  convertToWebp
};
