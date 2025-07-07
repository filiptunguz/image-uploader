import ImageUploader from '../components/ImageUploader.tsx';

export default function App() {
	return (
		<div className="flex justify-center items-center h-screen bg-white">
			<ImageUploader onFileSelected={console.log} />
		</div>
	);
}
