import { Resolver, HTTPScheme, HTTPSScheme, Context } from 'url-resolver-fs';
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
    const { resolver, context, spinner } = await prepareResolver(options);
    spinner.succeed(
      JSON.stringify(
        await resolver.stat(context, new URL(args.url)),
        undefined,
        2
      )
    );
  })
  .command('list', 'list url content')
  .argument('<url>', 'url to to list')
  .action(async (args, options) => {
    const { resolver, context, spinner } = await prepareResolver(options);

    for (const entry of resolver.list(context, new URL(args.url))) {
      console.log(entry);
    }
    spinner.end();
  })
  .command('copy', 'copy url content')
  .argument('<source>', 'source url')
  .argument('<dest>', 'dest url')
  .action(async (args, options) => {
    const { resolver, context, spinner } = await prepareResolver(options);

    await resolver.put(
      context,
      new URL(args.dest),
      await resolver.get(context, new URL(args.source))
    );

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

  return {
    context: new Context(),
    resolver: new Resolver(config, [
      new HTTPScheme(),
      new HTTPSScheme(),
      new FileScheme(),
      new SVNHTTPSScheme(),
      new SFTPScheme()
    ]),
    spinner
  };
}
