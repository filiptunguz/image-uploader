import type { ReactNode } from 'react';
import { cn } from '../utils/utils.ts';
import { useImageUpload } from '../hooks/useImageUpload.ts';
import { UploadIcon } from '../icons/DefaultIcons.tsx';

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
				'text-primary bg-secondary/40 rounded-3xl p-6 border border-secondary hover:bg-secondary/70 hover:text-primary/80 cursor-pointer transition-colors',
				isDragging && 'bg-secondary/70 border-dashed',
				props.className,
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={handleClick}
		>
			<div className="flex flex-col gap-2 items-center italic">
				<span>Drag and drop images or click to upload</span>
				{props.uploadIcon ?? <UploadIcon />}
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
