import { Observable } from 'rxjs/Rx';
import fs from 'fs';
import recursiveReaddir from 'recursive-readdir';
import _ from 'lodash';
import 'colour';

// const DIR = '/Users/jzietsman/vagrant/devvm-0.5/git/stayz/stayz-core/src/main/java';
const DIR = '/Users/jzietsman/tmp3';

const files$ = Observable.bindNodeCallback(recursiveReaddir)(DIR)
  .mergeMap(files => Observable.from(files));

/* eslint-disable no-shadow*/
files$
  .mergeMap(file => (
    Observable.bindNodeCallback(fs.readFile)(file)
    .map(content => ({ file, lines: content.toString().split('\n') }))
  ))
  .mergeMap(({ file, lines }) => (
    Observable.from(lines)
    .map(line => line.length)
    .max()
    .map(max => ({ file, lines, max }))
  ))
  .mergeMap(({ file, lines, max }) => (
    Observable.from(lines)
    .map(line => line.trim() + /^\s*/.exec(line)[0])
    .map(line => _.padStart(line, max))
    .toArray()
    .map(indentedLines => ({ file, lines, max, indentedLines }))
  ))
  .do(({ file, lines, indentedLines }) => {
    console.log(`\n${file}\n${lines.join('\n').red}\n${indentedLines.join('\n').green}\n`);
  })
  .subscribe(({ file, indentedLines }) => {
    fs.writeFile(file, indentedLines.join('\n'), (err) => {
      if (err) throw err;
      console.log(`${'saved'.green} ${file}`.green);
    });
  });

