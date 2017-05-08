/* jslint node: true, esnext: true */

'use strict';

import {
  Resolver, HTTPScheme, HTTPSScheme
}
from 'url-resolver-fs';

import {
  FileScheme
}
from 'fs-resolver-fs';

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
  .option('-c, --config <file>', 'use config from file')
  .command('list', 'list url content')
  .argument('<url>', 'url to to list')
  .action(async(args, options, logger) => {

    const resolver = await prepareResolver(options);

    async
    for (entry of resoler.list(args.url)) {
      console.log(entry);
    }

  });

program.parse(process.argv);


async function prepareResolver(options) {

  // default config if none is given
  const defaultConfig = {
    schemes: {
      'tmp': {
        base: 'http',
        prefix: 'http:///tmp'
      }
    }
  };

  // load config and expand expressions ${something} inside
  const config = await expand(options.config ? "${include('" + path.basename(options.config) + "')}" :
    defaultConfig, {
      constants: {
        basedir: path.dirname(options.config || process.cwd()), // where is the config file located
        installdir: path.resolve(__dirname, '..') // make references to the installdir possible
      }
    });

  const resolver = new Resolver(config, [HTTPScheme, HTTPSScheme, FileScheme, SVNHTTPSScheme]);

  return resolver;
}
