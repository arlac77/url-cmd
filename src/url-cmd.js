import { Resolver, HTTPScheme, HTTPSScheme } from 'url-resolver-fs';
import { FileScheme } from 'fs-resolver-fs';
import { SVNHTTPSScheme } from 'svn-dav-fs';
import { SFTPScheme } from 'sftp-resolver-fs';
import { expand } from 'config-expander';
import { version } from '../package.json';
import { basename, dirname, resolve } from 'path';
import { URL } from 'url';

const caporal = require('caporal');

caporal
  .description('work with url resources')
  .version(version)
  .command('schemes', 'list schemes')
  .option('-c, --config <file>', 'use config from file')
  .action(async (args, options) => {
    const { resolver } = await prepareResolver(options);
    for (const [name, scheme] of resolver.schemes) {
      console.log(`${name} ${JSON.stringify(scheme)}`);
    }
  })
  .command('info', 'info url')
  .option('-c, --config <file>', 'use config from file')
  .argument('<url>', 'url to to list')
  .action(async (args, options) => {
    const { context } = await prepareResolver(options);
    console.log(JSON.stringify(await context.stat(args.url), undefined, 2));
  })
  .command('list', 'list url content')
  .option('-c, --config <file>', 'use config from file')
  .argument('<url>', 'url to to list')
  .action(async (args, options) => {
    const { context } = await prepareResolver(options);

    for (const entry of context.list(args.url)) {
      console.log(entry);
    }
  })
  .command('copy', 'copy url content')
  .option('-c, --config <file>', 'use config from file')
  .argument('<source>', 'source url')
  .argument('<dest>', 'dest url')
  .action(async (args, options) => {
    const { context } = await prepareResolver(options);

    await context.put(args.dest, await context.get(args.source));

    console.log(`copied ${args.source} to ${args.dest}`);
  });

caporal.parse(process.argv);

async function prepareResolver(options) {
  process.on('uncaughtException', err => console.error(err));
  process.on('unhandledRejection', reason => console.error(reason));

  const defaultConfig = {
    schemes: {},
    credentials: {}
  };

  const config = await expand(
    options.config
      ? "${include('" + basename(options.config) + "')}"
      : defaultConfig,
    {
      constants: {
        basedir: dirname(options.config || process.cwd()),
        installdir: resolve(__dirname, '..')
      }
    }
  );

  const resolver = new Resolver(
    config,
    [HTTPScheme, HTTPSScheme, FileScheme, SVNHTTPSScheme, SFTPScheme],
    process.env
  );

  return {
    context: resolver.createContext({
      provideCredentials: async realm => {
        console.log(`Credentials for: ${realm}`);
        return config.credentials[realm];
      },
      base: new URL(`file://${process.cwd()}`)
    }),
    resolver
  };
}
