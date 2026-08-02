'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const sourceEntries = [
  'jquery.colorpicker.js',
  'i18n',
  'parsers',
  'parts',
  'swatches'
];
const jsonFiles = [
  'package.json',
  'bower.json',
  '.eslintrc.json'
];

function collectJavaScript(entry, files) {
  const absolute = path.join(root, entry);
  const stat = fs.statSync(absolute);

  if (stat.isDirectory()) {
    fs.readdirSync(absolute).sort().forEach((name) => {
      collectJavaScript(path.join(entry, name), files);
    });
    return;
  }

  if (entry.endsWith('.js')) {
    files.push(entry);
  }
}

function validateJson(file) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  JSON.parse(content);
  process.stdout.write(`valid JSON: ${file}\n`);
}

function validateJavaScript(file) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], {
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    throw new Error(`JavaScript syntax check failed: ${file}`);
  }

  process.stdout.write(`valid JavaScript: ${file}\n`);
}

try {
  jsonFiles.forEach(validateJson);

  const JavaScriptFiles = [];
  sourceEntries.forEach((entry) => collectJavaScript(entry, JavaScriptFiles));
  JavaScriptFiles.forEach(validateJavaScript);

  if (JavaScriptFiles.length === 0) {
    throw new Error('No JavaScript source files were found');
  }

  process.stdout.write(`validated ${JavaScriptFiles.length} JavaScript files\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
