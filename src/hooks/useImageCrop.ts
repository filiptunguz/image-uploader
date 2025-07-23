import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';
import { type Crop, cropImageFile } from '../utils/cropImageFile.ts';

const SNAP_THRESHOLD = 15; // pixels

// Default crop state
const defaultCrop: Crop = { x: 0, y: 0, width: 0, height: 0, canvasWidth: 0 };

// Hook to manage image cropping interaction logic
export const useImageCrop = (
	file: File,
	canvasWidth: number,
	keepAspectRatio?: number | true,
	snapToCenter?: boolean,
) => {
	const [crop, setCrop] = useState<Crop>(defaultCrop);
	const [resizing, setResizing] = useState(false);
	const [resizeStart, setResizeStart] = useState<Crop>(defaultCrop);
	const [moving, setMoving] = useState(false);
	const [moveLastPoint, setMoveLastPoint] = useState({ x: 0, y: 0 });
	const [showHorizontalSnapLine, setShowHorizontalSnapLine] = useState(false);
	const [showVerticalSnapLine, setShowVerticalSnapLine] = useState(false);
	const [virtualMove, setVirtualMove] = useState({ x: 0, y: 0 });

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const originalSizeRef = useRef<[number, number]>([0, 0]); // Stores the original image width

	// Load and draw the image on mount or file change
	useEffect(() => {
		if (!canvasRef.current || !containerRef.current) return;

		const url = URL.createObjectURL(file);
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();

		img.onload = () => {
			URL.revokeObjectURL(url); // Cleanup previous URL

			originalSizeRef.current = [img.width, img.height];

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
	}, [file]);

	const setCropByAspectRatio = (aspectRatio: number) => {
		const originalAspectRatio = originalSizeRef.current[0] / originalSizeRef.current[1];

		let newWidth, newHeight;
		if (aspectRatio >= originalAspectRatio) {
			// fit the width of the original image
			newWidth = canvasWidth;
			newHeight = canvasWidth / aspectRatio;
		} else {
			// fit the height of the original image
			newHeight = canvasWidth / originalAspectRatio;
			newWidth = newHeight * aspectRatio;
		}

		setCrop((prev) => ({
			...prev,
			x: (canvasWidth - newWidth) / 2,
			y: (canvasRef.current!.height - newHeight) / 2,
			width: newWidth,
			height: newHeight,
			canvasWidth,
		}));
	};

	useEffect(() => {
		if (keepAspectRatio) {
			if (keepAspectRatio === true) {
				// use original aspect ratio if keepAspectRatio is true
				setCropByAspectRatio(originalSizeRef.current[0] / originalSizeRef.current[1]);
			} else setCropByAspectRatio(keepAspectRatio);
		}
	}, [keepAspectRatio]);

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
		const shouldSnapToCenter = (
			width: number,
			height: number,
			x: number,
			y: number,
			resizing?: boolean,
		) => {
			if (snapToCenter) {
				const centerX = containerRef.current!.clientWidth / 2;
				const centerY = containerRef.current!.clientHeight / 2;

				const isCloseToCenterX = Math.abs(x + width / 2 - centerX) < SNAP_THRESHOLD;
				const isCloseToCenterY = Math.abs(y + height / 2 - centerY) < SNAP_THRESHOLD;

				if (isCloseToCenterX != showVerticalSnapLine) setShowVerticalSnapLine(isCloseToCenterX);
				if (isCloseToCenterY != showHorizontalSnapLine) setShowHorizontalSnapLine(isCloseToCenterY);

				if (resizing) return { x, y };

				return {
					x: isCloseToCenterX ? centerX - width / 2 : x,
					y: isCloseToCenterY ? centerY - height / 2 : y,
				};
			}

			return { x, y };
		};

		if (resizing) {
			const deltaX = e.clientX - resizeStart.x;
			const deltaY = e.clientY - resizeStart.y;

			const aspectRatio =
				keepAspectRatio === true
					? canvasRef.current!.width / canvasRef.current!.height
					: keepAspectRatio;

			const maxWidth = containerRef.current!.clientWidth - crop.x;
			const maxHeight = containerRef.current!.clientHeight - crop.y;

			let newWidth;
			let newHeight;

			const isWidthReference = canvasRef.current!.clientWidth <= canvasRef.current!.clientHeight;
			if (isWidthReference) {
				newWidth = Math.min(Math.max(20, resizeStart.width + deltaX), maxWidth);
				newHeight = aspectRatio
					? newWidth / aspectRatio
					: Math.min(Math.max(20, resizeStart.height + deltaY), maxHeight);
			} else {
				newHeight = Math.min(Math.max(20, resizeStart.height + deltaY), maxHeight);
				newWidth = aspectRatio
					? newHeight * aspectRatio
					: Math.min(Math.max(20, resizeStart.width + deltaX), maxWidth);
			}

			const { x, y } = shouldSnapToCenter(newWidth, newHeight, crop.x, crop.y, true);

			setCrop((prev) => ({
				...prev,
				x,
				y,
				width: newWidth,
				height: newHeight,
				canvasWidth,
			}));
		} else if (moving) {
			const deltaX = e.clientX - moveLastPoint.x;
			const deltaY = e.clientY - moveLastPoint.y;

			const maxX = containerRef.current!.clientWidth - crop.width;
			const maxY = containerRef.current!.clientHeight - crop.height;

			const newX = Math.min(Math.max(0, crop.x + deltaX), maxX);
			const newY = Math.min(Math.max(0, crop.y + deltaY), maxY);
			let { x, y } = shouldSnapToCenter(crop.width, crop.height, newX, newY);
			if (newX !== x || newY !== y) {
				const newVirtualMove = {
					x: newX !== x ? virtualMove.x + (newX - x) : virtualMove.x,
					y: newY !== y ? virtualMove.y + (newY - y) : virtualMove.y,
				};

				if (Math.abs(newVirtualMove.x) > SNAP_THRESHOLD) {
					x += newVirtualMove.x;
					newVirtualMove.x = 0; // Reset virtual move after applying
				}

				if (Math.abs(newVirtualMove.y) > SNAP_THRESHOLD) {
					y += newVirtualMove.y;
					newVirtualMove.y = 0; // Reset virtual move after applying
				}

				setVirtualMove(newVirtualMove);
			}

			setCrop((prev) => ({
				...prev,
				x,
				y,
				canvasWidth,
			}));

			setMoveLastPoint({ x: e.clientX, y: e.clientY });
		}
	};

	// End resize/move operation
	const onMouseUp = () => {
		setResizing(false);
		setMoving(false);
		if (snapToCenter && showHorizontalSnapLine) setShowHorizontalSnapLine(false);
		if (snapToCenter && showVerticalSnapLine) setShowVerticalSnapLine(false);
		window.removeEventListener('mouseup', onMouseUp);
	};

	// Resolution label shown to user (real px dimensions)
	const resolutionLabel = `${Math.round(crop.width * (originalSizeRef.current[0] / canvasWidth))}px x ${Math.round(crop.height * (originalSizeRef.current[0] / canvasWidth))}px`;

	return {
		crop,
		canvasRef,
		containerRef,
		onResizeMouseDown,
		onMoveMouseDown,
		onMouseMove,
		onCrop: async () => await cropImageFile(file, crop),
		originalSize: originalSizeRef.current,
		resolutionLabel,
	};
};
