type ImageEditorProps = {
	file: File | null;
};

export default function ImageEditor(props: ImageEditorProps) {
	const { file } = props;

	if (!file) return null;

	const url = URL.createObjectURL(file);

	return (
		<div className="flex justify-center bg-white">
			<div className="max-w-2xl w-full p-4">
				<img
					src={url}
					alt="Image Editor"
					className="w-full h-auto object-contain border border-gray-300 rounded-lg shadow-lg"
					onLoad={() => URL.revokeObjectURL(url)} // Clean up memory
				/>
			</div>
		</div>
	);
}
