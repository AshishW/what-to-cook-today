import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const IMAGES_DIR = 'images';

/**
 * Ensures the permanent images directory exists.
 */
const ensureImagesDir = () => {
  if (Platform.OS === 'web') return null;
  const dir = new Directory(Paths.document, IMAGES_DIR);
  if (!dir.exists) {
    dir.create();
  }
  return dir;
};

/**
 * Copies a file from a temporary URI to permanent storage.
 * @param uri The temporary URI (e.g. from image picker)
 * @returns The permanent URI of the copied file
 */
export const saveImagePermanently = async (uri: string): Promise<string> => {
  if (Platform.OS === 'web' || !uri || uri.startsWith('http') || uri.startsWith('data:')) {
    return uri;
  }

  try {
    const imagesDir = ensureImagesDir();
    if (!imagesDir) return uri;

    const sourceFile = new File(uri);
    if (!sourceFile.exists) {
        console.warn('Source file does not exist:', uri);
        return uri;
    }

    // Create a unique filename to avoid collisions
    const extension = uri.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const destinationFile = new File(imagesDir, filename);

    sourceFile.copy(destinationFile);
    return destinationFile.uri;
  } catch (error) {
    console.error('Failed to save image permanently:', error);
    return uri;
  }
};

/**
 * Deletes an image file from the permanent storage.
 * @param uri The URI of the file to delete
 */
export const deleteImageFile = async (uri: string): Promise<void> => {
  if (Platform.OS === 'web' || !uri || uri.startsWith('http') || uri.startsWith('data:')) {
    return;
  }

  try {
    const file = new File(uri);
    if (file.exists && uri.includes(IMAGES_DIR)) {
      file.delete();
    }
  } catch (error) {
    console.error('Failed to delete image file:', error);
  }
};
