import ImageUploader from '../components/ImageUploader.tsx';
import SimpleImagePreviewer from './components/SimpleImagePreviewer.tsx';
import SimpleImageCropper from './components/SimpleImageCropper.tsx';
import { useImageFiles } from '../hooks/useImageFiles.ts';

export default function App() {
	const { files, setFiles, setFileToEdit, fileToEdit, removeFile } = useImageFiles();

	return (
		<div className="flex justify-center items-center h-screen bg-white flex-col gap-8">
			<ImageUploader onFileSelected={setFiles} />
			<SimpleImagePreviewer files={files} onRemove={removeFile} onEditClick={setFileToEdit} />
			{fileToEdit && <SimpleImageCropper file={fileToEdit} />}
		</div>
	);
}
