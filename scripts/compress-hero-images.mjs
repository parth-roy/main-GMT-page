// Compress hero service images from Downloads without quality loss
// Uses sharp (already a project dep)
import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')

const inputs = [
  { src: '/Users/parther/Downloads/1st.png', dest: `${publicDir}/hero-service-truck.webp`, label: 'Truck (1st.png)' },
  { src: '/Users/parther/Downloads/2nd.png', dest: `${publicDir}/hero-service-bike.webp`, label: 'Two Wheeler (2nd.png)' },
  { src: '/Users/parther/Downloads/3rd-2.png', dest: `${publicDir}/hero-service-movers.webp`, label: 'Packers & Movers (3rd-2.png)' },
]

for (const { src, dest, label } of inputs) {
  if (!existsSync(src)) {
    console.error(`❌ Not found: ${src}`)
    continue
  }
  const meta = await sharp(src).metadata()
  console.log(`📷 ${label}: ${meta.width}x${meta.height} ${meta.format}`)
  
  // Resize to max 600px wide (retina 300px display), convert to webp quality 88
  await sharp(src)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 88, effort: 5 })
    .toFile(dest)
  
  const { size: inSize } = await import('fs').then(fs => fs.promises.stat(src))
  const { size: outSize } = await import('fs').then(fs => fs.promises.stat(dest))
  console.log(`  ✅ ${dest.split('/').pop()} — ${(inSize/1024).toFixed(0)}KB → ${(outSize/1024).toFixed(0)}KB`)
}
console.log('\n✅ All images compressed!')
