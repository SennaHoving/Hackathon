import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const mount = document.getElementById("blackhole-root");
// Verwijder oude canvassen (voorkomt meerdere renders bij hot reload)
if (mount) {
  Array.from(mount.querySelectorAll("canvas")).forEach((c) => c.remove());
}

if (mount) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(1.1, 0.55, 3.8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  mount.appendChild(renderer.domElement);

  // OrbitControls toevoegen
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(3, 2, 4);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x88aaff, 1.4);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  const loader = new GLTFLoader();
  loader.setPath("assets/");
  loader.setResourcePath("assets/");
  let model = null;

  loader.load(
    "Blackhole (1).glb",
    (gltf) => {
      model = gltf.scene;

      // Zoek de ring (accretieschijf) op naam of grootste mesh
      let ring = null;
      let maxArea = 0;
      model.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        // Probeer een mesh met 'ring' of 'disk' in de naam te vinden
        if (!ring && child.name && /ring|disk|accretion/i.test(child.name)) {
          ring = child;
        }
        // Fallback: grootste mesh als ring
        const area = child.geometry.boundingBox
          ? child.geometry.boundingBox.getSize(new THREE.Vector3()).length()
          : 0;
        if (area > maxArea) {
          maxArea = area;
          ring = child;
        }

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        for (const mat of materials) {
          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
          if (mat.emissiveMap)
            mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
          mat.needsUpdate = true;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2 / maxDim;
      model.scale.setScalar(scale);
      model.rotation.x = 0.1;

      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      scene.add(model);
      model.userData.ring = ring;
    },
    undefined,
    (error) => {
      console.error("Kon assets/Blackhole (1).glb niet laden:", error);
    },
  );

  function resize() {
    const w = mount.clientWidth || 600;
    const h = mount.clientHeight || w;
    renderer.setSize(w, h, true);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animate() {
    controls.update();
    if (model && model.userData.ring) {
      model.userData.ring.rotation.z += 0.004;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();
}
 