const fs = require('fs');
const path = require('path');
const { stdout } = process;

const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, {withFileTypes: true}, (err, dir) => {
    if (err) {
      throw err;
    }

    for (let i = 0; i < dir.length; i++) {
      const pathFile = path.join(pathFolder, dir[i].name);
      
      fs.stat(pathFile, (err, stats) => {
        if (err) {
          throw err;
        }

        if (stats.isDirectory()) {
          return;
        }

        const {name, ext} = path.parse(pathFile);

        stdout.write(`${name} - ${ext} - ${stats.size}b\n`);
      })
    }
  }
);
