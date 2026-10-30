// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://inventrohyder.github.io',
  base: '/field-notes-nairobi',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
