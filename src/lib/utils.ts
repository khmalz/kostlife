import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFirestoreTimestamps = (obj: unknown): unknown => {
  if (!obj) return obj;

  if (
    obj &&
    typeof obj === 'object' &&
    'seconds' in obj &&
    'nanoseconds' in obj &&
    typeof (obj as { seconds: unknown }).seconds === 'number' &&
    typeof (obj as { nanoseconds: unknown }).nanoseconds === 'number'
  ) {
    const seconds = (obj as { seconds: number }).seconds;
    const nanoseconds = (obj as { nanoseconds: number }).nanoseconds;
    return new Date(seconds * 1000 + nanoseconds / 1000000).toISOString();
  }

  // If it's a plain object, recursively convert all properties
  if (typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertFirestoreTimestamps(value);
    }
    return converted;
  }

  // If it's an array, map through and convert each item
  if (Array.isArray(obj)) {
    return obj.map((item) => convertFirestoreTimestamps(item));
  }

  return obj;
};
