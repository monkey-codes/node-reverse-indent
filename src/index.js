#!/usr/bin/env node
import program from 'commander';
import rindent from './lib/rindent';

program
  .arguments('<dir>')
  .option('-v, --verbose', 'Verbose output')
  .option('-d, --dry-run', 'Prints result without changing the file')
  .action(dir => rindent(dir, program))
.parse(process.argv);
