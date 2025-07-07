import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ImageUploader from '../components/ImageUploader.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<div className="flex justify-center items-center h-screen bg-white">
			<ImageUploader onFileSelected={console.log} />
		</div>
	</StrictMode>,
);
