var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");
var loader = new THREE.GLTFLoader();
loader.load(
  "./public/path/DaDouShaBao.glb",
  function (gltf) {
    gltf.Mesh
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffff00);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
