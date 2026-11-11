const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const shimFile = path.join(distDir, 'main.js');

if (fs.existsSync(distDir)) {
  // Try to detect the actual compiled main.js location.
  // NestJS compiles to dist/src/main.js when rootDir is "src".
  // Fall back to the legacy path for backwards compatibility.
  const candidates = [
    './src/main.js',
    './apps/api/src/main.js',
  ];
  const actual = candidates.find((c) =>
    fs.existsSync(path.join(distDir, c.replace('./', ''))),
  );
  const target = actual || './src/main.js';
  const content = `// Auto-generated entrypoint shim — do not edit\nrequire('${target}');\n`;
  fs.writeFileSync(shimFile, content, 'utf8');
  console.log(`[Postbuild] Created entrypoint shim at dist/main.js → ${target}`);
}
