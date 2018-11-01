import cleanup from "rollup-plugin-cleanup";
import pkg from "./package.json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import executable from "rollup-plugin-executable";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";

export default {
  output: {
    file: pkg.bin["url-cmd"],
    format: "cjs",
    banner:
      '#!/bin/sh\n":" //# comment; exec /usr/bin/env node --experimental-modules --experimental-worker "$0" "$@"',
    interop: false
  },
  plugins: [
    commonjs(),
    babel({
      runtimeHelpers: false,
      externalHelpers: true,
      babelrc: false,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              safari: "tp"
            }
          }
        ]
      ],
      exclude: "node_modules/**"
    }),
    json({
      include: "package.json",
      preferConst: true,
      compact: true
    }),
    cleanup(),
    executable()
  ],
  external: [
    "assert",
    "os",
    "events",
    "path",
    "url",
    "fs",
    "crypto",
    "url-resolver-fs",
    "fs-resolver-fs",
    "svn-dav-fs",
    "sftp-resolver-fs",
    "svn-simple-auth-provider",
    "config-expander",
    "caporal"
  ],
  input: pkg.module
};
