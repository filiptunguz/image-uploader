import { useImageCrop } from '../../hooks/useImageCrop.ts';
import ImageEditor from '../../components/ImageEditor.tsx';

export default function SimpleImageCropper({ file }: { file: File }) {
	const { onCrop, ...data } = useImageCrop(file, 500);

	const handleOnCrop = async () => {
		const croppedBlob = await onCrop();
		const uploadableFile = new File([croppedBlob], file.name, { ...file });

		// ... Here you can handle the cropped file, e.g., upload it to a server or display it

		// Temporary preview for testing purposes
		const img = document.createElement('img');
		img.src = URL.createObjectURL(uploadableFile);
		document.body.appendChild(img);
	};

	return (
		<>
			<ImageEditor {...data} />
			<button
				onClick={handleOnCrop}
				className="cursor-pointer border border-gray-400 rounded-md px-2 py-1"
			>
				Apply
			</button>
		</>
	);
}
