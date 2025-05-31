import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to extract error message from RTK Query errors
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const errorData = error.data;
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      return String(errorData.message);
    }
  }
  return 'An unexpected error occurred';
}
