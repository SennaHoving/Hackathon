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
loader.load("../assets/moduleC.glb", (gltf) => {
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

  renderer.render(scene, camera);
}

window.addEventListener("resize", resizeRenderer);

resizeRenderer();
animate();


// Interactive part module / satellite 
// Create hitbox function
const boxes = [];

function makeHitbox (name, number, description, size, pos) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, visible: true, opacity: 0.1, transparent: true });
    const cube = new THREE.Mesh(geometry, material);

    cube.name = name;
    cube.number = number; 
    cube.description = description;
    cube.position.set(pos.x, pos.y, pos.z); 

    scene.add(cube);
    boxes.push(cube); 
}

// Hitbox Solar panel
makeHitbox("Solar Panel", "01", "De Solar Panel van de NEBULA-Xplorer is in stowed configuratie verbonden met de rigide spacecraft-body via twee roterende scharnieren, waardoor er mogelijke dynamische effecten zoals resonantie in de panelen kunnen optreden bij beweging van het S/C. Deze effecten zijn voorlopig niet meegenomen in het AOCS-ontwerp, maar de zonnepanelen beïnvloeden gedeeltelijk het Center of Pressure en worden meegenomen in de torqueberekeningen van het systeem.", { x: 0.6, y: 1, z: 0.1 }, { x: 0.57, y: -0.08, z: 0.27 });
// Xray instrument
makeHitbox("X-ray instrument", "02", "Het X-ray instrument is geplaatst langs de centrale line-of-sight van de body Z-as en wordt beschermd tegen ultraviolet, zichtbaar en infrarood licht door concentrator sunshades bestaande uit 0,5 mm dikke CFRP-panelen op een Ti-6Al-4V baseplate. Het instrument is structureel bevestigd aan de CFRP sandwichpanelen via inserts volgens ECSS-richtlijnen, wat een nauwkeurige pointing mogelijk maakt met een Absolute Performance Error van maximaal 240 arcsec en een Performance Drift Error van maximaal 60 arcsec.", { x: 0.3, y: 0.2, z: 0.4 }, { x: 0, y: 0.5, z: -0.12 });
//Separation plane
makeHitbox("Separation plane", "03", "De Separation Plane of LV adapter maakt gebruik van een MkII 15-inch MLB adapter die stijf en lichtgewicht is en ongeveer 6,6 keer stijver dan de 8-inch variant. Deze adapter is vervaardigd uit massief aluminium 6061-T6 met SurTec 650 coating en heeft geen achterliggend skelet, waardoor lancering loads efficiënt worden verdeeld via web-ribs. Het SoftRide-isolatiesysteem dempt vibratie en shocks met een variërende dempingsratio van 3 tot 25 procent, afhankelijk van de grootte en massa van de S/C.", { x: 0.5, y: 0.5, z: 0.1 }, { x: 0, y: 0, z: -0.4 });
//S-band antennas
makeHitbox("S-band antennas", "04", "De S-band antennas worden bevestigd op secundaire CFRP-panelen via bolted inserts, waarbij titanium of A2-70 stainless steel wordt gebruikt om hoge betrouwbaarheid en thermische en elektrische geleiding te waarborgen. Deze interfaces voldoen aan ECSS-vereisten en zorgen voor een robuuste verbinding die demontage voor onderhoud of testen mogelijk maakt.", { x: 0.1, y: 0.1, z: 0.1 }, { x: 0, y: -0.23, z: 0.35 });
//Star tracker 
makeHitbox("Star tracker", "05", "De Star Tracker bestaat uit twee ST-16RT2 sensoren die gemonteerd zijn op een hub van gefreesd aluminium 6061-T6 met SurTec 650 coating. Eén tracker is in lijn met de instrument LoS geplaatst, terwijl de andere 30 graden is gekanteld. De hub wordt bevestigd op de CFRP-eindplaat met vier M5-bouten en de baffles kunnen na installatie van de coversheet worden gemonteerd, waardoor de trackers attitudebepaling mogelijk maken met een nauwkeurigheid van circa 30 tot 50 arcsec, inclusief compensatie voor thermische misalignments.", { x: 0.2, y: 0.2, z: 0.1 }, { x: 0, y: 0.5, z: 0.4 });

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

// Onclick camera move
const cameraTargets = {
    "Solar Panel": new THREE.Vector3(5, 0, 5),
    "X-ray instrument": new THREE.Vector3(0, 5, 5), 
    "Separation plane": new THREE.Vector3(5, 0, -5),
    "S-band antennas": new THREE.Vector3(0, -2, 5),
    "Star tracker": new THREE.Vector3(0, 2, 5), 
};

function onClick() {
    if (!hovered) return;

    const targetPos = cameraTargets[hovered.name];
    if(!targetPos) return; 

    const moduleSection = document.getElementById("module"); 
    const textPanel = document.getElementById("module-info"); 

    moduleSection.classList.add("info");
    resizeRenderer();
    
    textPanel.style.display = "flex"; 
    textPanel.querySelector("h4").innerText = hovered.name;
    textPanel.querySelector("h5").innerText = hovered.number;
    textPanel.querySelector("p").innerText = hovered.description;
  
    moveCameraTo(targetPos);
}

window.addEventListener("pointerdown", onClick); 

