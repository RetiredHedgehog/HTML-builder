const fs = require('fs');
const path = require('path');
const { stdout } = process;

const pathInput = path.join(__dirname, 'styles');
const pathOutput = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(pathOutput, '', (err) => {
  if (err) {
    throw err;
  }
})

fs.readdir(pathInput, (err, dir) => {
  if (err) {
    throw err;
  }
  
  dir.forEach((e) => {
    const pathFile = path.join(pathInput, e);
    const {ext} = path.parse(pathFile);

    if (ext !== '.css') {
      return;
    }

    const streamRead = fs.createReadStream(pathFile, 'utf-8');

    streamRead.on('data', chunk =>
      fs.appendFile(pathOutput, chunk, (err) => {
        if (err) {
          throw err;
        }
      })
    );
  })

  stdout.write(`\nДанные успешно записаны по пути ${pathOutput}\n`)
})