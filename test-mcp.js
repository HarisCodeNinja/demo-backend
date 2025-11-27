const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'test-mcp.log');
fs.writeFileSync(logFile, 'Test started at ' + new Date().toISOString() + '\n');

console.error('Test: stderr works');

process.stdin.on('data', (data) => {
  fs.appendFileSync(logFile, 'Received: ' + data.toString() + '\n');
});

setTimeout(() => {
  fs.appendFileSync(logFile, 'Still running after 5 seconds\n');
}, 5000);