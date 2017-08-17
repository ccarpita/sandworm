import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'lib/index.js',
  dest: 'tmp/bundle.js',
  moduleName: 'sandworm',
  format: 'cjs',
  plugins: [
    resolve(),
    commonjs(),
  ]
}
