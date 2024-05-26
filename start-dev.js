// start-dev.js
const { exec } = require('child_process');

const dev = exec('npm run dev');

dev.stdout.on('data', (data) => {
  console.log(data);
});

dev.stderr.on('data', (data) => {
  console.error(data);
});

dev.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

dev.on('error', (err) => {
  console.error('Failed to start child process:', err);
});
