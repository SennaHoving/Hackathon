/* imports */ 
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

// 3D Shape 
const loader = new GLTFLoader(); 
loader.load( "../ass/cube.glb", function (gltf) {
    const cube = gltf.scene

    cube.traverse((child) => {
        child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
    });
    
    console.log( cube )
    scene.add( cube ); 
});

// Render
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

moduleContainer.append(renderer.domElement); 
// renderer.render(scene, camera); 

const controls = new OrbitControls(camera, renderer.domElement); 
controls.enableDamping = true; 
controls.enableZoom = false; 

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (cameraTargetPos) {
        // move camera position
        camera.position.lerp(cameraTargetPos, 0.05);

        // If close enough, stop moving
        if (camera.position.distanceTo(cameraTargetPos) < 0.01) {
            camera.position.copy(cameraTargetPos);
            cameraTargetPos = null;
        }
    }

  renderer.render(scene, camera);
}

animate();

function moveCameraTo(newPosition) {
    cameraTargetPos = newPosition.clone(); 
}

// Click 
document.querySelector("button").addEventListener("click", () => {
    const targetPos = new THREE.Vector3(0, 0, 10);
    moveCameraTo(targetPos);
})

document.getElementById("comp1").addEventListener("click", () => {
    const targetPos = new THREE.Vector3(5, 5, 5);
    moveCameraTo(targetPos);
})

// Responsive resize
window.addEventListener("resize", () => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
