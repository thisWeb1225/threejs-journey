import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as dat from 'dat.gui'
const { log } = console;

/**
 * Type
 */
interface ISizes {
  width: number;
  height: number;
}

/**
 * Canvas
 */
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sizes: ISizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


/**
 * Debug
 */

const gui = new dat.GUI();

const defaultSceneColor = 0x512da8;
const defaultTextInfo = "3D THIS WEB"
const debugObj = {
  Text: defaultTextInfo,
  // Color: defaultSceneColor,
}


/**
 * Font Texture
 */

const fontLoader = new FontLoader();
fontLoader.load('../asstes/font/Righteous_Regular.json', (font) => {
  const textureLoader = new THREE.TextureLoader();
  // const matcapTexture = textureLoader.load(
  //   './../asstes/matcup/28292A_D3DAE5_A3ACB8_818183-256px.png'
  // );
  // const material = new THREE.MeshMatcapMaterial({
  //   matcap: matcapTexture,
  // });
  const material = new THREE.MeshNormalMaterial({
    // wireframe: true
  });
  

  let text: THREE.Mesh<TextGeometry>
  const createText = (textInfo = defaultTextInfo) => {
    const textGeometry = new TextGeometry(
      textInfo, 
      {
      font: font,
      size: 3,
      height: 2,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 1,
    });
    textGeometry.center();
    text = new THREE.Mesh(textGeometry, material);
    scene.add(text);
  }
  
  createText()

 

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.15, 20, 45);
  const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

  for (let i = 0; i < 700; i += 1) {
    let mesh;

    if (i % 10 <= 2) {
      mesh = new THREE.Mesh(boxGeometry, material);
    } else {
      mesh = new THREE.Mesh(donutGeometry, material);
    }
    mesh.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50
    );
    mesh.setRotationFromEuler(
      new THREE.Euler(
        Math.PI * Math.random(),
        Math.PI * Math.random(),
        Math.PI * Math.random()
      )
    );
    const radomeScale = Math.random() * 1 + 0.5;
    mesh.scale.set(radomeScale, radomeScale, radomeScale);
    scene.add(mesh);
  }

  gui.add(debugObj, 'Text').onChange((e: string) => {
    scene.remove(text)
    createText(e)
  });

  // gui.addColor(debugObj, 'Color').onChange((e: number) => {
  //   material.color.set(e)
  // });
});



/**
 * Base
 */

// Scene
const scene: THREE.Scene = new THREE.Scene();

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
);
camera.position.set(0, 0, 20);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// Renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas, alpha: true });
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

// double click to fullscreen
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Animation
const clock = new THREE.Clock();

const tick: () => void = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  controls.update()

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
