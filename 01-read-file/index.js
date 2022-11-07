const fs = require('fs');
const path = require('path');
const { stdout } = process;

const streamRead = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
);

streamRead.on('data', chunk => stdout.write(chunk));