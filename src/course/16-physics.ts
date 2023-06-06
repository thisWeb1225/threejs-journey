import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es';

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
camera.position.set(30, 15, 30);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

/**
 * Object
 */
// plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50), 
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: 'lightblue'
  }));
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
scene.add(plane);

/**
 * Light
 */
const spotLight = new THREE.SpotLight();
spotLight.castShadow = true;
spotLight.position.set(25, 30, 25);
const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.3);
scene.add(ambientLight, spotLight);

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 100

const spotLightHelper = new THREE.SpotLightHelper(
  spotLight,
  2
);
spotLightHelper.visible = false;
scene.add(spotLightHelper);

/**
 * Physics
 */

// Wrolds
const world = new CANNON.World();
world.gravity.set(0, -1, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
// world.allowSleep = true;

// Materials
const defaultMaterial = new CANNON.Material('defalut');

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial, {
    friction: 0.1,
    restitution: 0.7,
  }
)
world.addContactMaterial(defaultContactMaterial);


// create sphere body
const objectsToUpdate: Array<{
  mesh: THREE.Mesh,
  body: CANNON.Body
}> = [];


const createSphere = (radius: number, position: THREE.Vector3)=> {
  // THREE.js mesh
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshStandardMaterial(),
  );
  mesh.castShadow = true;
  mesh.position.copy(position);

  scene.add(mesh);

  // Cannon body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });

  body.position.copy(position as any);
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body
  });
}

createSphere(1, new THREE.Vector3(0, 5, 0));

// Boxes
const createBoxes = (width: number, height: number, depth: number, position: THREE.Vector3) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(), 
    new THREE.MeshStandardMaterial()
    )
  mesh.castShadow = true
  mesh.scale.set(width, height, depth)
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  })

  body.position.copy(position as any)
  world.addBody(body)
  objectsToUpdate.push({
    mesh,
    body,
  })
}

// floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0, // means that don't drop
  shape: floorShape,
  material: defaultMaterial
})
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI / 2
)
world.addBody(floorBody);



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
 * Animation
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick: () => void = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = deltaTime;

  // Update the physics world
  world.step(1 / 60, deltaTime, 3);

  // let the three.js object's position is same as world step
  objectsToUpdate.forEach(obj => {
    obj.mesh.position.copy(obj.body.position as any);
    obj.mesh.quaternion.copy(obj.body.quaternion as any);
  })

  // update the controls
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Debug
 */
const gui = new dat.GUI();

const guiObj = {
  createSphere: () => {},
  createBox:() => {},
  // reset() {},
}

guiObj.createSphere = () => {
  createSphere(
    Math.random(),
    new THREE.Vector3((Math.random()) * 3, 5, (Math.random() - 1) * 3),
  )
}

guiObj.createBox = () => {
  createBoxes(
    Math.random(),
    Math.random(),
    Math.random(),
    new THREE.Vector3((Math.random() - 0.5) * 8, 5, (Math.random() - 0.5) * 8),
  )
}

gui.add(guiObj, 'createSphere')
gui.add(guiObj, 'createBox')

