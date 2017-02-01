import { Observable } from 'rxjs/Rx';
import fs from 'fs';
import recursiveReaddir from 'recursive-readdir';
import _ from 'lodash';
import colour from 'colour';

// const DIR = '/Users/jzietsman/vagrant/devvm-0.5/git/stayz/stayz-core/src/main/java';
const DIR = '/Users/jzietsman/tmp3';

colour.setTheme({
  after: 'green',
  before: 'red',
});

function swapLeadingSpace(line) {
  const match = /^\s+/.exec(line);
  return match ? line.trim() + match[0] : line.trim();
}

const files$ = Observable.bindNodeCallback(recursiveReaddir)(DIR)
  .mergeMap(files => Observable.from(files));

/* eslint-disable no-shadow*/
files$
  .mergeMap(file => (
    Observable.bindNodeCallback(fs.readFile)(file)
      .map(content => content.toString().split('\n'))
      .mergeMap((lines) => {
        const max$ = Observable.from(lines)
          .map(line => line.length)
          .max();
        return Observable.of(lines)
          .withLatestFrom(max$, (lines, max) => ({ file, lines, max }))
          .mergeMap(({ file, lines, max }) => (
            Observable.from(lines)
              .map(swapLeadingSpace)
              .map(line => _.padStart(line, max))
              .toArray()
              .map(indentedLines => ({ file, lines, max, indentedLines }))
          ));
      })
  ))
  .do(({ file, lines, indentedLines }) => {
    console.log(`\n${file}\n${lines.join('\n').before}\n${indentedLines.join('\n').after}\n`);
  })
  .subscribe(({ file, indentedLines }) => {
    fs.writeFile(file, indentedLines.join('\n'), (err) => {
      if (err) throw err;
      console.log(`${'saved'.green} ${file}`.green);
    });
  });

