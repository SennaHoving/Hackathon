/* imports */ 
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const moduleContainer = document.getElementById("module"); 

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

  renderer.render(scene, camera);
}

animate();
