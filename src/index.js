import Rx from 'rxjs/Rx';
import fs from 'fs';
import { createSubscriber } from './lib/util';
import _ from 'lodash';


const DIR = '/Users/jzietsman/tmp';

const files$ = Rx.Observable.bindNodeCallback(fs.readdir)(DIR);

files$
  .map(file => `${DIR}/${file}`)
  .mergeMap(file => {
    const lines$ = Rx.Observable.bindNodeCallback(fs.readFile)(file)
      .map(content => content.toString().split('\n'));
    return lines$;
  })
  .mergeMap(lines => {
    const max$ = Rx.Observable.from(lines)
      .map(line => line.length)
      .max();
    return Rx.Observable.of(lines)
      .withLatestFrom(max$, (lines, max) => { return {lines,max} } );
  })
  .mergeMap(file => {
    return Rx.Observable.from(file.lines)
      .map(line => {
        const leftPadPattern = /^\s+/;
        const match = leftPadPattern.exec(line);
        if(match){
         line = line.trim() + match[0];
        }
        line = _.padStart(line,file.max);
        return line;
      });
  })
  .subscribe(createSubscriber('test'));
