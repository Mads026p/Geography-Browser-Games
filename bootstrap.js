const assets = window.GeoSphereAssets;
window.GEOSPHERE_BOOT_WARNINGS = [];

function addBootWarning(message) {
  window.GEOSPHERE_BOOT_WARNINGS.push(message);
  window.dispatchEvent(new CustomEvent("geosphere:startup-warning", { detail: message }));
}

function loadClassicScript(path) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = path;
    script.onload = resolve;
    script.onerror = () => {
      addBootWarning(`Required local asset failed to load: ${path}`);
      resolve();
    };
    document.body.append(script);
  });
}

for (const path of assets.runtimeScripts()) {
  await loadClassicScript(path);
}

try {
  await import(`./${assets.scripts.planeRenderer}`);
} catch (error) {
  addBootWarning(`The 3D plane renderer could not start: ${error?.message || error}`);
}
