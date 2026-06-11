import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

const mimeTypes = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
});

const baseHeaders = Object.freeze({
  "Cross-Origin-Resource-Policy": "same-origin",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
});

function hasProtectedSegment(pathname) {
  return pathname
    .split(/[\\/]+/)
    .filter(Boolean)
    .some((segment) => segment.startsWith("."));
}

export function resolveRequestPath(root, requestPathname) {
  let pathname;
  try {
    pathname = decodeURIComponent(requestPathname);
  } catch {
    return null;
  }

  if (pathname.includes("\0") || hasProtectedSegment(pathname)) return null;
  const normalizedRoot = resolve(root);
  const relativePath = pathname.replace(/^[/\\]+/, "") || "index.html";
  const candidate = resolve(normalizedRoot, relativePath);
  const fromRoot = relative(normalizedRoot, candidate);
  if (!fromRoot || (!fromRoot.startsWith(`..${sep}`) && fromRoot !== ".." && !isAbsolute(fromRoot))) return candidate;
  return null;
}

function send(response, status, body = "", headers = {}) {
  response.writeHead(status, { ...baseHeaders, ...headers });
  response.end(body);
}

export function createStaticServer({ root = process.cwd() } = {}) {
  const normalizedRoot = resolve(root);
  return createServer((request, response) => {
    if (!["GET", "HEAD"].includes(request.method || "")) {
      send(response, 405, "Method not allowed", { Allow: "GET, HEAD" });
      return;
    }

    let pathname;
    try {
      pathname = new URL(request.url || "/", "http://localhost").pathname;
    } catch {
      send(response, 400, "Bad request");
      return;
    }

    const path = resolveRequestPath(normalizedRoot, pathname);
    if (!path) {
      send(response, 404, "Not found");
      return;
    }

    const extension = extname(path).toLowerCase();
    const contentType = mimeTypes[extension];
    if (!contentType) {
      send(response, 404, "Not found");
      return;
    }

    try {
      if (!statSync(path).isFile()) throw new Error("Not a file");
    } catch {
      send(response, 404, "Not found");
      return;
    }

    response.writeHead(200, {
      ...baseHeaders,
      "Cache-Control": "no-cache",
      "Content-Type": contentType,
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const stream = createReadStream(path);
    stream.on("error", () => {
      if (!response.headersSent) send(response, 500, "Unable to read file");
      else response.destroy();
    });
    stream.pipe(response);
  });
}
