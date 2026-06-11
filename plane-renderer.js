import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("#plane-overlay");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
camera.position.set(0, -32, 22);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x26313c, 2.2));
const sun = new THREE.DirectionalLight(0xffffff, 3.2);
sun.position.set(-8, -12, 18);
sun.castShadow = true;
scene.add(sun);

const aircraft = new THREE.Group();
aircraft.visible = false;
const headingPivot = new THREE.Group();
headingPivot.add(aircraft);
scene.add(headingPivot);
const cameraAxis = new THREE.Vector3();

let loaded = false;
let viewportSize = 116;

new GLTFLoader().load(
  window.GeoSphereAssets.plane.model,
  (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    model.scale.setScalar(9 / Math.max(size.x, size.y, size.z));
    model.rotation.z = Math.PI / 2;
    model.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    aircraft.add(model);
    aircraft.visible = true;
    loaded = true;
  },
  undefined,
  () => {
    loaded = false;
  },
);

function resize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  if (canvas.width !== Math.round(width * renderer.getPixelRatio()) || canvas.height !== Math.round(height * renderer.getPixelRatio())) {
    renderer.setSize(width, height, false);
  }
  return { width, height };
}

window.planeRenderer = {
  isLoaded: () => loaded,
  setVisible(visible) {
    canvas.classList.toggle("active", Boolean(visible && loaded));
    if (!visible) {
      renderer.setScissorTest(false);
      renderer.clear();
    }
  },
  update({ x, y, heading = 0, bank = 0, boost = false, paused = false, zoom = 1, viewAngle = 45 }) {
    if (!loaded) return false;
    const { width, height } = resize();
    viewportSize = 108 * zoom;
    const left = Math.round(x - viewportSize / 2);
    const bottom = Math.round(height - y - viewportSize / 2);
    renderer.setViewport(left, bottom, viewportSize, viewportSize);
    renderer.setScissor(left, bottom, viewportSize, viewportSize);
    renderer.setScissorTest(true);
    aircraft.rotation.y = -bank;
    aircraft.rotation.z = 0;
    aircraft.position.z = 0;
    const angle = THREE.MathUtils.degToRad(viewAngle);
    const orbitRadius = 30;
    camera.position.set(0, -Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius);
    camera.up.set(0, Math.sin(angle), Math.cos(angle));
    camera.lookAt(0, 0, 0);
    camera.getWorldDirection(cameraAxis);
    headingPivot.setRotationFromAxisAngle(cameraAxis, -heading);
    sun.intensity = boost ? 4.4 : 3.2;
    canvas.classList.add("active");
    renderer.render(scene, camera);
    return true;
  },
};
