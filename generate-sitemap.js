import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INDEXABLE_ROUTES } from './route-manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://gomytruck.com';

function getCategory(route) {
  if (route.startsWith('/routes/') || route.startsWith('/intercity/') || route.startsWith('/local-transport/')) {
    return 'routes';
  }
  if (route.startsWith('/blog') || route.startsWith('/resources/') || route.startsWith('/industries/')) {
    return 'resources';
  }
  
  const coreRoutes = [
    '/', '/about', '/support', '/driver-partner', '/workforce', '/contact', 
    '/enterprise', '/fleet-partner-registration', '/gomytruck-verified', '/freight-rate-index',
    '/driver-onboarding', '/direct-driver-contact'
  ];
  if (coreRoutes.includes(route) || route.startsWith('/legal/') || route.startsWith('/services/')) {
    return 'core';
  }

  const vehicleKeywords = ['truck', 'bike', 'packers-and-movers', 'goods-transport', 'tata-ace', 'labour', 'container', 'bolero', 'eicher'];
  if (vehicleKeywords.some(kw => route.includes(kw))) {
    return 'vehicles';
  }

  return 'cities';
}

function generateSitemaps() {
  const publicDir = path.join(__dirname, 'public');
  
  const categories = {
    core: [],
    cities: [],
    routes: [],
    vehicles: [],
    resources: []
  };

  INDEXABLE_ROUTES.forEach(route => {
    const category = getCategory(route);
    categories[category].push(route);
  });

  const sitemapFiles = [];

  // W3C date format (YYYY-MM-DD) — required by Google/Bing for valid <lastmod>
  const today = new Date().toISOString().split('T')[0];

  for (const [category, routes] of Object.entries(categories)) {
    if (routes.length === 0) continue;

    const filename = `sitemap-${category}.xml`;
    const sitemapPath = path.join(publicDir, filename);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    routes.forEach(route => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${route}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    
    fs.writeFileSync(sitemapPath, xml);
    console.log(`✅ ${filename} successfully generated at ${sitemapPath}`);
    sitemapFiles.push(filename);
  }

  // Generate sitemap index
  const indexPath = path.join(publicDir, 'sitemap.xml');
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  sitemapFiles.forEach(file => {
    indexXml += `  <sitemap>\n`;
    indexXml += `    <loc>${BASE_URL}/${file}</loc>\n`;
    indexXml += `    <lastmod>${today}</lastmod>\n`;
    indexXml += `  </sitemap>\n`;
  });
  
  indexXml += `</sitemapindex>`;
  
  fs.writeFileSync(indexPath, indexXml);
  console.log(`✅ sitemap.xml (index) successfully generated at ${indexPath}`);
}

generateSitemaps();
