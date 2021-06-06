var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

// 加载模型
var loader = new THREE.GLTFLoader();
// loader.load(
//   "./public/path/DaDouShaBao.glb",
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );
const scene = new THREE.Scene();
loader.load(
  "./public/path/just_a_girl/scene.gltf",
  function (gltf) {
    gltf.scene.scale.set(0.01, 0.01, 0.01);
    scene.add(gltf.scene);
  },
  // undefined,
  function (res) {
    console.log("load", res);
  },
  function (error) {
    console.error("load", error);
  }
);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffff00);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var k = window.innerWidth / window.innerHeight; //窗口宽高比
var s = 2;//三维场景显示范围控制系数，系数越大，显示的范围越大
var camera = new THREE.OrthographicCamera(-k * s, k * s, s, -s, 0.1, 1000);

// camera.lookAt(new THREE.Vector3(0, 0, 0));


// 假设 x，y=1，0
let x = 0;
let y = 0;
let z = 5;

rotate = 1;

var animate = function () {
  requestAnimationFrame(animate);

  rotate = rotate < 360 ? rotate + .05 : 0; // 旋转360°

  x = 5 * Math.sin(rotate);
  z = 5 * Math.cos(rotate);

  console.log("x", x)
  console.log("z", z)
  camera.position.x = x;
  camera.position.z = z;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.render(scene, camera);
};

animate();
