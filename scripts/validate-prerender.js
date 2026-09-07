import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { INDEXABLE_ROUTES, NOINDEX_ROUTES } from "../route-manifest.js"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const baseUrl = "https://gomytruck.com"
const errors = []

const count = (source, pattern) => (source.match(pattern) || []).length
const attribute = (html, selectorPattern, name) => {
  const tag = html.match(selectorPattern)?.[0] || ""
  return tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1]
}

for (const route of [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES]) {
  const relative = route === "/" ? "index.html" : path.join(route.slice(1), "index.html")
  const file = path.join(root, "dist", relative)

  if (!fs.existsSync(file)) {
    errors.push(`${route}: missing ${relative}`)
    continue
  }

  const html = fs.readFileSync(file, "utf8")
  const expectedCanonical = route === "/" ? `${baseUrl}/` : `${baseUrl}${route}`
  const canonical = attribute(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/i, "href")
  const description = attribute(html, /<meta\b[^>]*name=["']description["'][^>]*>/i, "content")
  const robots = attribute(html, /<meta\b[^>]*name=["']robots["'][^>]*>/i, "content") || ""
  const h1Count = count(html, /<h1\b/gi)

  if (!/<title\b[^>]*>[^<]{8,}<\/title>/i.test(html)) errors.push(`${route}: missing or short title`)
  if (!description || description.length < 50) errors.push(`${route}: missing or short description`)
  if (canonical !== expectedCanonical) errors.push(`${route}: canonical is ${canonical || "missing"}`)
  if (h1Count !== 1) errors.push(`${route}: expected one H1, found ${h1Count}`)
  if (/Page Not Found/i.test(html)) errors.push(`${route}: rendered the 404 component`)

  if (NOINDEX_ROUTES.includes(route)) {
    if (!/noindex/i.test(robots)) errors.push(`${route}: expected noindex robots directive`)
  } else if (/noindex/i.test(robots)) {
    errors.push(`${route}: unexpectedly marked noindex`)
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1])
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD (${error.message})`)
    }
  }
}

const notFound = path.join(root, "dist", "404.html")
if (!fs.existsSync(notFound) || !/Page Not Found/i.test(fs.readFileSync(notFound, "utf8"))) {
  errors.push("404.html: missing or invalid")
}

const sitemaps = [
  "sitemap-core.xml",
  "sitemap-cities.xml",
  "sitemap-routes.xml",
  "sitemap-vehicles.xml",
  "sitemap-driver-loads.xml",
  "sitemap-cargo.xml",
  "sitemap-resources.xml",
]

let allSitemapContent = ""
for (const sm of sitemaps) {
  const filePath = path.join(root, "dist", sm)
  if (fs.existsSync(filePath)) {
    allSitemapContent += fs.readFileSync(filePath, "utf8")
  }
}

for (const route of INDEXABLE_ROUTES) {
  const url = route === "/" ? `${baseUrl}/` : `${baseUrl}${route}`
  if (!allSitemapContent.includes(`<loc>${url}</loc>`)) errors.push(`${route}: missing from sitemaps`)
}
for (const route of NOINDEX_ROUTES) {
  if (allSitemapContent.includes(`${baseUrl}${route}`)) errors.push(`${route}: noindex URL found in sitemaps`)
}

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} issue(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`SEO validation passed for ${INDEXABLE_ROUTES.length} indexable routes, ${NOINDEX_ROUTES.length} noindex route, and 404.html`)
