;(async () => {
  const fsP = require('fs/promises');
  const path = require('path');
  const { stdout } = process;

  async function bundleStyles(pathDirOutput) {
    const styles = await fsP.readdir(path.join(__dirname, 'styles'));
    const pathFileStylesOutput = path.join(pathDirOutput, 'style.css');

    await fsP.writeFile(pathFileStylesOutput, '');

    for (const file of styles) {
      const {ext} = path.parse(file);
      
      if (ext !== '.css') {
        continue;
      }

      const data = await fsP.readFile(
        path.join(__dirname, `styles/${file}`),
        {encoding: 'utf-8'}
      );
      
      await fsP.appendFile(pathFileStylesOutput, data);
    }

    stdout.write('\n~ Стили успешно собраны в единый файл style.css.\n');
  }

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
    stdout.write(`\n~ Папка ${folderName} успешно скопирована.\n`);
  }

  async function bundleHTML(pathDirOutput, pathComponents, pathTemplate) {
    const components = await fsP.readdir(pathComponents);
    let template = await fsP.readFile(pathTemplate, 'utf-8');

    for (const component of components) {
      const {name} = path.parse(component);
      
      while (template.includes(`{{${name}}}`)) {
        const replacement = await fsP.readFile(path.join(pathComponents, component), 'utf-8');
        template = template.replace(`{{${name}}}`, replacement);
      }
    }

    await fsP.writeFile(path.join(pathDirOutput, 'index.html'), template);

    stdout.write(`\n~ Компоненты успешно собраны в единый файл index.html.\n`);
  }

  const pathDirOutput = path.join(__dirname, 'project-dist'); 

  try {
    await fsP.mkdir(pathDirOutput, {recursive: true});
    await bundleStyles(pathDirOutput);
    await deepCopyAssets(path.join(__dirname, 'assets'), 'assets', pathDirOutput);
    await bundleHTML(pathDirOutput, path.join(__dirname, 'components'), path.join(__dirname,'template.html'));
  } catch (err) {
    throw err;
  }
})();

