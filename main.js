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
renderer.setClearColor(new THREE.Color(199 / 255, 125 / 255, 78 / 255));

document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

camera.position.z = 10;

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
let perseveranceRover;
let spaceStation;
let marsRover;
let spaceship;

async function loadModels() {
  try {
    const perseveranceRoverPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/ingenuity_in_front_of_raised_ridge.glb",
        function (gltf) {
          perseveranceRover = gltf.scene;
          scene.add(perseveranceRover);
          perseveranceRover.scale.set(3, 3, 3);
          perseveranceRover.position.set(0, 0, 0);
          perseveranceRover.rotation.y -= 90;
          resolve();
        },
        undefined,
        reject
      );
    });

    const spaceStationPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/low_poly_space_station/scene.gltf",
        function (gltf) {
          spaceStation = gltf.scene;
          scene.add(spaceStation);
          spaceStation.scale.set(1, 1, 1);
          spaceStation.position.set(1, 10, -15);
          resolve();
        },
        undefined,
        reject
      );
    });

    const marsRoverPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/mars_rover/scene.gltf",
        function (gltf) {
          marsRover = gltf.scene;
          scene.add(marsRover);
          marsRover.scale.set(1, 1, 1);
          marsRover.position.set(5, -0.8, -15);
          resolve();
        },
        undefined,
        reject
      );
    });

    const spaceshipPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/spaceship/scene.gltf",
        function (gltf) {
          spaceship = gltf.scene;
          scene.add(spaceship);
          spaceship.scale.set(1, 1, 1);
          spaceship.position.set(10, 20, -25);
          resolve();
        },
        undefined,
        reject
      );
    });

    await Promise.all([
      perseveranceRoverPromise,
      spaceStationPromise,
      marsRoverPromise,
      spaceshipPromise,
    ]);

    console.log("Models loaded successfully!");
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
  const intersects = raycaster.intersectObject(
    perseveranceRover || spaceStation || marsRover || spaceship,
    true
  );

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
