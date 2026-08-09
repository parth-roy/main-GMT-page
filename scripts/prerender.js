import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { PRERENDER_ROUTES } from "../route-manifest.js"
import { render } from "../dist-ssr/entry-server.js"

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST = path.join(ROOT, "dist")
const template = await fs.readFile(path.join(DIST, "index.html"), "utf8")

const getHeadMarkup = (helmet) => [
  helmet?.title?.toString(),
  helmet?.priority?.toString(),
  helmet?.meta?.toString(),
  helmet?.link?.toString(),
  helmet?.script?.toString(),
].filter(Boolean).join("\n    ")

async function writeRoute(route, outputFile) {
  const { html, helmet } = await render(route)
  const document = template
    .replace(
      /<!--app-head-start-->[\s\S]*?<!--app-head-end-->/,
      `<!--app-head-start-->\n    ${getHeadMarkup(helmet)}\n    <!--app-head-end-->`,
    )
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  const destination = outputFile || (route === "/"
    ? path.join(DIST, "index.html")
    : path.join(DIST, route.slice(1), "index.html"))
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, document)
}

for (const route of PRERENDER_ROUTES) {
  await writeRoute(route)
}

// We use a deep path to ensure it bypasses dynamic /:city routes and hits the catch-all
await writeRoute("/404/not/found/page", path.join(DIST, "404.html"))
console.log(`Prerendered ${PRERENDER_ROUTES.length} routes plus 404.html`)
