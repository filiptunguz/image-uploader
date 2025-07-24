import type { InputHTMLAttributes } from 'react';

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			className="input bg-white shadow-lg border-neutral-200 px-3 py-2 rounded w-22 transition-[width] focus:w-30 outline-primary outline-offset-2"
		/>
	);
}
