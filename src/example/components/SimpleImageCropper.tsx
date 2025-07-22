import { useImageCrop } from '../../hooks/useImageCrop.ts';
import SimpleImageEditor from './SimpleImageEditor.tsx';
import { useState } from 'react';
import AspectRatio from './AspectRatio.tsx';

export default function SimpleImageCropper({ file }: { file: File }) {
	const { onCrop, ...data } = useImageCrop(file, 500);
	const [url, setUrl] = useState<string | null>(null);

	const handleOnCrop = async () => {
		const croppedBlob = await onCrop();
		const uploadableFile = new File([croppedBlob], file.name, { ...file });

		// ... Here you can handle the cropped file, e.g., upload it to a server or display it

		// Temporary preview for testing purposes
		setUrl(URL.createObjectURL(uploadableFile));
	};

	return (
		<>
			<AspectRatio />
			<SimpleImageEditor {...data} />
			<button onClick={handleOnCrop} className="cursor-pointer rounded-full px-4 py-2 bg-primary">
				Apply
			</button>
			{url && (
				<img
					src={url}
					alt="Cropped Preview"
					onLoad={() => URL.revokeObjectURL(url)}
					className="rounded-3xl border-2 border-secondary w-[700px] max-w-full"
				/>
			)}
		</>
	);
}
