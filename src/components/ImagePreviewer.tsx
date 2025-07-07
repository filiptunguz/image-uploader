import { cn } from '../utils/utils.ts';

type ImagePreviewerProps = {
	cardClassName?: string;
	containerClassName?: string;
	imageClassName?: string;
	files: File[];
	gridColumns?: number;
};

export default function ImagePreviewer({ gridColumns = 4, ...props }: ImagePreviewerProps) {
	const { files } = props;
	if (files.length === 0) return null;

	return (
		<div
			className={cn('grid gap-4 max-w-full p-4', props.containerClassName)}
			style={{
				gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
			}}
		>
			{files.map((file, index) => {
				const url = URL.createObjectURL(file);
				return (
					<div
						key={index}
						className={cn(
							'flex-shrink-0 size-[200px] border border-gray-400 rounded-lg',
							props.cardClassName,
						)}
					>
						<img
							src={url}
							alt={`Preview ${index}`}
							className={cn('w-full h-full object-contain', props.imageClassName)}
							onLoad={() => URL.revokeObjectURL(url)} // Clean up memory
						/>
					</div>
				);
			})}
		</div>
	);
}
