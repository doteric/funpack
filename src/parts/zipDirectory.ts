import fs from 'fs';
import archiver from 'archiver';

const zipDirectory = async (dirPath: string) => {
  return new Promise((resolve, reject) => {
    const zipFilePath = `${dirPath}.zip`;
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(zipFilePath, '-', archive.pointer(), 'total bytes');
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
