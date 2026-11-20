import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    // tsconfig.app.json의 paths("@/*")를 그대로 사용한다.
    tsconfigPaths: true,
  },
});
