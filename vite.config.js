import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  base: '/',
  plugins: [
    eslintPlugin({
      cache: false,
      failOnError: false,
    }),
  ],
  assetsInclude: ['**/*.mp3', '**/*.jpeg', '**/*.png', '**/*.task'],
});
