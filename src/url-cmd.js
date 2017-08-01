import { Resolver, HTTPScheme, HTTPSScheme } from 'url-resolver-fs';
import FileScheme from 'fs-resolver-fs';
import { SVNHTTPSScheme } from 'svn-dav-fs';
import SFTPScheme from 'sftp-resolver-fs';
import { expand } from 'config-expander';

const path = require('path');
const ora = require('ora');
const program = require('caporal');
const { URL } = require('url');

program
  .description('work with url resources')
  .version(require(path.join(__dirname, '..', 'package.json')).version)
  .command('schemes', 'list schemes')
  .option('-c, --config <file>', 'use config from file')
  .action(async (args, options) => {
    const { resolver, spinner } = await prepareResolver(options);
    spinner.succeed([...resolver.schemes.keys()]);
  })
  .command('info', 'info url')
  .argument('<url>', 'url to to list')
  .action(async (args, options) => {
    const { context, spinner } = await prepareResolver(options);
    spinner.succeed(JSON.stringify(await context.stat(args.url), undefined, 2));
  })
  .command('list', 'list url content')
  .argument('<url>', 'url to to list')
  .action(async (args, options) => {
    const { context, spinner } = await prepareResolver(options);

    for (const entry of context.list(args.url)) {
      console.log(entry);
    }
    spinner.end();
  })
  .command('copy', 'copy url content')
  .argument('<source>', 'source url')
  .argument('<dest>', 'dest url')
  .action(async (args, options) => {
    const { context, spinner } = await prepareResolver(options);

    await context.put(args.dest, await context.get(args.source));

    spinner.succeed(`copied ${args.source} to ${args.dest}`);
  });

program.parse(process.argv);

async function prepareResolver(options) {
  const spinner = ora('args');

  process.on('uncaughtException', err => spinner.fail(err));
  process.on('unhandledRejection', reason => spinner.fail(reason));

  spinner.start();

  const defaultConfig = {
    schemes: {}
  };

  const config = await expand(
    options.config
      ? "${include('" + path.basename(options.config) + "')}"
      : defaultConfig,
    {
      constants: {
        basedir: path.dirname(options.config || process.cwd()),
        installdir: path.resolve(__dirname, '..')
      }
    }
  );

  const resolver = new Resolver(config, [
    new HTTPScheme(),
    new HTTPSScheme(),
    new FileScheme(),
    new SVNHTTPSScheme(),
    new SFTPScheme()
  ]);

  return {
    context: resolver.createContext(new URL(`file://${process.cwd()}`)),
    resolver,
    spinner
  };
}
