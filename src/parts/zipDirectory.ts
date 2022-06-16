import fs from 'fs';
import archiver from 'archiver';

const zipDirectory = async (dirPath: string) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${dirPath}.zip`);
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
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
