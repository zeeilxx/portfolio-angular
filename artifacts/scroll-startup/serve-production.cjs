const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../../dist/portfolio-angular/browser');
const app = express();
app.use(express.static(root, { maxAge: 0, setHeaders: (response) => response.setHeader('Cache-Control', 'no-store') }));
app.use((request, response) => {
  if (path.extname(request.path)) return response.sendStatus(404);
  const candidate = path.resolve(root, '.' + request.path, 'index.html');
  const index = candidate.startsWith(root + path.sep) && fs.existsSync(candidate) ? candidate : path.join(root, 'index.html');
  response.setHeader('Cache-Control', 'no-store');
  response.sendFile(index);
});
app.listen(4302, '127.0.0.1', () => console.log('Production prerender preview: http://127.0.0.1:4302'));
