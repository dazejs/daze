#!/usr/bin/env node

import { create } from '@dazejs/cli';
import { Command } from 'commander';
import chalk from 'chalk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');


const program = new Command(packageJson.name);

program
  .version(packageJson.version, '-v, --version')
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')}`)
  .action(name => {
    create(name);
  });

program.parse(process.argv);

