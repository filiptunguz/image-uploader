export type Crop = {
	x: number;
	y: number;
	width: number;
	height: number;
	canvasWidth: number;
};

export async function cropImageFile(file: File, crop: Crop): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);

		img.onload = () => {
			const widthRatio = img.width / crop.canvasWidth;
			console.log(crop.x);

			const canvas = document.createElement('canvas');
			canvas.width = crop.width * widthRatio;
			canvas.height = crop.height * widthRatio;

			const ctx = canvas.getContext('2d');
			if (!ctx) return reject(new Error('Canvas context error'));

			ctx.drawImage(
				img,
				crop.x * widthRatio,
				crop.y * widthRatio,
				crop.width * widthRatio,
				crop.height * widthRatio, // source
				0,
				0,
				crop.width * widthRatio,
				crop.height * widthRatio, // destination
			);

			canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob);
					URL.revokeObjectURL(url);
				} else reject(new Error('Failed to convert canvas to blob'));
			}, file.type);
		};
		img.onerror = reject;
		img.src = url;
	});
}
