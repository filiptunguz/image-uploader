import { ImageUploader } from '@image-uploader/core';
import SimpleImageCropper from './components/SimpleImageCropper';
import { useImageFiles } from './hooks/useImageFiles';
import SimpleImagePreviewer from './components/SimpleImagePreviewer';

export default function App() {
	const { files, setFiles, setFileToEdit, fileToEdit, removeFile } = useImageFiles();
	console.log('App files');

	return (
		<div className="flex justify-center items-center min-h-screen p-4 bg-background flex-col gap-8">
			<ImageUploader onFileSelected={setFiles} />
			<SimpleImagePreviewer files={files} onRemove={removeFile} onEditClick={setFileToEdit} />
			{fileToEdit && <SimpleImageCropper file={fileToEdit} />}
		</div>
	);
}
