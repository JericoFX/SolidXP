import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for combining CSS classes
 * Combines clsx functionality for conditional class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}