import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import * as dat from 'dat.gui';

const { log } = console;
// canvas
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene: THREE.Scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// ambientLight.color = new THREE.Color(0xffffff);
// ambientLight.intensity = 0.5
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffa, 0.3);
directionalLight.position.set(10, 5, 10);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

const hemisphereLight = new THREE.HemisphereLight('blue', 'purple', 0.6);
scene.add(hemisphereLight);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  2
);
scene.add(hemisphereLightHelper);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 10, 2);
pointLight.position.set(-1.5, 2, -1.5);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 1.5, 1.5);
rectAreaLight.position.set(0, 2, 2.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

const spotLight = new THREE.SpotLight(
  'purple',
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

/**
 * Object
 */
// Materail
const material = new THREE.MeshStandardMaterial();
material.metalness = 0;
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.set(-1.5, 0, 0);

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.set(1.5, 0, 0);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.set(-Math.PI / 2, 0, 0);
plane.position.set(0, -0.65, 0);

scene.add(sphere, cube, torus, plane);

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
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/**
 * GUIs
 */

const gui = new dat.GUI()

const meshFolder = gui.addFolder('Mesh')
meshFolder.add(material as any, 'metalness', 0, 1, 0.0001)
meshFolder.add(material as any, 'roughness', 0, 1, 0.0001)
meshFolder.add(material as any, 'wireframe')

const ambientLightFolder = gui.addFolder('AmbientLight')
ambientLightFolder.add(ambientLight as any, 'visible').listen()
ambientLightFolder.add(ambientLight as any, 'intensity', 0, 1, 0.001)

const directionalLightFolder = gui.addFolder('DirectionalLight')
directionalLightFolder
  .add(directionalLight as any, 'visible')
  .onChange((visible: boolean) => {
    directionalLightHelper.visible = visible
  })
  .listen()
directionalLightFolder.add(directionalLightHelper as any, 'visible').name('helper visible').listen()
directionalLightFolder.add(directionalLight as any, 'intensity', 0, 1, 0.001)

const hemisphereLightFolder = gui.addFolder('HemisphereLight')
hemisphereLightFolder
  .add(hemisphereLight as any, 'visible')
  .onChange((visible: boolean) => {
    hemisphereLightHelper.visible = visible
  })
  .listen()
hemisphereLightFolder.add(hemisphereLightHelper as any, 'visible').name('helper visible').listen()
hemisphereLightFolder.add(hemisphereLight as any, 'intensity', 0, 1, 0.001)

const pointLightFolder = gui.addFolder('PointLight')
pointLightFolder
  .add(pointLight as any, 'visible')
  .onChange((visible: boolean) => {
    pointLightHelper.visible = visible
  })
  .listen()
pointLightFolder.add(pointLightHelper as any, 'visible').name('helper visible').listen()
pointLightFolder.add(pointLight as any, 'distance', 0, 100, 0.00001)
pointLightFolder.add(pointLight as any, 'decay', 0, 10, 0.00001)

const rectAreaLightFolder = gui.addFolder('RectAreaLight')
rectAreaLightFolder
  .add(rectAreaLight as any, 'visible')
  .onChange((visible: boolean) => {
    rectAreaLightHelper.visible = visible
  })
  .listen()
rectAreaLightFolder.add(rectAreaLightHelper as any, 'visible').name('helper visible').listen()
rectAreaLightFolder.add(rectAreaLight as any, 'intensity', 0, 80, 0.0001)
rectAreaLightFolder.add(rectAreaLight as any, 'width', 0, 5, 0.0001)
rectAreaLightFolder.add(rectAreaLight as any, 'height', 0, 5, 0.0001)

const spotLightFolder = gui.addFolder('SpotLight')
spotLightFolder
  .add(spotLight as any, 'visible')
  .onChange((visible: boolean) => {
    spotLightHelper.visible = visible
  })
  .listen()
spotLightFolder.add(spotLightHelper as any, 'visible').name('helper visible').listen()
spotLightFolder.add(spotLight as any, 'intensity', 0, 5, 0.001)
spotLightFolder.add(spotLight as any, 'distance', 0, 20, 0.001)
spotLightFolder.add(spotLight as any, 'angle', 0, Math.PI / 2, 0.001)
spotLightFolder.add(spotLight as any, 'penumbra', 0, 1, 0.001)
spotLightFolder.add(spotLight as any, 'decay', 0, 10, 0.001)

const guiObj = {
  turnOffAllLights() {
    ambientLight.visible = false
    directionalLight.visible = false
    directionalLightHelper.visible = false
    hemisphereLight.visible = false
    hemisphereLightHelper.visible = false
    pointLight.visible = false
    pointLightHelper.visible = false
    rectAreaLight.visible = false
    rectAreaLightHelper.visible = false
    spotLight.visible = false
    spotLightHelper.visible = false
  },
  turnOnAllLights() {
    ambientLight.visible = true
    directionalLight.visible = true
    directionalLightHelper.visible = true
    hemisphereLight.visible = true
    hemisphereLightHelper.visible = true
    pointLight.visible = true
    pointLightHelper.visible = true
    rectAreaLight.visible = true
    rectAreaLightHelper.visible = true
    spotLight.visible = true
    spotLightHelper.visible = true
  },
}

gui.add(guiObj, 'turnOffAllLights')
gui.add(guiObj, 'turnOnAllLights')
