import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.gammaOutput = true;

document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load("/models/sky.jpg");
skyTexture.wrapS = THREE.RepeatWrapping;
skyTexture.wrapT = THREE.RepeatWrapping;
skyTexture.repeat.set(1, 1);

const skyGeometry = new THREE.PlaneGeometry(1000, 1000);
const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture });
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
sky.position.y = 10; // Adjust the position as needed
scene.add(sky);

renderer.setClearColor(0xffffff);
camera.position.z = 10;

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
let birds;
let sun;

async function loadModels() {
  try {
    const birdsPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/birds/scene.gltf",
        function (gltf) {
          birds = gltf.scene;
          scene.add(birds);
          birds.scale.set(3, 3, 3);
          resolve();
        },
        undefined,
        reject
      );
    });

    const sunPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/sun/scene.gltf",
        function (gltf) {
          sun = gltf.scene;
          scene.add(sun);
          sun.scale.set(0.02, 0.02, 0.02);
          sun.position.set(-1, 0, -5);
          resolve();
        },
        undefined,
        reject
      );
    });

    await birdsPromise;
    await sunPromise;
    await skyBg;

    console.log("Birds loaded successfully!");
  } catch (error) {
    console.error("Error loading models:", error);
  }
}

loadModels();

// Keyboard controls for camera movement
const keyboardControls = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function onKeyDown(event) {
  switch (event.code) {
    case "KeyW":
      keyboardControls.w = true;
      break;
    case "KeyA":
      keyboardControls.a = true;
      break;
    case "KeyS":
      keyboardControls.s = true;
      break;
    case "KeyD":
      keyboardControls.d = true;
      break;
    case "ArrowUp":
      keyboardControls.ArrowUp = true;
      break;
    case "ArrowDown":
      keyboardControls.ArrowDown = true;
      break;
    case "ArrowLeft":
      keyboardControls.ArrowLeft = true;
      break;
    case "ArrowRight":
      keyboardControls.ArrowRight = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case "KeyW":
      keyboardControls.w = false;
      break;
    case "KeyA":
      keyboardControls.a = false;
      break;
    case "KeyS":
      keyboardControls.s = false;
      break;
    case "KeyD":
      keyboardControls.d = false;
      break;
    case "ArrowUp":
      keyboardControls.ArrowUp = false;
      break;
    case "ArrowDown":
      keyboardControls.ArrowDown = false;
      break;
    case "ArrowLeft":
      keyboardControls.ArrowLeft = false;
      break;
    case "ArrowRight":
      keyboardControls.ArrowRight = false;
      break;
  }
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

// Check collision between camera and model
function checkCollision() {
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  const raycaster = new THREE.Raycaster(camera.position, cameraDirection);
  const intersects = raycaster.intersectObject(birds, true);

  if (intersects.length > 0) {
    const distance = intersects[0].distance;
    if (distance < 2) {
      // Adjust this threshold value according to your scene
      return true; // Collision detected
    }
  }

  return false; // No collision
}

function animate() {
  requestAnimationFrame(animate);

  // Movement speed
  const speed = 0.1;

  // Camera movement
  const direction = new THREE.Vector3();
  controls.object.getWorldDirection(direction);
  direction.normalize();

  if (keyboardControls.w && !checkCollision()) {
    camera.position.add(direction.multiplyScalar(speed));
  }
  if (keyboardControls.s) {
    camera.position.sub(direction.multiplyScalar(speed));
  }
  if (keyboardControls.d) {
    camera.position.sub(
      new THREE.Vector3(direction.z, 0, -direction.x).multiplyScalar(speed)
    );
  }
  if (keyboardControls.a) {
    camera.position.add(
      new THREE.Vector3(direction.z, 0, -direction.x).multiplyScalar(speed)
    );
  }

  // Camera rotation
  if (keyboardControls.ArrowUp) {
    camera.rotation.x += 0.01;
  }
  if (keyboardControls.ArrowDown) {
    camera.rotation.x -= 0.01;
  }
  if (keyboardControls.ArrowLeft) {
    camera.rotation.y += 0.01;
  }
  if (keyboardControls.ArrowRight) {
    camera.rotation.y -= 0.01;
  }

  renderer.render(scene, camera);
}

animate();

// onProgress callback function

// const textures = {};

// // Create a texture loader
// const textureLoader = new THREE.TextureLoader();

// // Load each texture asynchronously
// textureLoader.load(
//     './Model3D/textures/body_diffuse.JPEG',
//     function (texture) {
//         textures['body_diffuse'] = texture;
//         applyTextures(); // Call applyTextures function after each texture is loaded
//     }
// );

// textureLoader.load(
//     './Model3D/textures/cloth_diffuse.JPEG',
//     function (texture) {
//         textures['cloth_diffuse'] = texture;
//         applyTextures(); // Call applyTextures function after each texture is loaded
//     }
// );

// // Function to apply textures to materials
// function applyTextures() {
//     // Check if all textures are loaded
//     if (Object.keys(textures).length === 2) { // Adjust the number based on the total number of textures
//         // Apply textures to materials
//         loadedObject.traverse(child => {
//             if (child.isMesh) {
//                 // Check which material corresponds to each texture
//                 if (child.material.name === 'body_material') {
//                     child.material.map = textures['body_diffuse'];
//                 } else if (child.material.name === 'other_material') {
//                     child.material.map = textures['cloth_diffuse'];
//                 }
//                 // You can add more conditions for other materials if needed
//             }
//         });
//     }
// }
