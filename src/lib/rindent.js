import { Observable } from 'rxjs/Rx';
import fs from 'fs';
import recursiveReaddir from 'recursive-readdir';
import _ from 'lodash';
import 'colour';

export default function rindent(dir, args) {
  const files$ = Observable.bindNodeCallback(recursiveReaddir)(dir)
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
      console.log(`${'reverse indented:'.green} ${file}`);
      if (args.verbose) {
        console.log(`\n${lines.join('\n').red}\n${indentedLines.join('\n').green}\n`);
      }
    })
    .subscribe(({ file, indentedLines }) => {
      if (args.dryRun) {
        console.log(`\n${indentedLines.join('\n').red}`);
        return;
      }

      fs.writeFile(file, indentedLines.join('\n'), (err) => {
        if (err) throw err;
        console.log(`${'saved'.green} ${file}`.green);
      });
    });
}
