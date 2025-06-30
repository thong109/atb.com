import { src, dest, watch, series } from 'gulp';
import * as del from 'del';
import { relative, resolve, parse, sep } from 'path';
import { base as config } from '../config/index.mjs';

const monitoring = () => {

  const sass = watch([config.css.path.inputFiles].concat(config.ignore).concat(config.css.ignore), series('css'));
  sass.on('all', function (event, filepath) {
    console.log(`File ${filepath} was changed`);
    if (event === 'unlink') {
      const filePathFromSrc = relative(resolve(config.css.path.input), filepath);
      let distFilePath = resolve(config.pathDestination, filePathFromSrc).replace(/(?:\\|\/)?scss(?:\\|\/)?/, sep).replace(/\.scss$/, '.css');
      del.deleteAsync([distFilePath]);
    }
  });
};

const watchTask = monitoring;

export const myWatch = watchTask;
