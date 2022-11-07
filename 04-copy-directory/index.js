(async () => {
  const fsP = require('fs/promises');
  const path = require('path');
  const {stdout} = process;

  async function deepCopyAssets(entrypoint, folderName, pathDirOutput) {
    async function copyAssets(entrypoint, folderName, pathDirOutput) {
      let newOutputPath = path.join(pathDirOutput, folderName);
      const assets = await fsP.readdir(entrypoint);
      
      await fsP.mkdir(path.join(newOutputPath), {recursive: true});
      for (const elem of assets) {
        if ((await fsP.stat(path.join(entrypoint, elem))).isDirectory()) {
          copyAssets(path.join(entrypoint, elem), elem, newOutputPath)
        } else {
          await fsP.copyFile(path.join(entrypoint, elem), path.join(newOutputPath, elem))
        }
      }
    }

    await fsP.rm(path.join(pathDirOutput, folderName), {recursive: true, force: true});
    await copyAssets(entrypoint, folderName, pathDirOutput);
    stdout.write(`\n~ Папка files успешно скопирована.\n`);
  }

  try {
    const pathDirOutput = path.join(__dirname); 
    await fsP.mkdir(pathDirOutput, {recursive: true});
    await deepCopyAssets(path.join(__dirname, 'files'), 'files-copy', pathDirOutput);
  } catch (err) {
    throw err;
  }
})();