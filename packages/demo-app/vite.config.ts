import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	root: __dirname,
	resolve: {
		alias: {
			'@image-uploader/image-upload': path.resolve(__dirname, '../../packages/image-upload/src'),
			'@image-uploader/image-crop': path.resolve(__dirname, '../../packages/image-crop/src'),
		},
	},
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
