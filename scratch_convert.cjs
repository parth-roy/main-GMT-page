const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'cities');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

(async () => {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const destPath = path.join(dir, file.replace('.jpg', '.webp'));
    console.log('Converting', file);
    await sharp(filePath).webp({ quality: 80 }).toFile(destPath);
    fs.unlinkSync(filePath); // delete original jpg
  }
  console.log('Done converting images');
})();
