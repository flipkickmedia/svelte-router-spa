import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import pkg from './package.json';

let isDev = false;
if (process.env.ROLLUP_WATCH) {
  isDev = true;
}

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: !isDev,
      },
      {
        file: pkg.browser,
        format: 'umd',
        name: 'SvelteRouterSpa',
        sourcemap: !isDev,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: !isDev,
      },
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'SvelteRouterSpa',
        plugins: [terser()],
        sourcemap: !isDev,
      },
    ],
    plugins: [
      svelte({
        extensions: ['.svelte'],
        preprocess: sveltePreprocess(),
      }),
      resolve({
        preferBuiltins: true,
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs({ requireReturnsDefault: 'auto' }),
    ],
  },
];
