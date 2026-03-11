import { Directory, File, Paths } from 'expo-file-system';
import JSZip from 'jszip';
import { Platform } from 'react-native';

const IMAGES_DIR = 'images';

/**
 * Creates a backup ZIP file containing data.json and all images
 * @param jsonData The JSON string of the recipes database
 * @returns The local URI of the created ZIP file
 */
export const createBackupZip = async (jsonData: string): Promise<string> => {
    if (Platform.OS === 'web') {
        throw new Error('Backup creation is not supported on web.');
    }

    const zip = new JSZip();

    // 1. Add data.json to the root of the ZIP
    zip.file('data.json', jsonData);

    // 2. Add images to the 'images/' folder in the ZIP
    const imagesFolder = zip.folder(IMAGES_DIR);
    if (imagesFolder) {
        const localImagesDir = new Directory(Paths.document, IMAGES_DIR);
        
        if (localImagesDir.exists) {
            const files = localImagesDir.list();
            for (const fileItem of files) {
                // Check if it's a file (not a subdirectory)
                if (fileItem instanceof File) {
                    try {
                        // Read file as base64 using the new File API
                        const base64Data = fileItem.base64Sync();
                        // Add to zip
                        imagesFolder.file(fileItem.name, base64Data, { base64: true });
                    } catch (err) {
                        console.warn(`Failed to read image for backup: ${fileItem.uri}`, err);
                    }
                }
            }
        }
    }

    // 3. Generate the ZIP file asynchronously
    const zipBase64 = await zip.generateAsync({ type: 'base64' });

    // 4. Save the ZIP to the cache directory using the new File API
    const backupFile = new File(Paths.cache, 'what-to-cook-backup.zip');
    backupFile.write(zipBase64, { encoding: 'base64' });

    return backupFile.uri;
};

/**
 * Restores the database and images from a backup ZIP file
 * @param zipUri The local URI of the ZIP file to restore from
 * @param importDataCallback The callback to import the JSON data into the DB
 */
export const restoreFromBackupZip = async (
    zipUri: string,
    importDataCallback: (json: string) => Promise<void>
): Promise<void> => {
    if (Platform.OS === 'web') {
        throw new Error('Backup restoration is not supported on web.');
    }

    try {
        // 1. Read the ZIP file as base64 using the new File API
        const zipFile = new File(zipUri);
        const zipBase64 = zipFile.base64Sync();

        // 2. Parse the ZIP content
        const zip = await JSZip.loadAsync(zipBase64, { base64: true });

        // 3. Extract and import data.json
        const dataFile = zip.file('data.json');
        if (!dataFile) {
            throw new Error('Invalid backup file: data.json is missing.');
        }
        const jsonData = await dataFile.async('string');
        await importDataCallback(jsonData);

        // 4. Extract and save images
        const localImagesDir = new Directory(Paths.document, IMAGES_DIR);
        
        // Ensure local images directory exists
        if (!localImagesDir.exists) {
            localImagesDir.create();
        }

        const imagesKeys = Object.keys(zip.files).filter(
            (name) => name.startsWith(`${IMAGES_DIR}/`) && !zip.files[name].dir
        );

        for (const imageKey of imagesKeys) {
            const imageInZip = zip.file(imageKey);
            if (imageInZip) {
                const filename = imageKey.split('/').pop();
                if (filename) {
                    const base64Content = await imageInZip.async('base64');
                    // Create new File object in the images directory and write content
                    const destFile = new File(localImagesDir, filename);
                    destFile.write(base64Content, { encoding: 'base64' });
                }
            }
        }
    } catch (err) {
        console.error('Failed to restore from backup:', err);
        throw err;
    }
};
