import stylelint from 'stylelint';
import spelling from 'spelling';
import * as classDictionary from '../fcdic-classes.js';
import fs from 'fs';
const classChecker = new spelling(classDictionary.default);
let classResultArray = [];
const classResultFilePath = './incorrect_classnames.txt';
const classResultFileStream = fs.createWriteStream(classResultFilePath, { flags: 'w' });

const classnameCheckScss = stylelint.createPlugin('plugin/classname-check-scss', (isEnabled) => {
  return (root, classResult) => {
    if (isEnabled == false) return;
    root.walkRules(rule => {
      // セレクタからクラス名を抽出する正規表現
      const classNames = rule.selector.match(/\.[a-zA-Z0-9_-]+/g) || [];

      // クラス名を区切り文字で分割し、各単語をチェック
      classNames.forEach(fullClassName => {
        const words = fullClassName.slice(1).split(/[-_]/); // `.`を除いて分割

        words.forEach(word => {
          // 各単語をスペルチェック
          const checked = classChecker.lookup(word);
          if (!checked.found) {
            const warningMessage = `Unexpected word "${word}" in class name "${fullClassName}"`;
            classResult.warn(warningMessage, {
              node: rule,
              stylelintType: 'invalid-classname-check'
            });
            if (!classResultArray.includes(word)) {
              classResultArray.push(word)
              classResultFileStream.write(`${word}\n`);
            }
          }
        });
      });
    });
  };
});

// Close the file stream after processing is done
classResultFileStream.on('finish', () => {
  console.log('Incorrect class names have been exported to', classResultFilePath);
});

export default classnameCheckScss;
