const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello');
});

server.listen(3002, () => {
  console.log('Test server listening on port 3002');
  console.log('Server should stay running...');
});

console.log('Script execution complete, waiting for server...');
