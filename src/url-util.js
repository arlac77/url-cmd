/* jslint node: true, esnext: true */

'use strict';

const program = require('caporal'),
  path = require('path'),
  ora = require('ora');

const spinner = ora('args').start();

process.on('uncaughtException', err => spinner.fail(err));
process.on('unhandledRejection', reason => spinner.fail(reason));

program
  .description('work with url resources')
  .version(require(path.join(__dirname, '..', 'package.json')).version)
  .argument('[repos...]', 'repos to merge')
  .action((args, options, logger) => {

  });

program.parse(process.argv);
