const pathSource = '..';
const pathDestination = '..';
const ignoreGlobal = ['!**/.DS_Store', '!**/* copy.*', '!./wp/**/*', '!./dist/wp/**/*'];

const baseConfig = {
  pathSource: pathSource,
  pathDestination: pathDestination,
  ignore: ignoreGlobal,
  css: {
    path: {
      input: pathSource + '/scss',
      inputFiles: pathSource + '/scss/**/*.scss',
      output: pathDestination + '/css',
      outputFiles: pathDestination + '/css/**/*.css',
    },
    ignore: [],
    options: {
      minify: false, // To Minify CSS files
    },
  },
};

export const base = baseConfig;

