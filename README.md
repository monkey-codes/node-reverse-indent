## Reverse Indent Source Files

A simple node script to [recursively reverse indent (source) files](https://blog.monkey.codes/how-to-reverse-indent-files-with-rxjs/) in a directory.  Ideal for pull requests on **April Fools' Day**.

##Setup
The script has been tested on node **6.9.2**.

Clone the repo:
```
$ git@github.com:monkey-codes/node-reverse-indent.git
$ cd react-authentication
$ npm run build
$ npm link
```
At this point there will be a `rindent` command avaiable in the terminal.

##Usage

```
$ rindent -h

  Usage: rindent [options] <dir>

  Options:

    -h, --help     output usage information
    -v, --verbose  Verbose output
    -d, --dry-run  Prints result without changing the file
```

##Example

Given a file in directory `~/tmp/test.txt`:
```
****
 ****
   ****
     ****
   ****
 ****
****
```
Running:
```
$ rindent ~/tmp
```
will convert `~/tmp/test.txt` to:
```
     ****
    ****
  ****
****
  ****
    ****
     ****
```

Applying this script to itself yields the mind-boggling result:
```
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
```
