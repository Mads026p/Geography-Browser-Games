import { createStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const port = Number(process.argv[2] || 4173);
const host = process.argv[3] || "127.0.0.1";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("Port must be an integer between 1 and 65535.");
  process.exit(1);
}

createStaticServer({ root }).listen(port, host, () => {
  console.log(`GeoSphere is available at http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
});
