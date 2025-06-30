import stylelint from 'stylelint';
import spelling from 'spelling';
import { words } from 'popular-english-words';
import * as spellDictionary from '../fcdic-spellings.js';
let commonWords = words.getAll();
commonWords = commonWords.concat(spellDictionary.default);
import fs from 'fs';
const spellChecker = new spelling(commonWords);
let spellingResultArray = [];
const spellingResultFilePath = './incorrect_spelling.txt';
const spellingResultFileStream = fs.createWriteStream(spellingResultFilePath, { flags: 'w' });

const spellCheckScss = stylelint.createPlugin('plugin/spell-check-scss', (isEnabled) => {
  return (root, spellingResult) => {
    if (isEnabled == false) return;
    root.walkRules(rule => {
      // セレクタからクラス名を抽出する正規表現
      const classNames = rule.selector.match(/\.[a-zA-Z0-9_-]+/g) || [];

      // クラス名を区切り文字で分割し、各単語をチェック
      classNames.forEach(fullClassName => {
        const words = fullClassName.slice(1).split(/[-_]/); // `.`を除いて分割

        words.forEach(word => {
          // 各単語をスペルチェック
          const checked = spellChecker.lookup(word);
          if (!checked.found) {
            spellingResult.warn(`Misspelled word "${word}" in class name "${fullClassName}"`, {
              node: rule,
              stylelintType: 'invalid-spell-check'
            });
            if (!spellingResultArray.includes(word)) {
              spellingResultArray.push(word)
              spellingResultFileStream.write(`${word}\n`);
            }
          }
        });
      });
    });
  };
});

// Close the file stream after processing is done
spellingResultFileStream.on('finish', () => {
  console.log('Incorrect spelling has been exported to', spellingResultFilePath);
});

export default spellCheckScss;
