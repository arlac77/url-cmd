import istanbul from "rollup-plugin-istanbul";
import multiEntry from "rollup-plugin-multi-entry";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import baseRollup from "../rollup.config.js";

const external = [
  "ava",
  "execa",
  "assert",
  "os",
  "events",
  "path",
  "url",
  "url-resolver-fs",
  "fs-resolver-fs",
  "svn-dav-fs",
  "sftp-resolver-fs",
  "config-expander"
];
export default [
  baseRollup,
  {
    input: "tests/**/*-test.js",
    external,
    plugins: [
      multiEntry(),
      resolve(),
      commonjs(),
      istanbul({
        exclude: ["tests/**/*-test.js", "node_modules/**/*"]
      })
    ],
    output: {
      file: "build/bunde-test.js",
      format: "cjs",
      sourcemap: true,
      interop: false
    }
  }
];
