// fix-import-extensions.js
const fs = require('fs');
const path = require('path');

function fixExtensions(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixExtensions(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Regex to add .js extension to relative imports without extension
      content = content.replace(/(from\s+['"]\.\/[^'"]+)(['"])/g, (match, p1, p2) => {
        // If it already ends with .js, no change
        if (p1.endsWith('.js')) return match;
        return p1 + '.js' + p2;
      });
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

fixExtensions(path.resolve(__dirname, '../dist/esm'));
