import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createStaticServer, resolveRequestPath } from "../tools/lib/static-server.mjs";

async function makeFixture() {
  const root = await mkdtemp(join(tmpdir(), "geosphere-server-"));
  await writeFile(join(root, "index.html"), "<h1>GeoSphere</h1>");
  await writeFile(join(root, "app.js"), "console.log('ok');");
  await writeFile(join(root, ".env"), "SECRET=hidden");
  await mkdir(join(root, ".git"));
  await writeFile(join(root, ".git", "config"), "private");
  return root;
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return server.address().port;
}

async function close(server) {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

test("resolveRequestPath keeps requests inside the configured root", async () => {
  const root = await makeFixture();
  assert.equal(resolveRequestPath(root, "/app.js"), join(root, "app.js"));
  assert.equal(resolveRequestPath(root, "/"), join(root, "index.html"));
  assert.equal(resolveRequestPath(root, "/../outside.txt"), null);
  assert.equal(resolveRequestPath(root, "/%2e%2e/outside.txt"), null);
  assert.equal(resolveRequestPath(root, "/.git/config"), null);
  assert.equal(resolveRequestPath(root, "/.env"), null);
  assert.equal(resolveRequestPath(root, "/bad%E0%A4%A"), null);
});

test("static server supports GET and HEAD with safety headers", async () => {
  const root = await makeFixture();
  const server = createStaticServer({ root });
  const port = await listen(server);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "<h1>GeoSphere</h1>");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");

    const head = await fetch(`http://127.0.0.1:${port}/app.js`, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    assert.equal(head.headers.get("content-type"), "text/javascript; charset=utf-8");
  } finally {
    await close(server);
  }
});

test("static server rejects unsupported methods and protected paths", async () => {
  const root = await makeFixture();
  const server = createStaticServer({ root });
  const port = await listen(server);
  try {
    const post = await fetch(`http://127.0.0.1:${port}/`, { method: "POST" });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get("allow"), "GET, HEAD");

    const hidden = await fetch(`http://127.0.0.1:${port}/.git/config`);
    assert.equal(hidden.status, 404);

    const missing = await fetch(`http://127.0.0.1:${port}/missing.js`);
    assert.equal(missing.status, 404);
  } finally {
    await close(server);
  }
});
