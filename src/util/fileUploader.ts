import { promises as fs, createWriteStream } from 'fs';
import * as path from 'path';
import { URL } from 'url';
import logger from './logger';

// Define the directory path where files will be stored
const dirPath = __dirname + '/../public/';

/**
 * Checks if a file exists in the specified directory
 * @param fileName - The name of the file to check
 * @returns A promise that resolves to true if the file exists, otherwise false
 */
export const fileExists = async (fileName: string): Promise<boolean> => {
  try {
    // Check if the file can be accessed
    await fs.access(dirPath + fileName);
    return true;
  } catch {
    return false;
  }
};

/**
 * Uploads a file to the specified directory
 * @param file - The file stream to be uploaded
 * @param fileName - The name of the file to be saved
 * @returns A promise that resolves to true if the upload is successful, otherwise rejects with an error
 */
// Accept either a Readable stream with .pipe or a Buffer
export const uploader = (file: any, fileName: string): Promise<boolean> =>
  new Promise(async (resolve, reject) => {
    try {
      const fullPath = path.join(dirPath, fileName);
      // If file is a buffer-like object, write directly
      if (file && file.buffer && Buffer.isBuffer(file.buffer)) {
        await fs.writeFile(fullPath, file.buffer);
        return resolve(true);
      }
      // If file is a stream, pipe it
      if (file && typeof file.pipe === 'function') {
        const writeStream = createWriteStream(fullPath);
        file.pipe(writeStream);
        writeStream.on('finish', () => resolve(true));
        writeStream.on('error', (err: any) => reject(err));
        return;
      }
      // Unsupported input
      reject(new Error('Unsupported file input. Provide a Buffer or a Readable stream.'));
    } catch (err) {
      reject(err as any);
    }
  });

/**
 * Removes a file from the specified directory
 * @param fileName - The name or URL of the file to be removed
 * @returns A promise that resolves when the file is removed
 */
export const removeFile = async (fileName: string): Promise<void> => {
  try {
    let baseName;
    // Check if the fileName is a URL
    if (fileName.startsWith('http')) {
      // Parse the URL to get the pathname
      const url = new URL(fileName);
      const pathname = url.pathname;
      baseName = path.basename(pathname);
    } else {
      // Use the fileName directly if it's not a URL
      baseName = fileName;
    }

    // Remove the file from the directory
    await fs.unlink(dirPath + baseName);
  } catch (error: any) {
    // Log an error message if the file removal fails
    logger.error(`Failed to remove the file at path: ${dirPath + fileName}. Error: ${error.message}`);
  }
};
