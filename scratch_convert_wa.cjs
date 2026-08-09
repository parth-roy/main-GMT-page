const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'whatsapp-fab.png');
const destPath = path.join(__dirname, 'public', 'whatsapp-fab.webp');

(async () => {
  await sharp(filePath).webp({ quality: 80 }).toFile(destPath);
  fs.unlinkSync(filePath); 
  console.log('Converted whatsapp-fab');
})();
