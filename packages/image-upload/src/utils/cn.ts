import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names conditionally.
 * Originally from Shadcn UI (https://ui.shadcn.com/docs/installation/manual)
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}