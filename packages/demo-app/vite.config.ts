import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'ImageUploader',
			fileName: 'image-uploader',
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			// Externalize React to avoid bundling it
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
	server: {
		open: './src/index.html',
	},
	esbuild: {
		jsx: 'automatic',
	},
});
