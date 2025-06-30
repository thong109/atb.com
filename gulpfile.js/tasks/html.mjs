import gulp from 'gulp';
const { src, dest, series, lastRun } = gulp;
import pug from 'gulp-pug';
import pugLinter from 'gulp-pug-linter';
import posthtml from 'gulp-posthtml';
import htmlnano from 'gulp-htmlnano';
import { base as config } from '../config/index.mjs';
import { existsSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

const customLint = (root) => {
  const walkNode = (node) => {
    if (node.attrs) {
      const nodeOutput = `<${node.tag} ` + Object.entries(node.attrs)
        .map(([key, val]) => `${key}="${val}"`)
        .join(' ') + `>`;
      for (const [attr, value] of Object.entries(node.attrs)) {
        if (value && (value.includes('<') || value.includes('>'))) {
          console.log(`Attribute "${attr}" contains "<" or ">" in element <${node.tag}>. Found at ${nodeOutput}`);
        }
      }
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child) => {
        if (typeof child === 'object') {
          walkNode(child);
        }
      });
    }
  };
  root.walk(walkNode);
};

const lintPug = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = [config.html.path.inputFiles];
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(pugLinter({
      reporter: 'default',
      failAfterError: stopOnError
    }));
};

const lintHtml = () => {
  const stopOnError = argv.stopOnError || false;
  let filesToCheck = [config.html.path.outputFiles];
  if (argv.file) {
    const targetFiles = argv.file.replace(/"/g, '').replace(/, /g, ',');
    filesToCheck = targetFiles.split(',');
  }
  return src(filesToCheck)
    .pipe(posthtml([
      customLint
    ])).on('error', (err) => {
      if (stopOnError) {
        throw err;
      } else {
        console.warn(err.message);
      }
    }
    );
};

const buildHtml = () => {
  if (!existsSync('./src/pug')) {
    return Promise.resolve();
  }
  const stream = src([config.html.path.inputFiles].concat(config.ignore).concat(config.html.ignore), { since: lastRun(buildHtml) })
    .pipe(
      pug({
        pretty: true
      })
    );
  if (config.html.options.minify) {
    stream.pipe(htmlnano({
      removeComments: false
    }));
  }
  return stream.pipe(dest('./dist'));
};

const html = series(buildHtml, lintPug, lintHtml);

export {
  buildHtml,
  lintPug,
  lintHtml,
  html
};

