import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { SouthEastIcon } from '../icons/DefaultIcons.tsx';
import { type Crop, cropImageFile } from '../utils/cropImageFile.ts';

type ImageEditorProps = {
	file: File;
	canvasWidth?: number;
	keepAspectRatio?: boolean;
};

const defaultCrop: Crop = { x: 0, y: 0, width: 0, height: 0, canvasWidth: 0 };

export default function ImageEditor({ canvasWidth = 500, ...props }: ImageEditorProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [crop, setCrop] = useState<Crop>(defaultCrop);
	const [resizing, setResizing] = useState(false);
	const [resizeStart, setResizeStart] = useState<Crop>(defaultCrop);
	const [moving, setMoving] = useState(false);
	const [moveLastPoint, setMoveLastPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const { file } = props;

	useEffect(() => {
		if (!canvasRef.current || !containerRef.current) return;

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

			setCrop({
				x: 0,
				y: 0,
				width: img.width,
				height: img.height,
				canvasWidth,
			});

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			containerRef.current!.style.display = 'block'; // Show the canvas after drawing
		};

		img.src = url;

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [file]);

	const onResizeMouseDown = (e: ReactMouseEvent) => {
		e.preventDefault();
		setResizing(true);
		setResizeStart({
			x: e.clientX,
			y: e.clientY,
			width: crop.width,
			height: crop.height,
			canvasWidth,
		});

		addEventListener('mouseup', onMouseUp);
	};

	const onMoveMouseDown = (e: ReactMouseEvent) => {
		e.preventDefault();
		setMoving(true);
		setMoveLastPoint({ x: e.clientX, y: e.clientY });

		addEventListener('mouseup', onMouseUp);
	};

	const onMouseMove = (e: ReactMouseEvent) => {
		if (resizing) {
			const deltaX = e.clientX - resizeStart.x;

			const maxWidth = containerRef.current!.clientWidth - crop.x;
			const maxHeight = containerRef.current!.clientHeight - crop.y;

			setCrop((prev) => ({
				...prev,
				width: Math.min(Math.max(20, resizeStart.width + deltaX), maxWidth), // Minimum width: 20px
				height: Math.min(
					props.keepAspectRatio
						? (Math.max(20, resizeStart.width + deltaX) * prev.height) / prev.width
						: Math.max(20, resizeStart.height + (e.clientY - resizeStart.y)),
					maxHeight,
				),
				canvasWidth,
			}));
		} else if (moving) {
			const deltaX = e.clientX - moveLastPoint.x;
			const deltaY = e.clientY - moveLastPoint.y;

			const maxX = containerRef.current!.clientWidth - crop.width;
			const maxY = containerRef.current!.clientHeight - crop.height;

			setCrop((prev) => ({
				...prev,
				x: Math.min(Math.max(0, prev.x + deltaX), maxX), // Prevent moving out of bounds
				y: Math.min(Math.max(0, prev.y + deltaY), maxY),
				canvasWidth,
			}));

			setMoveLastPoint({ x: e.clientX, y: e.clientY });
		}
	};

	const onMouseUp = () => {
		setResizing(false);
		setMoving(false);

		// remove event listeners
		removeEventListener('mouseup', onMouseUp);
	};

	const onCrop = async () => {
		if (!canvasRef.current) return;

		const croppedBlob = await cropImageFile(file, crop);
		const uploadableFile = new File([croppedBlob], file.name, { ...file });

		const img = document.createElement('img');
		img.src = URL.createObjectURL(uploadableFile);
		document.body.appendChild(img); // For testing, append the cropped image to the body
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
				</div>
			</div>
			<button onClick={onCrop}>crop2</button>
		</>
	);
}
