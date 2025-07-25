import { useState } from 'react';

export const useImageFiles = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [fileToEdit, setFileToEdit] = useState<File | null>(null);

	const removeFile = (file: File) => {
		setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
	};

	return {
		files,
		setFiles,
		fileToEdit,
		setFileToEdit,
		removeFile,
	};
};
