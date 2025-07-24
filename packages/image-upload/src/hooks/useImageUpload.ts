import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
export const useImageUpload = (onFilesSelected: (files: File[]) => void) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFiles = (files: FileList | null) => {
		if (!files) return;
		const fileArray = Array.from(files);
		onFilesSelected(fileArray);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		handleFiles(e.dataTransfer.files);
	};

	const handleClick = () => {
		inputRef.current?.click();
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleFiles(e.target.files);
	};

	return {
		isDragging,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		inputRef,
		handleClick,
		handleInputChange,
	};
};
