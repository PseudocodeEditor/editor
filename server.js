const http = require('http');
const fileSystem = require('fs');
const path = require('path');

http.createServer(function(request, response) {
  const filePath = path.join(__dirname, 'dist/editor.bundle.js');
  const stat = fileSystem.statSync(filePath);

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader('Access-Control-Max-Age', 2592000);

  response.writeHead(200, {
    'Content-Type': 'text/javascript',
    'Content-Length': stat.size
  });

  const readStream = fileSystem.createReadStream(filePath);

  readStream.pipe(response);
})
.listen(2000);
