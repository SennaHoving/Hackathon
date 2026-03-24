/* imports */ 
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Gebruik #three-root als die bestaat, anders fallback naar #module
const mount = document.getElementById("three-root") || document.getElementById("module");
if (!mount) throw new Error("Geen #three-root of #module gevonden.");

let cameraTargetPos = null;

// Scene
const scene = new THREE.Scene();

// Licht
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 2);
light2.position.set(-10, -10, -10);
scene.add(light2);

// Camera
const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 100);
camera.position.set(0, 0, 11);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
mount.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

// Model
const loader = new GLTFLoader();
loader.load(
  "../assets/module.glb",
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh && child.material) child.material.needsUpdate = true;
    });
    scene.add(model);
  },
  undefined,
  (err) => console.error("GLB load error:", err)
);

function resizeRenderer() {
  const w = mount.clientWidth || window.innerWidth;
  const h = mount.clientHeight || 420; // fallback hoogte
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function moveCameraTo(newPosition) {
  cameraTargetPos = newPosition.clone();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (cameraTargetPos) {
    camera.position.lerp(cameraTargetPos, 0.05);
    if (camera.position.distanceTo(cameraTargetPos) < 0.01) {
      camera.position.copy(cameraTargetPos);
      cameraTargetPos = null;
    }
  }

  renderer.render(scene, camera);
}

// Buttons binnen #module
const moduleSection = document.getElementById("module");
const firstBtn = moduleSection?.querySelector("button");
const comp1Btn = document.getElementById("comp1");

firstBtn?.addEventListener("click", () => moveCameraTo(new THREE.Vector3(0, 0, 11)));
comp1Btn?.addEventListener("click", () => moveCameraTo(new THREE.Vector3(5, 5, 5)));

window.addEventListener("resize", resizeRenderer);

resizeRenderer();
animate();
