import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import vue from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import path from 'path'

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      name: 'dom-tracker',
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      name: 'dom-tracker',
      exports: 'named',
    },
  ],
  external: ['vue', 'lodash-es', '@vueuse/core', '@jd/jdesign-vue', '@babel/runtime'],
  plugins: [
    resolve({
      extensions: ['.ts', '.js', '.vue', '.json'],
      preferBuiltins: false,
    }),

    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
    }),

    vue({
      target: 'browser',
      css: true,
      exposeFilename: false,
    }),

    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      exclude: ['**/*.test.ts'],
    }),

    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
      extensions: ['.ts', '.js', '.vue'],
    }),

    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
        beautify: false,
      },
    }),
  ],
})
