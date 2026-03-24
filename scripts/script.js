/* imports */ 
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const moduleContainer = document.getElementById("module"); 

let cameraTargetPos = null;
let cameraTarget = null;

const width = window.innerWidth;
const height = window.innerHeight;

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color('#009398')

// Camera 
const fov = 25; 
const aspect = width / height;
const near = 0.1; 
const far = 100; 

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); 
camera.position.set(0, 0, 10); 

const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true, 
})
const geometry = new THREE.IcosahedronGeometry(1.0, 2); 
// const geometry = new THREE.BoxGeometry(2, 2, 2); 
const cube = new THREE.Mesh(geometry, material); 
scene.add(cube); 

// Render
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

moduleContainer.append(renderer.domElement); 
renderer.render(scene, camera); 

const controls = new OrbitControls(camera, renderer.domElement); 
controls.enableDamping = true; 
controls.enableZoom = false; 

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (cameraTargetPos && cameraTarget) {
        // move camera position
        camera.position.lerp(cameraTargetPos, 0.05);
        // move controls target
        controls.target.lerp(cameraTarget, 0.05);

        // If close enough, stop moving
        if (camera.position.distanceTo(cameraTargetPos) < 0.01) {
            camera.position.copy(cameraTargetPos);
            controls.target.copy(cameraTarget);
            cameraTargetPos = null;
            cameraTarget = null;
        }
    }

  renderer.render(scene, camera);
}

animate();

function moveCameraTo(newPosition, newLook) {
    cameraTargetPos = newPosition.clone(); 
    cameraTarget = newLook.clone(); 
}

// Click 
document.querySelector("button").addEventListener("click", () => {
    const targetPos = new THREE.Vector3(0, 0, 10);
    const lookAt = new THREE.Vector3(0, 0, 0);
    moveCameraTo(targetPos, lookAt);
})

document.getElementById("comp1").addEventListener("click", () => {
    const targetPos = new THREE.Vector3(5, 5, 5);
    const lookAt = new THREE.Vector3(1, 0, 0);
    moveCameraTo(targetPos, lookAt);
})

// Responsive resize
window.addEventListener("resize", () => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
