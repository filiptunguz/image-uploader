import { SouthEastIcon } from '../icons/DefaultIcons.tsx';
import { useImageCrop } from '../hooks/useImageCrop.ts';

type ImageEditorProps = {
	file: File;
	canvasWidth?: number;
	keepAspectRatio?: boolean;
};

export default function ImageEditor({ canvasWidth = 500, ...props }: ImageEditorProps) {
	const { file } = props;
	const {
		crop,
		canvasRef,
		containerRef,
		onResizeMouseDown,
		onMoveMouseDown,
		onMouseMove,
		onCrop,
		resolutionLabel,
	} = useImageCrop(file, canvasWidth, 1);

	const handleOnCrop = async () => {
		const croppedBlob = await onCrop();
		const uploadableFile = new File([croppedBlob], file.name, { ...file });

		// Temporary preview for testing purposes
		const img = document.createElement('img');
		img.src = URL.createObjectURL(uploadableFile);
		document.body.appendChild(img);
	};

	return (
		<>
			<div
				className="hidden relative border border-gray-400"
				onMouseMove={onMouseMove}
				ref={containerRef}
			>
				<canvas ref={canvasRef} />
				<div
					className="absolute top-0 left-0 resize border-white border-[3px] h-full w-full"
					onMouseDown={onMoveMouseDown}
					style={{
						width: `${crop.width}px`,
						height: `${crop.height}px`,
						transform: `translate(${crop.x}px, ${crop.y}px)`,
					}}
				>
					<div
						className="absolute -bottom-0.5 -right-0.5 text-white hover:text-gray-200 transition-colors"
						onMouseDown={onResizeMouseDown}
					>
						<SouthEastIcon />
					</div>
					<div className="absolute top-0 left-0 bg-white px-1 py-0.5 text-xs">
						{resolutionLabel}
					</div>
				</div>
			</div>
			<button onClick={handleOnCrop}>crop2</button>
		</>
	);
}
