import cleanup from "rollup-plugin-cleanup";
import pkg from "./package.json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import executable from "rollup-plugin-executable";
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
    resolve(),
    commonjs(),
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
    "config-expander"
  ],
  input: pkg.module
};
