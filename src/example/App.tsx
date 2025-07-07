import ImageUploader from '../components/ImageUploader.tsx';
import { useState } from 'react';
import ImagePreviewer from '../components/ImagePreviewer.tsx';

export default function App() {
	const [files, setFiles] = useState<File[]>([]);

	return (
		<div className="flex justify-center items-center h-screen bg-white flex-col gap-8">
			<ImageUploader onFileSelected={setFiles} />
			<ImagePreviewer files={files} />
		</div>
	);
}
