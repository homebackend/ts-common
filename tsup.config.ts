import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/gnome/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  external: [/^gi:\/\//],
});
