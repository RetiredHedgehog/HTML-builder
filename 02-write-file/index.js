const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdout } = process;

const rl = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout
  }
);

const filePath = path.join(__dirname, 'output.txt');

stdout.write('Введите текст:\n');

rl.on('line', line => {
  if (line == 'exit') {
    rl.close();
    return;
  }

  fs.appendFile(filePath, `${line}\n`,(err) => {
      if (err) {
        throw err;
      }

      stdout.write('Введите текст:\n');
    }
  );
});

rl.on('close', () => stdout.write('Всего доброго!!!'));