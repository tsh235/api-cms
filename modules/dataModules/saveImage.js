import { access, mkdir, writeFile } from 'fs/promises';

export const saveImage = async (id, base64, format) => {
  const folderName = 'image';

  try {
    await access(folderName);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdir(folderName);
      console.log(`Папка ${folderName} создана`);
    }
  }

  const ext = format === 'svg+xml' ? 'svg' : format === 'jpeg' ? 'jpg' : format;

  const base64Image = base64.split(';base64,')[1];
  const fileName = `${id}.${ext}`;
  const pathFile = `${folderName}/${fileName}`;

  await writeFile(pathFile, base64Image, {
    encoding: 'base64',
  });

  return pathFile;
};
