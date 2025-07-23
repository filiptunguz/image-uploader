import { SouthEastIcon } from '../../icons/DefaultIcons.tsx';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import type { Crop } from '../../utils/cropImageFile.ts';

type SimpleImageEditorProps = {
	crop: Crop;
	onMouseMove: (event: ReactMouseEvent) => void;
	containerRef: RefObject<HTMLDivElement | null>;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	onMoveMouseDown: (event: ReactMouseEvent) => void;
	onResizeMouseDown: (event: ReactMouseEvent) => void;
	resolutionLabel: string;
	showHorizontalSnapLine: boolean;
	showVerticalSnapLine: boolean;
};

export default function SimpleImageEditor(props: SimpleImageEditorProps) {
	return (
		<>
			<div
				className="hidden relative rounded-3xl overflow-hidden"
				onMouseMove={props.onMouseMove}
				ref={props.containerRef}
			>
				<canvas ref={props.canvasRef} />
				<div
					className="absolute top-0 left-0 border-primary border-[3px] h-full w-full rounded-3xl overflow-hidden"
					onMouseDown={props.onMoveMouseDown}
					style={{
						width: `${props.crop.width}px`,
						height: `${props.crop.height}px`,
						transform: `translate(${props.crop.x}px, ${props.crop.y}px)`,
					}}
				>
					<div
						className="absolute bottom-1.5 right-1.5 text-primary hover:text-primary/50 transition-colors"
						onMouseDown={props.onResizeMouseDown}
					>
						<SouthEastIcon />
					</div>
					<div className="absolute top-0 left-0 bg-primary pl-2 pr-1 py-0.5 text-xs">
						{props.resolutionLabel}
					</div>
				</div>
				{props.showVerticalSnapLine && (
					<div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-[1px] opacity-80 bg-primary" />
				)}
				{props.showHorizontalSnapLine && (
					<div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[1px] opacity-80 w-full bg-primary" />
				)}
			</div>
		</>
	);
}
