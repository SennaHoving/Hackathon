import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const mount = document.getElementById("blackhole-root");

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

			model.traverse((child) => {
				if (!child.isMesh || !child.material) return;

				const materials = Array.isArray(child.material)
					? child.material
					: [child.material];

				for (const mat of materials) {
					if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
					if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
					mat.needsUpdate = true;
				}
			});

			const box = new THREE.Box3().setFromObject(model);
			const size = box.getSize(new THREE.Vector3());
			const maxDim = Math.max(size.x, size.y, size.z) || 1;
			const scale = 2 / maxDim;
			model.scale.setScalar(scale);
			model.rotation.x = .1;

			box.setFromObject(model);
			const center = box.getCenter(new THREE.Vector3());
			model.position.sub(center);

			scene.add(model);
		},
		undefined,
		(error) => {
			console.error("Kon assets/Blackhole (1).glb niet laden:", error);
		}
	);

	function resize() {
		const w = mount.clientWidth || 600;
		const h = mount.clientHeight || w;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}

	function animate() {
		if (model) {
			model.rotation.y += 0.0025;
		}

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	window.addEventListener("resize", resize);
	resize();
	animate();
}
