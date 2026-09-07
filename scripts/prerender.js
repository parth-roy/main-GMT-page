import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { PRERENDER_ROUTES } from "../route-manifest.js"
import { render } from "../dist-ssr/entry-server.js"

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST = path.join(ROOT, "dist")
const template = await fs.readFile(path.join(DIST, "index.html"), "utf8")

const templateHeadParts = template.split(/<!--app-head-start-->|<!--app-head-end-->/)
const templateBodyParts = (templateHeadParts[2] || "").split('<div id="root"></div>')

const getHeadMarkup = (helmet) => [
  helmet?.title?.toString(),
  helmet?.priority?.toString(),
  helmet?.meta?.toString(),
  helmet?.link?.toString(),
  helmet?.script?.toString(),
].filter(Boolean).join("\n    ")

const createdDirs = new Set([DIST])

async function ensureDir(dir) {
  if (createdDirs.has(dir)) return
  await fs.mkdir(dir, { recursive: true })
  createdDirs.add(dir)
}

async function writeRoute(route, outputFile) {
  const { html, helmet } = await render(route)
  const headMarkup = getHeadMarkup(helmet)
  const document = `${templateHeadParts[0]}<!--app-head-start-->\n    ${headMarkup}\n    <!--app-head-end-->${templateBodyParts[0]}<div id="root">${html}</div>${templateBodyParts[1]}`

  const destination = outputFile || (route === "/"
    ? path.join(DIST, "index.html")
    : path.join(DIST, route.slice(1), "index.html"))
  await ensureDir(path.dirname(destination))
  await fs.writeFile(destination, document)
}

const BATCH_SIZE = 64
let completed = 0
let lastLogged = 0
for (let i = 0; i < PRERENDER_ROUTES.length; i += BATCH_SIZE) {
  const chunk = PRERENDER_ROUTES.slice(i, i + BATCH_SIZE)
  await Promise.all(chunk.map((route) => writeRoute(route)))
  completed += chunk.length
  if (completed - lastLogged >= 500 || completed === PRERENDER_ROUTES.length) {
    lastLogged = completed
    console.log(`Prerendered ${completed} / ${PRERENDER_ROUTES.length} routes...`)
  }
}

// We use a deep path to ensure it bypasses dynamic /:city routes and hits the catch-all
await writeRoute("/404/not/found/page", path.join(DIST, "404.html"))
console.log(`Prerendered ${PRERENDER_ROUTES.length} routes plus 404.html`)
