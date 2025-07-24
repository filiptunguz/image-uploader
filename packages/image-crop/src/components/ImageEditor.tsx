import { SouthEastIcon } from '../icons/DefaultIcons';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import type { Crop } from '../utils';

type ImageEditorProps = {
	crop: Crop;
	onMouseMove: (event: ReactMouseEvent) => void;
	containerRef: RefObject<HTMLDivElement | null>;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	onMoveMouseDown: (event: ReactMouseEvent) => void;
	onResizeMouseDown: (event: ReactMouseEvent) => void;
	resolutionLabel: string;
};

export function ImageEditor(props: ImageEditorProps) {
	return (
		<>
			<div
				className="hidden relative border border-gray-400"
				onMouseMove={props.onMouseMove}
				ref={props.containerRef}
			>
				<canvas ref={props.canvasRef} />
				<div
					className="absolute top-0 left-0 resize border-white border-[3px] h-full w-full"
					onMouseDown={props.onMoveMouseDown}
					style={{
						width: `${props.crop.width}px`,
						height: `${props.crop.height}px`,
						transform: `translate(${props.crop.x}px, ${props.crop.y}px)`,
					}}
				>
					<div
						className="absolute -bottom-0.5 -right-0.5 text-white hover:text-gray-200 transition-colors"
						onMouseDown={props.onResizeMouseDown}
					>
						<SouthEastIcon />
					</div>
					<div className="absolute top-0 left-0 bg-white px-1 py-0.5 text-xs">
						{props.resolutionLabel}
					</div>
				</div>
			</div>
		</>
	);
}
