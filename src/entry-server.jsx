import React from "react"
import { PassThrough } from "node:stream"
import { renderToPipeableStream } from "react-dom/server"
import { StaticRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import { CityProvider } from "./context/CityContext.jsx"

export function render(url) {
  return new Promise((resolve, reject) => {
    const helmetContext = {}
    let renderError

    let timeout
    const clearRenderTimeout = () => timeout && clearTimeout(timeout)
    const stream = renderToPipeableStream(
      <React.StrictMode>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <AuthProvider>
              <CityProvider>
                <App />
              </CityProvider>
            </AuthProvider>
          </StaticRouter>
        </HelmetProvider>
      </React.StrictMode>,
      {
        onAllReady() {
          const output = new PassThrough()
          let html = ""
          output.setEncoding("utf8")
          output.on("data", (chunk) => { html += chunk })
          output.on("error", reject)
          output.on("end", () => {
            clearRenderTimeout()
            if (renderError) return reject(renderError)
            resolve({ html, helmet: helmetContext.helmet })
          })
          stream.pipe(output)
        },
        onShellError(error) {
          clearRenderTimeout()
          reject(error)
        },
        onError(error) {
          renderError = error
        },
      },
    )

    timeout = setTimeout(() => stream.abort(), 20_000)
  })
}
