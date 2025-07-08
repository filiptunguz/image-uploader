import ImageUploader from '../components/ImageUploader.tsx';
import { useState } from 'react';
import ImagePreviewer from '../components/ImagePreviewer.tsx';
import SimpleImageCropper from './components/SimpleImageCropper.tsx';

export default function App() {
	// TODO: create wrapper component for ImageUploader and ImagePreviewer

	const [files, setFiles] = useState<File[]>([]);
	const [fileToEdit, setFileToEdit] = useState<File | null>(null);

	const handleRemove = (file: File) => {
		setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
	};

	return (
		<div className="flex justify-center items-center h-screen bg-white flex-col gap-8">
			<ImageUploader onFileSelected={setFiles} />
			<ImagePreviewer files={files} onRemove={handleRemove} onEditClick={setFileToEdit} />
			{fileToEdit && <SimpleImageCropper file={fileToEdit} />}
		</div>
	);
}
