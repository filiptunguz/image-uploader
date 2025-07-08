import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';
import { type Crop, cropImageFile } from '../utils/cropImageFile.ts';

// Default crop state
const defaultCrop: Crop = { x: 0, y: 0, width: 0, height: 0, canvasWidth: 0 };

// Hook to manage image cropping interaction logic
export const useImageCrop = (file: File, canvasWidth: number, keepAspectRatio?: number | true) => {
	const [crop, setCrop] = useState<Crop>(defaultCrop);
	const [resizing, setResizing] = useState(false);
	const [resizeStart, setResizeStart] = useState<Crop>(defaultCrop);
	const [moving, setMoving] = useState(false);
	const [moveLastPoint, setMoveLastPoint] = useState({ x: 0, y: 0 });

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const imgWidthRef = useRef<number>(0); // Stores the original image width

	// Load and draw the image on mount or file change
	useEffect(() => {
		if (!canvasRef.current || !containerRef.current) return;

		const url = URL.createObjectURL(file);
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();

		img.onload = () => {
			imgWidthRef.current = img.width;

			const aspectRatio = img.width / img.height;

			canvas.width = img.width = canvasWidth;
			canvas.height = img.height = canvasWidth / aspectRatio;

			// Determine initial crop area
			if (typeof keepAspectRatio === 'number' && keepAspectRatio > 0) {
				const isWidthReference = canvas.width <= canvas.height;
				const newWidth = isWidthReference ? canvas.width : canvas.height * keepAspectRatio;
				const newHeight = isWidthReference ? canvas.width / keepAspectRatio : canvas.height;

				setCrop({
					x: isWidthReference ? 0 : (canvas.width - newWidth) / 2,
					y: isWidthReference ? (canvas.height - newHeight) / 2 : 0,
					width: newWidth,
					height: newHeight,
					canvasWidth,
				});
			} else {
				setCrop({
					x: 0,
					y: 0,
					width: canvas.width,
					height: canvas.height,
					canvasWidth,
				});
			}

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			containerRef.current!.style.display = 'block'; // Show canvas
		};

		img.src = url;

		return () => URL.revokeObjectURL(url); // Cleanup
	}, [file]);

	// Begin resizing on mouse down
	const onResizeMouseDown = (e: ReactMouseEvent) => {
		e.preventDefault();
		setResizing(true);
		setResizeStart({ ...crop, x: e.clientX, y: e.clientY });

		window.addEventListener('mouseup', onMouseUp);
	};

	// Begin moving on mouse down
	const onMoveMouseDown = (e: ReactMouseEvent) => {
		e.preventDefault();
		setMoving(true);
		setMoveLastPoint({ x: e.clientX, y: e.clientY });

		window.addEventListener('mouseup', onMouseUp);
	};

	// Handle crop movement or resizing
	const onMouseMove = (e: ReactMouseEvent) => {
		if (resizing) {
			const deltaX = e.clientX - resizeStart.x;

			const aspectRatio =
				keepAspectRatio === true
					? canvasRef.current!.width / canvasRef.current!.height
					: keepAspectRatio;

			const maxWidth = containerRef.current!.clientWidth - crop.x;
			const maxHeight = containerRef.current!.clientHeight - crop.y;

			setCrop((prev) => {
				let newWidth;
				let newHeight;

				const isWidthReference = canvasRef.current!.clientWidth <= canvasRef.current!.clientHeight;
				if (isWidthReference) {
					newWidth = Math.min(Math.max(20, resizeStart.width + deltaX), maxWidth);
					newHeight = aspectRatio
						? newWidth / aspectRatio
						: Math.min(Math.max(20, resizeStart.height + (e.clientY - resizeStart.y)), maxHeight);
				} else {
					newHeight = Math.min(Math.max(20, resizeStart.height + deltaX), maxHeight);
					newWidth = aspectRatio
						? newHeight * aspectRatio
						: Math.min(Math.max(20, resizeStart.width + deltaX), maxWidth);
				}

				return {
					...prev,
					width: newWidth,
					height: newHeight,
					canvasWidth,
				};
			});
		} else if (moving) {
			const deltaX = e.clientX - moveLastPoint.x;
			const deltaY = e.clientY - moveLastPoint.y;

			const maxX = containerRef.current!.clientWidth - crop.width;
			const maxY = containerRef.current!.clientHeight - crop.height;

			setCrop((prev) => ({
				...prev,
				x: Math.min(Math.max(0, prev.x + deltaX), maxX),
				y: Math.min(Math.max(0, prev.y + deltaY), maxY),
				canvasWidth,
			}));

			setMoveLastPoint({ x: e.clientX, y: e.clientY });
		}
	};

	// End resize/move operation
	const onMouseUp = () => {
		setResizing(false);
		setMoving(false);
		window.removeEventListener('mouseup', onMouseUp);
	};

	// Resolution label shown to user (real px dimensions)
	const resolutionLabel = `${Math.round(crop.width * (imgWidthRef.current / canvasWidth))}px x ${Math.round(crop.height * (imgWidthRef.current / canvasWidth))}px`;

	return {
		crop,
		canvasRef,
		containerRef,
		originalWidth: imgWidthRef.current,
		onResizeMouseDown,
		onMoveMouseDown,
		onMouseMove,
		onCrop: async () => await cropImageFile(file, crop),
		resolutionLabel,
	};
};
