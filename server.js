// server.js
const express = require('express');
const next = require('next');
const path = require('path');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // ✅ 静的ファイルの配信設定
  server.use('/_next/static', express.static(path.join(__dirname, '_next/static')));
  server.use('/public', express.static(path.join(__dirname, 'public')));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
