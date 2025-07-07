import type { ReactNode } from 'react';
import { cn } from '../utils/utils.ts';
import { useImageUpload } from '../hooks/useImageUpload.ts';

type ImageUploaderProps = {
	uploadIcon?: ReactNode;
	onFileSelected: (files: File[]) => void;
	className?: string;
};

export default function ImageUploader(props: ImageUploaderProps) {
	const {
		inputRef,
		isDragging,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleClick,
		handleInputChange,
	} = useImageUpload(props.onFileSelected);

	return (
		<div
			className={cn(
				'text-gray-500 rounded-3xl p-6 border border-gray-500 hover:bg-gray-100 hover:text-gray-400 cursor-pointer transition-colors',
				isDragging && 'bg-gray-100 border-dashed',
				props.className,
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={handleClick}
		>
			<div className="flex flex-col gap-2 items-center italic">
				<span>Drag and drop images or click to upload</span>
				{props.uploadIcon ?? <DefaultUploadIcon />}
			</div>
			<input
				type="file"
				multiple
				accept="image/*"
				ref={inputRef}
				className="hidden"
				onChange={handleInputChange}
			/>
		</div>
	);
}

function DefaultUploadIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="24px"
			viewBox="0 0 24 24"
			width="24px"
			fill="currentColor"
			className="size-28"
		>
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z" />
		</svg>
	);
}
