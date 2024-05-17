import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
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
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: softer shadows
renderer.outputEncoding = THREE.sRGBEncoding; // Updated from gammaOutput which is deprecated
renderer.setClearColor(new THREE.Color(199 / 255, 125 / 255, 78 / 255));

document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Create a directional light
const sunLight = new THREE.PointLight(null, 450000);
sunLight.position.set(30, 200, -200); // Same position as the sun
sunLight.castShadow = true; // Enable shadow casting
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;

// Set up shadow properties for the light
sunLight.shadow.camera.left = -500;
sunLight.shadow.camera.right = 500;
sunLight.shadow.camera.top = 500;
sunLight.shadow.camera.bottom = -500;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;

// Add the light to the scene
scene.add(sunLight);

// Optionally, you can add a helper to visualize the shadow camera's frustum
const helper = new THREE.CameraHelper(sunLight.shadow.camera);
scene.add(helper);

camera.position.z = 10;
camera.position.y = 5;

const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Add event listener to lock pointer
document.addEventListener("click", () => {
  controls.lock();
});

const loader = new GLTFLoader();
let perseveranceRover;
let spaceStation;
let marsRover;
let spaceship;
let sun;
let satelite;

const groundGeometry = new THREE.PlaneGeometry(500, 500);
const groundMaterial = new THREE.MeshBasicMaterial();
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.visible=false
scene.add(ground);

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

    const satelitePromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/satellite/scene.gltf",
        function (gltf) {
          satelite = gltf.scene;
          scene.add(satelite);
          satelite.scale.set(1, 1, 1);
          satelite.position.set(1, 25, -15);
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
          sun.scale.set(0.1, 0.1, 0.1);
          sun.position.set(30, 200, -200);
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
      sunPromise,
      marsRoverPromise,
      spaceshipPromise,
      satelitePromise,
    ]);

    // Enable shadow casting for objects
    perseveranceRover.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    spaceStation.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    marsRover.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    spaceship.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    satelite.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    console.log("Models loaded successfully!");
    console.log(marsRover.position.y)
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

function checkCollision() {
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  const raycaster = new THREE.Raycaster(camera.position, cameraDirection);
  const intersects = raycaster.intersectObject(
    perseveranceRover ||
      spaceStation ||
      marsRover ||
      spaceship ||
      sun ||
      satelite,
    true
  );

  if (intersects.length > 0) {
    const distance = intersects[0].distance;
    if (distance < 1) {
      // Adjust this threshold value according to your scene
      return true; // Collision detected
    }
  }

  return false; // No collision
}

const cameraSpeed = 0.1;
const cameraHeight = 2; // Adjust the height of the camera from the rover

function animate() {
  requestAnimationFrame(animate);

  // Movement
  const moveVector = new THREE.Vector3();
  if (keyboardControls.w) {
    console.log(moveVector.z)
    moveVector.z -= cameraSpeed;
    if(marsRover.position.y != -0.8){
      console.log("z: " + marsRover.position.y)
      moveVector.z = 0
      marsRover.position.y = -0.8
      console.log("masuk sini")
    }
  }
  if (keyboardControls.s) {
    moveVector.z += cameraSpeed;
    if(marsRover.position.y != -0.8){
      console.log("z: " + marsRover.position.y)
      moveVector.z = 0
      marsRover.position.y = -0.8
      console.log("masuk sini")
    }
  }
  if (keyboardControls.a) {
    moveVector.x -= cameraSpeed;
  }
  if (keyboardControls.d) {
    moveVector.x += cameraSpeed;
  }

  moveVector.applyQuaternion(camera.quaternion);
  marsRover.position.add(moveVector);

  camera.position
    .copy(marsRover.position)
    .add(new THREE.Vector3(0, cameraHeight, 0));

  renderer.render(scene, camera);
}

animate();
