import { series, parallel } from 'gulp';
import { css, buildStyles, lintStyles, lintStylesFix } from './tasks/css.mjs';
import { myWatch } from './tasks/watch.mjs';

const lint = series(lintStyles);
const lintFix = series(lintStylesFix);
const build = series(buildStyles);
const develop = series(buildStyles, lint, parallel(myWatch));

export {
  build,
  develop,
  css,
  lint,
  lintFix,
};
