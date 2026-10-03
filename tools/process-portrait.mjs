#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const inputPath = path.join(root, 'public/images/param.png');
const outputPath = path.join(root, 'public/images/param-cutout.webp');

if (!existsSync(inputPath)) {
  console.error('Warning: public/images/param.png not found. Please place your photo there.');
  process.exit(0);
}

const cmd = `python3 -c "
from rembg import remove
from PIL import Image
import sys

input_path = '${inputPath.replace(/'/g, "\\'")}'
output_path = '${outputPath.replace(/'/g, "\\'")}'

with open(input_path, 'rb') as f:
    input_data = f.read()

output_data = remove(input_data)

# Load and trim transparent edges
img = Image.open(output_data).convert('RGBA')
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Resize to ~2x width ~1600px
w, h = img.size
target_w = 1600
if w > target_w:
    ratio = target_w / w
    new_size = (int(w * ratio), int(h * ratio))
    img = img.resize(new_size, Image.Resampling.LANCZOS)

img.save(output_path, 'webp', quality=90)
print('done')
"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Portrait processed successfully');
} catch (err) {
  console.error('Failed to process portrait:', err);
  process.exit(1);
}
