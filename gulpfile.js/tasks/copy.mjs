import { src, dest, series } from 'gulp';
import { base as config } from '../config/index.mjs';
import { existsSync } from 'fs';

const copyFont = () => {
  if (!existsSync(config.font.path.input)) {
    return Promise.resolve();
  }
  return src([config.font.path.inputFiles].concat(config.ignore).concat(config.font.ignore), { encoding: false })
    .pipe(dest(config.font.path.output));
}

const copyDoc = () => {
  if (!existsSync(config.doc.path.input)) {
    return Promise.resolve();
  }
  return src([config.doc.path.inputFiles].concat(config.ignore).concat(config.doc.ignore), { encoding: false })
    .pipe(dest(config.doc.path.output));
}

const copyPDF = () => {
  if (!existsSync(config.pdf.path.input)) {
    return Promise.resolve();
  }
  return src([config.pdf.path.inputFiles].concat(config.ignore).concat(config.pdf.ignore), { encoding: false })
    .pipe(dest(config.pdf.path.output));
}

const copyVideo = () => {
  if (!existsSync(config.video.path.input)) {
    return Promise.resolve();
  }
  return src([config.video.path.inputFiles].concat(config.ignore).concat(config.video.ignore), { encoding: false })
    .pipe(dest(config.video.path.output));
}

const copy = series(copyFont, copyDoc, copyPDF, copyVideo);

export {
  copy
};
