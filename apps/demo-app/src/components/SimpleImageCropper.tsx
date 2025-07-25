import { useImageCrop, ImageEditor } from '@tunga/core';
import { useState } from 'react';
import SimpleAspectRatioForm from './SimpleAspectRatioForm';

export default function SimpleImageCropper({ file }: { file: File }) {
	const [aspectRatio, setAspectRatio] = useState<number | true | undefined>();

	const { onCrop, ...data } = useImageCrop(file, 500, aspectRatio, 25);
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
			<SimpleAspectRatioForm originalSize={data.originalSize} onChange={setAspectRatio} />
			<ImageEditor {...data} />
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
