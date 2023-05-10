import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// canvas
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene: THREE.Scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load(
  './../assets/texture/Door_Wood_001_basecolor.jpg'
);
const doorAmbientOcclusionTexture = textureLoader.load(
  './../assets/texture/Door_Wood_001_ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load(
  './../assets/texture/Door_Wood_001_height.png'
);
const doorNormalTexture = textureLoader.load(
  './../assets/texture/Door_Wood_001_normal.jpg'
);
const doorMetalnessTexture = textureLoader.load(
  './../assets/texture/Door_Wood_001_metallic.jpg'
);
const doorRoughnessTexture = textureLoader.load(
  './../assets/texture/Door_Wood_001_roughness.jpg'
);
const doorAlphaTexture = textureLoader.load(
  './../assets/texture/Door_Wood_001_opacity.jpg'
);

// brick
const brickColorTexture = textureLoader.load(
  './../assets/texture/brick/baseColor.jpg'
);
const brickAmbientOcclusionTexture = textureLoader.load(
  './../assets/texture/brick/ambientOcclusion.jpg'
);
const brickHeightTexture = textureLoader.load(
  './../assets/texture/brick/height.png'
);
const brickNormalTexture = textureLoader.load(
  './../assets/texture/brick/normal.jpg'
);
const brickRoughnessTexture = textureLoader.load(
  './../assets/texture/brick/roughness.jpg'
);

brickColorTexture.repeat.set(3, 3);
brickAmbientOcclusionTexture.repeat.set(3, 3);
brickHeightTexture.repeat.set(3, 3);
brickNormalTexture.repeat.set(3, 3);
brickRoughnessTexture.repeat.set(3, 3);

brickColorTexture.wrapS = THREE.RepeatWrapping;
brickAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
brickHeightTexture.wrapS = THREE.RepeatWrapping;
brickNormalTexture.wrapS = THREE.RepeatWrapping;
brickRoughnessTexture.wrapS = THREE.RepeatWrapping;

brickColorTexture.wrapT = THREE.RepeatWrapping;
brickAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
brickHeightTexture.wrapT = THREE.RepeatWrapping;
brickNormalTexture.wrapT = THREE.RepeatWrapping;
brickRoughnessTexture.wrapT = THREE.RepeatWrapping;

// floor
const floorColorTexture = textureLoader.load(
  './../assets/texture/ground/GroundDirtForest014_color.jpg'
);
const floorHeightTexture = textureLoader.load(
  '../assets/texture/ground/GroundDirtForest014_displacment.jpg'
);
const floorNormalTexture = textureLoader.load(
  './../assets/texture/ground/GroundDirtForest014_normal.jpg'
);
const floorRoughnessTexture = textureLoader.load(
  './../assets/texture/ground/GroundDirtForest014_ao.jpg'
);

// roof
const roofColorTexture = textureLoader.load(
  './../assets/texture/roof/Roof_Tiles_Schist_001_basecolor.jpg'
);
const roofHeightTexture = textureLoader.load(
  '../assets/texture/roof/Roof_Tiles_Schist_001_height.png'
);
const roofNormalTexture = textureLoader.load(
  './../assets/texture/roof/Roof_Tiles_Schist_001_normal.jpg'
);
const roofRoughnessTexture = textureLoader.load(
  './../assets/texture/roof/Roof_Tiles_Schist_001_roughness.jpg'
);
roofColorTexture.repeat.set(3, 3);
roofHeightTexture.repeat.set(3, 3);
roofNormalTexture.repeat.set(3, 3);
roofRoughnessTexture.repeat.set(3, 3);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofHeightTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofRoughnessTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.wrapT = THREE.RepeatWrapping;
roofHeightTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * Object
 */
// Group
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    displacementMap: brickHeightTexture,
    displacementScale: 0.001,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  'uv2',
  //@ts-ignore
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.4, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    displacementMap: roofHeightTexture,
    displacementScale: 0.001,
    normalMap: roofNormalTexture,
    roughnessMap: roofRoughnessTexture,
  })
);
roof.position.y = 2.5 + 0.7;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.12,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  'uv2',
  //@ts-ignore
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.set(0, 0.95, 2.0001);
house.add(door);

// Bush
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89a800' });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2a0b1' });

for (let i = 0; i < 100; i += 1) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  grave.position.set(x, 0.3, z);
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  graves.add(grave);

  grave.castShadow = true;
}

// Floor
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(20, 2, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    displacementMap: floorHeightTexture,
    displacementScale: 0.01,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture,
  })
);
// floor.rotation.x = -Math.PI * 0.5
floor.position.y = -1;
scene.add(floor);

// Moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshBasicMaterial({ color: '#fff' })
);
moon.position.set(18, 18, 18);
scene.add(moon);

// Fog
const fog = new THREE.Fog('#262837', 1, 20);
scene.fog = fog;

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 3, 3);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#00ffff', 2, 3);
ghost1.position.set(5, 2, 5);
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#00ffff', 2, 4);
ghost2.position.set(-7, 2, -3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#00ffff', 2, 3);
ghost3.position.set(3, 2, -3);
scene.add(ghost3);

/**
 * Shadow
 */
directionalLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

/**
 * Base
 */

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
);
camera.position.set(0, 0, 5);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// Renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

renderer.setClearColor('#262837');

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// size
window.addEventListener('resize', () => {
  // Update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animation
 */
const clock = new THREE.Clock();

const tick: () => void = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3) + 1;



  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5) + 2;

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
