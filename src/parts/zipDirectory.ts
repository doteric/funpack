import { createWriteStream, existsSync, rmSync } from 'node:fs';
import archiver from 'archiver';

const zipDirectory = async (dirPath: string, removeDir = false) => {
  return new Promise((resolve, reject) => {
    const zipFilePath = `${dirPath}.zip`;
    const output = createWriteStream(zipFilePath);
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(zipFilePath, '-', archive.pointer(), 'total bytes');

      // Remove directory and leave only the zip files
      if (removeDir && existsSync(dirPath)) {
        rmSync(dirPath, { recursive: true });
      }

      resolve(true);
    });

    archive.on('error', (err: unknown) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(dirPath, false);

    archive.finalize();
  });
};

export default zipDirectory;
