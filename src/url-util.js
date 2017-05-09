/* jslint node: true, esnext: true */

'use strict';

import {
  Resolver, HTTPScheme, HTTPSScheme
}
from 'url-resolver-fs';

import FileScheme from 'fs-resolver-fs';

import {
  SVNHTTPSScheme
}
from 'svn-dav-fs';

import {
  expand
}
from 'config-expander';

const program = require('caporal'),
  path = require('path'),
  ora = require('ora');

const spinner = ora('args').start();

process.on('uncaughtException', err => spinner.fail(err));
process.on('unhandledRejection', reason => spinner.fail(reason));

program
  .description('work with url resources')
  .version(require(path.join(__dirname, '..', 'package.json')).version)
  .command('list', 'list url content')
  .option('-c, --config <file>', 'use config from file')
  .argument('<url>', 'url to to list')
  .action(async(args, options, logger) => {

    const resolver = await prepareResolver(options);

    for (const entry of resolver.list(args.url)) {
      console.log(entry);
    }
  });

program.parse(process.argv);


async function prepareResolver(options) {

  const defaultConfig = {
    schemes: {}
  };

  const config = await expand(options.config ? "${include('" + path.basename(options.config) + "')}" :
    defaultConfig, {
      constants: {
        basedir: path.dirname(options.config || process.cwd()),
        installdir: path.resolve(__dirname, '..')
      }
    });

  return new Resolver(config, [new HTTPScheme(), new HTTPSScheme(), new FileScheme(), new SVNHTTPSScheme()]);
}
