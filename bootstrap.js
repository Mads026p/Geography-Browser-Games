window.GEOSPHERE_BOOT_WARNINGS = [];

window.addGeoSphereBootWarning = function addGeoSphereBootWarning(path) {
  const message = `Required local asset failed to load: ${path}`;
  window.GEOSPHERE_BOOT_WARNINGS.push(message);
  window.dispatchEvent(new CustomEvent("geosphere:startup-warning", { detail: message }));
};

for (const path of window.GeoSphereAssets.runtimeScripts()) {
  const safePath = JSON.stringify(path);
  document.write(
    `<script src=${safePath} onerror="window.addGeoSphereBootWarning(${safePath})"><\/script>`,
  );
}

if (location.protocol === "http:" || location.protocol === "https:") {
  const planeRenderer = JSON.stringify(window.GeoSphereAssets.scripts.planeRenderer);
  document.write(`<script type="module" src=${planeRenderer}><\/script>`);
}
