import { series, parallel } from 'gulp';
import { cleanResources } from './tasks/clean.mjs';
import { html, buildHtml, lintPug, lintHtml } from './tasks/html.mjs';
import { css, buildStyles, lintStyles, lintStylesFix, analyze, compareClasses } from './tasks/css.mjs';
import { js, buildJs, lintJs, lintJsFix } from './tasks/js.mjs';
import { minifyImage, convertToWebp } from './tasks/image.mjs';
import { copy } from './tasks/copy.mjs';
import { bs as browser } from './tasks/browser-sync.mjs';
import { myWatch } from './tasks/watch.mjs';

const lint = series(lintPug, lintHtml, lintStyles, lintJs);
const lintFix = series(lintStylesFix, lintJsFix);
const build = series(cleanResources, copy, buildHtml, buildStyles, buildJs, minifyImage);
const develop = series(cleanResources, copy, buildHtml, buildStyles, buildJs, minifyImage, lint, parallel(browser, myWatch));

export {
  build,
  develop,
  html,
  css,
  js,
  lint,
  lintFix,
  minifyImage,
  convertToWebp,
  analyze,
  compareClasses
};
