import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// canvas
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene: THREE.Scene = new THREE.Scene();

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
);
camera.position.set(10, 0, 0);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

/**
 * Object
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
object2.position.set(0, 0, -5);
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
object3.position.set(0, 0, 5);

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(0, 0, 10);
// const rayDirector = new THREE.Vector3(0, 0, -10);
// rayDirector.normalize();
// raycaster.set(rayOrigin, rayDirector);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

/**
 * Base
 */

// Renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

renderer.setClearColor('#23232b');

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
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener('click', () => {
  if (currentIntersect) {
    console.log ('click on a sphere');
    if (currentIntersect.object === object1) {
      console.log('click on object1')
    }
  }
})

/**
 * Animation
 */
const clock = new THREE.Clock();
let currentIntersect: THREE.Intersection<THREE.Object3D<THREE.Event>> | null = null;

const tick: () => void = () => {

  const elapsedTime = clock.getElapsedTime();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime);
  object2.position.y = Math.sin(elapsedTime * 1.5) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 2) * 3;

  // cast a ray
  raycaster.setFromCamera(mouse, camera);

  // const rayOrigin = new THREE.Vector3(0, 0, -10);
  // const rayDirector = new THREE.Vector3(0, 0, 10);
  // rayDirector.normalize();

  // raycaster.set(rayOrigin, rayDirector);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set('#ffffff');
  }

  for (const intersect of intersects) {
    // console.log(intersect.object)
    const object = intersect.object as THREE.Mesh<
      THREE.SphereGeometry,
      THREE.MeshBasicMaterial
    >;
    object.material.color.set('#00aaee');
  }

  if (intersects.length) {
    if (currentIntersect === null) {
      console.log('mouse enter');
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log('mouse leave');
    }
    currentIntersect = null;
  }

  // update the controls
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Debug
 */
const gui = new dat.GUI({ width: 400 });
