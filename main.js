// Mengimpor modul THREE dari Three.js
import * as THREE from "three";
// Mengimpor PointerLockControls dari Three.js untuk mengontrol kamera
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
// Mengimpor GLTFLoader dari Three.js untuk memuat model GLTF
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Membuat scene Three.js baru
const scene = new THREE.Scene();
// Membuat kamera perspektif Three.js
const camera = new THREE.PerspectiveCamera(
  100, // Bidang pandang kamera (FOV)
  window.innerWidth / window.innerHeight, // Rasio aspek kamera
  0.1, // Jarak pandang minimum
  1000 // Jarak pandang maksimum
);

// Membuat renderer WebGL
const renderer = new THREE.WebGLRenderer();
// Mengatur ukuran renderer sesuai ukuran layar
renderer.setSize(window.innerWidth, window.innerHeight);
// Mengaktifkan penggunaan shadow map untuk rendering bayangan
renderer.shadowMap.enabled = true;
// Mengatur jenis shadow map menjadi PCFSoftShadowMap untuk bayangan yang lebih halus
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Mengatur output encoding menjadi sRGBEncoding
renderer.outputEncoding = THREE.sRGBEncoding;
// Mengatur warna background renderer
renderer.setClearColor(new THREE.Color(199 / 255, 125 / 255, 78 / 255));

// Menambahkan elemen renderer ke dalam body dokumen HTML
document.body.appendChild(renderer.domElement);

// Membuat cahaya ambient dengan warna putih dan intensitas 1
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// Menambahkan cahaya ambient ke dalam scene
scene.add(ambientLight);

// Membuat cahaya titik (seolah matahari) dengan intensitas tinggi
const sunLight = new THREE.PointLight(null, 450000);
// Mengatur posisi cahaya titik (matahari)
sunLight.position.set(30, 200, -100);
// Mengaktifkan penggunaan shadow casting (penyinaran bayangan) oleh cahaya
sunLight.castShadow = true;
// Mengatur ukuran shadow map untuk cahaya
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;

// Mengatur properti shadow camera untuk cahaya
sunLight.shadow.camera.left = -500;
sunLight.shadow.camera.right = 500;
sunLight.shadow.camera.top = 500;
sunLight.shadow.camera.bottom = -500;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;

// Menambahkan cahaya titik ke dalam scene
scene.add(sunLight);

// Opsi tambahan: Menambahkan helper untuk visualisasi frustum kamera shadow
const helper = new THREE.CameraHelper(sunLight.shadow.camera);
scene.add(helper);

// Mengatur posisi awal kamera
camera.position.z = 10;
camera.position.y = 5;

// Membuat kontrol PointerLockControls untuk mengontrol kamera
const controls = new PointerLockControls(camera, renderer.domElement);
// Menambahkan kontrol kamera ke dalam scene
scene.add(controls.getObject());

// Menambahkan event listener untuk mengunci pointer saat tombol mouse diklik
document.addEventListener("click", () => {
  controls.lock();
});

// Membuat loader untuk memuat model 3D
const loader = new GLTFLoader();
// Mendefinisikan variabel untuk menyimpan instance model yang dimuat
let perseveranceRover;
let spaceStation;
let marsRover;
let spaceship;
let sun;
let satelite;

// Membuat geometri dan material untuk lantai (tanah)
const groundGeometry = new THREE.PlaneGeometry(500, 500);
const groundMaterial = new THREE.MeshBasicMaterial();
// Membuat objek lantai (tanah) dari geometri dan material yang telah dibuat
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// Mengatur rotasi objek lantai (tanah) agar sejajar dengan sumbu x
ground.rotation.x = -Math.PI / 2;
// Mengatur objek lantai (tanah) menjadi tidak terlihat
ground.visible = false;
// Menambahkan objek lantai (tanah) ke dalam scene
scene.add(ground);

// Fungsi asinkron untuk memuat semua model
async function loadModels() {
  try {
    // Memuat model Perseverance Rover
    const perseveranceRoverPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/ingenuity_in_front_of_raised_ridge.glb", // Lokasi file model
        function (gltf) {
          perseveranceRover = gltf.scene; // Menyimpan model ke dalam variabel
          scene.add(perseveranceRover); // Menambahkan model ke dalam scene
          perseveranceRover.scale.set(3, 3, 3); // Mengatur skala model
          perseveranceRover.position.set(0, 0, 0); // Mengatur posisi model
          perseveranceRover.rotation.y -= 90; // Mengatur rotasi model
          resolve(); // Menandakan bahwa model telah dimuat dengan sukses
        },
        undefined,
        reject // Menandakan bahwa terjadi kesalahan saat memuat model
      );
    });

    // Memuat model Space Station
    const spaceStationPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/low_poly_space_station/scene.gltf", // Lokasi file model
        function (gltf) {
          spaceStation = gltf.scene; // Menyimpan model ke dalam variabel
          scene.add(spaceStation); // Menambahkan model ke dalam scene
          spaceStation.scale.set(1, 1, 1); // Mengatur skala model
          spaceStation.position.set(1, 3.6, -15); // Mengatur posisi model
          resolve(); // Menandakan bahwa model telah dimuat dengan sukses
        },
        undefined,
        reject // Menandakan bahwa terjadi kesalahan saat memuat model
      );
    });

    // Memuat model Satelit
    const satelitePromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/satellite/scene.gltf", // Lokasi file model
        function (gltf) {
          satelite = gltf.scene; // Menyimpan model ke dalam variabel
          scene.add(satelite); // Menambahkan model ke dalam scene
          satelite.scale.set(1, 1, 1); // Mengatur skala model
          satelite.position.set(1, 25, -15); // Mengatur posisi model
          resolve(); // Menandakan bahwa model telah dimuat dengan sukses
        },
        undefined,
        reject // Menandakan bahwa terjadi kesalahan saat memuat model
      );
    });

    // Memuat model Matahari
    const sunPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/sun/scene.gltf", // Lokasi file model
        function (gltf) {
          sun = gltf.scene; // Menyimpan model ke dalam variabel
          scene.add(sun); // Menambahkan model ke dalam scene
          sun.scale.set(0.1, 0.1, 0.1); // Mengatur skala model
          sun.position.set(30, 200, -100); // Mengatur posisi model
          resolve(); // Menandakan bahwa model telah dimuat dengan sukses
        },
        undefined,
        reject // Menandakan bahwa terjadi kesalahan saat memuat model
      );
    });

    // Memuat model Mars Rover
    const marsRoverPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/mars_rover/scene.gltf", // Lokasi file model
        function (gltf) {
          marsRover = gltf.scene; // Menyimpan model ke dalam variabel
          scene.add(marsRover); // Menambahkan model ke dalam scene
          marsRover.scale.set(1, 1, 1); // Mengatur skala model
          marsRover.position.set(5, -0.8, -15); // Mengatur posisi model
          resolve(); // Menandakan bahwa model telah dimuat dengan sukses
        },
        undefined,
        reject // Menandakan bahwa terjadi kesalahan saat memuat model
      );
    });

    // Memuat model Spaceship
    const spaceshipPromise = new Promise((resolve, reject) => {
      loader.load(
        "/models/spaceship/scene.gltf", // Lokasi file model
        function (gltf) {
          spaceship = gltf.scene; // Menyimpan model ke dalam variabel
          scene.add(spaceship); // Menambahkan model ke dalam scene
          spaceship.scale.set(1, 1, 1); // Mengatur skala model
          spaceship.position.set(10, 0, -25); // Mengatur posisi model
          resolve(); // Menandakan bahwa model telah dimuat dengan sukses
        },
        undefined,
        reject // Menandakan bahwa terjadi kesalahan saat memuat model
      );
    });

    // Menunggu hingga semua model telah dimuat sebelum melanjutkan
    await Promise.all([
      perseveranceRoverPromise,
      spaceStationPromise,
      sunPromise,
      marsRoverPromise,
      spaceshipPromise,
      satelitePromise,
    ]);

    // Mengaktifkan shadow casting untuk semua objek yang dimuat
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

    console.log("Models loaded successfully!"); // Log pesan ke konsol
    console.log(marsRover.position.y); // Log posisi Y Mars Rover ke konsol
  } catch (error) {
    console.error("Error loading models:", error); // Log pesan kesalahan ke konsol jika terjadi kesalahan
  }
}

// Memanggil fungsi untuk memuat model-model
loadModels();

// Objek untuk menyimpan status tombol keyboard yang ditekan
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

// Fungsi event saat tombol keyboard ditekan
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

// Fungsi event saat tombol keyboard dilepas
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

// Menambahkan event listener untuk tombol keyboard yang ditekan dan dilepas
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

// Fungsi untuk memeriksa tabrakan antara objek dengan kamera
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
      // Sesuaikan nilai ambang ini sesuai kebutuhan aplikasi Anda
      return true; // Tabrakan terdeteksi
    }
  }

  return false; // Tidak ada tabrakan
}

// Kecepatan pergerakan kamera
const cameraSpeed = 0.1;
const cameraHeight = 2; // Tinggi kamera dari permukaan Mars Rover

// Menambahkan kecepatan untuk Spaceship
const spaceshipSpeed = 0.05;
const sateliteSpeed = 0.01;

// Radius orbit satelit
const orbitRadius = 200;
let angle = 0;

// Radius orbit spaceship
const spaceshipRadius = 10;
const spaceshipOrbitSpeed = 0.02;
let spaceshipAngle = 0;

// Fungsi untuk animasi objek di dalam scene
function animate() {
  requestAnimationFrame(animate);

  // Menggerakkan Spaceship dalam lintasan lingkaran
  if (spaceship) {
    spaceshipAngle += spaceshipOrbitSpeed;

    // Menghitung posisi baru
    spaceship.position.x = spaceshipRadius * Math.cos(spaceshipAngle);
    spaceship.position.z = spaceshipRadius * Math.sin(spaceshipAngle);
    spaceship.position.y = 35; // Sesuaikan ketinggian jika diperlukan

    // Menghadap ke arah gerakan
    spaceship.lookAt(0, 35, 0);
  }

  // Menggerakkan Satelit dalam orbit elips
  if (satelite) {
    angle += sateliteSpeed;

    // Menghitung posisi baru
    satelite.position.x = orbitRadius * Math.cos(angle);
    satelite.position.z = orbitRadius * Math.sin(angle);
    satelite.position.y = 25;
  }

  // Pergerakan kamera sesuai input keyboard
  const moveVector = new THREE.Vector3();
  if (keyboardControls.w) {
    moveVector.z -= cameraSpeed;
    if (marsRover.position.y != -0.8) {
      // Memeriksa jika Mars Rover tidak berada di permukaan
      moveVector.z = 0;
      marsRover.position.y = -0.8; // Mengatur posisi Mars Rover kembali ke permukaan
    }
  }
  if (keyboardControls.s) {
    moveVector.z += cameraSpeed;
    if (marsRover.position.y != -0.8) {
      // Memeriksa jika Mars Rover tidak berada di permukaan
      moveVector.z = 0;
      marsRover.position.y = -0.8; // Mengatur posisi Mars Rover kembali ke permukaan
    }
  }
  if (keyboardControls.a) {
    moveVector.x -= cameraSpeed;
  }
  if (keyboardControls.d) {
    moveVector.x += cameraSpeed;
  }

  moveVector.applyQuaternion(camera.quaternion);
  marsRover.position.add(moveVector); // Menggerakkan Mars Rover

  // Mengatur posisi kamera mengikuti Mars Rover
  camera.position
    .copy(marsRover.position)
    .add(new THREE.Vector3(0, cameraHeight, 0));

  // Merender scene dengan kamera yang diberikan
  renderer.render(scene, camera);
}

// Memanggil fungsi untuk memulai animasi
animate();
