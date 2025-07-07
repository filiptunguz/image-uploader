import { useEffect, useRef } from 'react';

type ImageEditorProps = {
	file: File;
	canvasWidth?: number;
};

export default function ImageEditor({ canvasWidth = 500, ...props }: ImageEditorProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const { file } = props;

	useEffect(() => {
		if (!canvasRef.current) return;

		const url = URL.createObjectURL(file);
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();

		img.onload = () => {
			// get image aspect ratio
			const aspectRatio = img.width / img.height;

			canvas.width = img.width = canvasWidth;
			canvas.height = img.height = canvasWidth / aspectRatio;

			console.log(`Image loaded: ${img.width}x${img.height}, Aspect Ratio: ${aspectRatio}`);

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.style.display = 'block'; // Show the canvas after drawing
		};

		img.src = url;

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [file]);

	return <canvas className="hidden" ref={canvasRef} />;
}
