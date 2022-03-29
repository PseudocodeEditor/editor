const http = require('http'),
      fileSystem = require('fs'),
      path = require('path');

http.createServer(function(request, response) {
    const filePath = path.join(__dirname, 'editor.bundle.js');
    const stat = fileSystem.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size
    });

    const readStream = fileSystem.createReadStream(filePath);
  
    readStream.pipe(response);
})
.listen(2000);