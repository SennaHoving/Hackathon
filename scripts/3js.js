/* imports */ 
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Gebruik #three-root als die bestaat, anders fallback naar #module
const mount = document.getElementById("three-root") || document.getElementById("module");
if (!mount) throw new Error("Geen #three-root of #module gevonden.");

let cameraTargetPos = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(); 
const textPanel = document.getElementById("module-info"); 
let modelTargetPos = null;
let offset = 1; 

// Scene
const scene = new THREE.Scene();

// Licht
const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 2);
light2.position.set(-10, -10, -10);
scene.add(light2);

// Camera
const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 100);
camera.position.set(0, 0, 8);

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
// const modelContainer = new THREE.Group();
loader.load(
  "../assets/moduleC.glb",
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh && child.material) child.material.needsUpdate = true;
    });
    scene.add(model); 
    // scene.add(modelContainer);
  },
  undefined,
  (err) => console.error("GLB load error:", err)
);

function resizeRenderer() {
  const w = mount.clientWidth;
  const h = mount.clientHeight;
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

  // if (modelTargetPos) {
  //   modelContainer.position.lerp(modelTargetPos, 0.05);
  //   if (modelContainer.position.distanceTo(modelTargetPos) < 0.01) {
  //       modelContainer.position.copy(modelTargetPos);
  //       modelTargetPos = null;
  //   }
  // }

  renderer.render(scene, camera);
}

window.addEventListener("resize", resizeRenderer);

resizeRenderer();
animate();


// Interactive part module / satellite 
// Create hitbox function
const boxes = [];

function makeHitbox (name, number, size, pos) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, visible: true, opacity: 0.1, transparent: true });
    const cube = new THREE.Mesh(geometry, material);

    cube.name = name;
    cube.number = number; 
    cube.position.set(pos.x, pos.y, pos.z); 

    scene.add(cube);
    boxes.push(cube); 
}

// Hitbox Solar panel
makeHitbox("Solar Panel", "01", { x: 0.6, y: 1, z: 0.1 }, { x: 0.57, y: -0.08, z: 0.27 });
// Xray instrument
makeHitbox("X-ray instrument", "02", { x: 0.3, y: 0.2, z: 0.4 }, { x: 0, y: 0.5, z: -0.12 });
//Separation plane
makeHitbox("Separation plane", "03", { x: 0.5, y: 0.5, z: 0.1 }, { x: 0, y: 0, z: -0.4 });
//S-band antennas
makeHitbox("S-band antennas", "04", { x: 0.1, y: 0.1, z: 0.1 }, { x: 0, y: -0.23, z: 0.35 });
//Star tracker 
makeHitbox("Star tracker", "05", { x: 0.2, y: 0.2, z: 0.1 }, { x: 0, y: 0.5, z: 0.4 });

// 
let hovered = null;

function onMove() {
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(boxes);
    const hit = hits[0];

    if (hovered !== hit?.object) {

        // Remove previous highlight
        if (hovered) hovered.material.opacity = 0.1;

        // Apply new highlight
        hovered = hit?.object || null;
        if (hovered) hovered.material.opacity = 0.6;
    }
}

//Cursor
const canvas = renderer.domElement;
window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect(); // correct canvas dimensions

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    onMove();
});

// Onclick camare move
const cameraTargets = {
    "Solar Panel": new THREE.Vector3(5, 0, 5),
    "X-ray instrument": new THREE.Vector3(0, 5, 4), 
    "Separation plane": new THREE.Vector3(5, 0, -4),
    "S-band antennas": new THREE.Vector3(0, -2, 4),
    "Star tracker": new THREE.Vector3(0, 2, 3), 
};

// Move model group to side
function moveModelForPanel(offsetX = 0) {
  modelTargetPos = new THREE.Vector3(offsetX, modelContainer.position.y, modelContainer.position.z);

  // Compute new center
  const box = new THREE.Box3().setFromObject(modelContainer);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Update OrbitControls target
  controls.target.copy(center);
}

function onClick() {
    if (!hovered) return;

    const targetPos = cameraTargets[hovered.name];
    if(!targetPos) return; 

    textPanel.style.display = "flex"; 
    textPanel.querySelector("h4").innerText = hovered.name;
    textPanel.querySelector("h5").innerText = hovered.number;
  
    moveCameraTo(targetPos);

    // moveModelForPanel(1.5);
}

window.addEventListener("pointerdown", onClick); 

