import { type ChangeEvent, useState } from 'react';
import Input from './Input.tsx';

type AspectRatioOption = {
	value: AspectRatioValue;
	ratio: [number, number] | null; // null means original
};

type AspectRatioValue =
	| 'free'
	| 'custom'
	| 'original'
	| '1:1'
	| '3:2'
	| '2:3'
	| '4:3'
	| '3:4'
	| '16:9'
	| '9:16';

const aspectRatios: AspectRatioOption[] = [
	{ value: 'free', ratio: null },
	{ value: 'custom', ratio: null },
	{ value: 'original', ratio: null },
	{ value: '1:1', ratio: [1, 1] },
	{ value: '3:2', ratio: [3, 2] },
	{ value: '2:3', ratio: [2, 3] },
	{ value: '4:3', ratio: [4, 3] },
	{ value: '3:4', ratio: [3, 4] },
	{ value: '16:9', ratio: [16, 9] },
	{ value: '9:16', ratio: [9, 16] },
];

function getSimplestAspectRatio(width: number, height: number): [number, number] {
	// Round both numbers to remove floating-point inaccuracies
	const roundedWidth = Math.round(width);
	const roundedHeight = Math.round(height);

	// Helper function to calculate GCD
	function gcd(a: number, b: number): number {
		return b === 0 ? a : gcd(b, a % b);
	}

	const divisor = gcd(roundedWidth, roundedHeight);
	return [roundedWidth / divisor, roundedHeight / divisor];
}

export default function AspectRatio({
	originalAspectRatio,
}: {
	originalAspectRatio: [number, number];
}) {
	const [selectedValue, setSelectedValue] = useState<AspectRatioValue>('free');
	const [[width, height], setDimensions] = useState<[number, number]>([0, 0]);

	const onDimensionChange =
		(axis: 'width' | 'height') => (event: ChangeEvent<HTMLInputElement>) => {
			let value = parseFloat(event.target.value);
			if (isNaN(value)) value = 0;

			const newDimensions: [number, number] = axis === 'width' ? [value, height] : [width, value];

			setDimensions(newDimensions);
			selectMatchingAspectRatio(newDimensions[0], newDimensions[1]);
		};

	const selectMatchingAspectRatio = (width: number, height: number) => {
		if (width > 0 && height > 0) {
			const matchingOption = aspectRatios.find((opt) =>
				opt.ratio ? opt.ratio[0] / opt.ratio[1] === width / height : false,
			);

			setSelectedValue(matchingOption ? matchingOption.value : 'custom');
		} else setSelectedValue('free');
	};

	const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value as AspectRatioValue;
		setSelectedValue(value);

		if (value === 'original')
			setDimensions(getSimplestAspectRatio(originalAspectRatio[0], originalAspectRatio[1]));
		else {
			const matchingRatio = aspectRatios.find((opt) => opt.value === value)!.ratio;
			setDimensions(matchingRatio ?? [0, 0]);
		}
	};

	return (
		<form className="flex gap-4 items-center">
			<select
				className="bg-white rounded border-neutral-200 outline-primary outline-offset-2 px-3 py-2.5 w-28 transition-[width] focus:w-36 cursor-pointer"
				value={selectedValue}
				onChange={onSelectChange}
			>
				{aspectRatios.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.value}
					</option>
				))}
			</select>
			<Input
				min={0}
				type="number"
				placeholder="width"
				value={width > 0 ? width : ''}
				onChange={onDimensionChange('width')}
			/>
			<span className="-mx-2 font-medium text-2xl leading-none text-white block">:</span>
			<Input
				min={0}
				type="number"
				placeholder="height"
				value={height > 0 ? height : ''}
				onChange={onDimensionChange('height')}
			/>
		</form>
	);
}
