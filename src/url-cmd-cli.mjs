import program from "commander";
import { expand } from "config-expander";
import { join, basename, dirname, resolve } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { Resolver, HTTPScheme, HTTPSScheme } from "url-resolver-fs";
import { FileScheme } from "fs-resolver-fs";
import { SVNHTTPSScheme } from "svn-dav-fs";
import { SFTPScheme } from "sftp-resolver-fs";
import { SvnSimpleAuthProvider } from "svn-simple-auth-provider";

const here = dirname(fileURLToPath(import.meta.url));

const { version, description } = JSON.parse(
  readFileSync(
    join(here, "..", "package.json"),
    { endoding: "utf8" }
  )
);

program
  .description(description)
  .version(version)
  .command("schemes", "list schemes")
  .option("-c, --config <file>", "use config from file")
  .action(async (...args) => {
    const { resolver } = await prepareResolver();
    for (const [name, scheme] of resolver.schemes) {
      console.log(`${name} ${JSON.stringify(scheme)}`);
    }
  })
  .command("info", "info url")
  .option("-c, --config <file>", "use config from file")
  .argument("<url>", "url to to list")
  .action(async (...args) => {
    const { context } = await prepareResolver();
    console.log(JSON.stringify(await context.stat(args.url), undefined, 2));
  })
  .command("list", "list url content")
  .option("-c, --config <file>", "use config from file")
  .argument("<url>", "url to to list")
  .action(async (...args) => {
    const { context } = await prepareResolver();

    for await (const entry of context.list(args.url)) {
      console.log(entry);
    }
  })
  .command("copy", "copy url content")
  .option("-c, --config <file>", "use config from file")
  .argument("<source>", "source url")
  .argument("<dest>", "dest url")
  .action(async (...args) => {
    const { context } = await prepareResolver();

    await context.put(args.dest, await context.get(args.source));

    console.log(`copied ${args.source} to ${args.dest}`);
  });

caporal.parse(process.argv);

async function prepareResolver() {
  process.on("uncaughtException", err => console.error(err));
  process.on("unhandledRejection", reason => console.error(reason));

  const config = await expand(
    program.config ? "${include('" + basename(program.config) + "')}" : {},
    {
      constants: {
        basedir: dirname(program.config || process.cwd()),
        installdir: resolve(__dirname, "..")
      },
      default: {
        schemes: {},
        credentials: {}
      }
    }
  );

  const resolver = new Resolver(
    config,
    [HTTPScheme, HTTPSScheme, FileScheme, SVNHTTPSScheme, SFTPScheme],
    process.env
  );

  resolver.authProviders.push({
    provideCredentials: async realm => {
      console.log(`Credentials for: ${JSON.stringify(realm)}`);
      if (realm !== undefined && realm.Basic !== undefined) {
        //console.log(`Credentials for: ${realm.Basic.realm}`);
        //console.log(JSON.stringify(config.credentials[realm.Basic.realm]));

        return config.credentials[realm.Basic.realm];
      }
    }
  });

  resolver.authProviders.push(new SvnSimpleAuthProvider());

  return {
    context: resolver.createContext({
      base: new URL(`file://${process.cwd()}`)
    }),
    resolver
  };
}
