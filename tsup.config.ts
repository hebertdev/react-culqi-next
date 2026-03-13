import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  minify: false,
  target: 'es2018',
  outDir: 'dist',
  treeshake: true,
  bundle: true,
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});