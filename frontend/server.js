const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist/frontend/browser');

// Servir archivos estáticos
app.use(express.static(DIST_DIR));

// Soporte para SPA (Angular Routing): redireccionar todo a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server is running on port ${PORT}`);
  console.log(`📁 Serving static files from ${DIST_DIR}`);
});
