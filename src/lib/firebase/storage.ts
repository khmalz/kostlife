import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Get download URL for an image from Firebase Storage
 * @param path - Path to the image in storage (e.g., 'recipes/nasi-goreng.jpg')
 * @returns Download URL string
 */
export const getImageURL = async (path: string): Promise<string> => {
    try {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error getting image URL:", error);
        throw error;
    }
};

/**
 * Get multiple image URLs from Firebase Storage
 * @param paths - Array of paths to images in storage
 * @returns Array of download URL strings
 */
export const getMultipleImageURLs = async (
    paths: string[],
): Promise<string[]> => {
    try {
        const urls = await Promise.all(paths.map((path) => getImageURL(path)));
        return urls;
    } catch (error) {
        console.error("Error getting multiple image URLs:", error);
        throw error;
    }
};
