/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Scroll
 */
let scrollY;
let currentSection;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
  if (newSection !== currentSection) {
    currentSection = newSection;
    gsap.to(
      sectionMeshs[currentSection].rotation,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3'
      }
    )
  }
});

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Objects
 */

// Material
const material = new THREE.MeshToonMaterial({ color: '#a29bfe' });

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.x = 3;
mesh2.position.x = -3;
mesh3.position.x = 3;

scene.add(mesh1, mesh2, mesh3);

const objectDistance = 4;

mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

const sectionMeshs = [mesh1, mesh2, mesh3];

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

/**
 * Particles
 */
const particlesCount = 400;
const position = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  position[i * 3 + 0] = (Math.random() - 0.5) * 10;
  position[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshs.length;
  position[i * 3 + 2] = (Math.random() - 0.5) * 15;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(position, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: '#ffffff',
  sizeAttenuation: true,
  size: 0.05,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Scroll
  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  // coursor
  cameraGroup.position.x += (cursor.x - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y += (cursor.y - cameraGroup.position.y) * 5 * deltaTime;

  sectionMeshs.forEach((mesh) => {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
