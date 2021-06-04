var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

var mixers = [];
var clock = new THREE.Clock();
(function () {
  var loader = new THREE.GLTFLoader();
  loader.load("./public/path/just_a_girl/scene.gltf", function (gltf) {
    //   loader.load("./public/path/DaDouShaBao.glb", function (gltf) {
    console.log(gltf);
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    scene.add(gltf.scene); // 将模型引入three

    // 调用动画
    var mixer = new THREE.AnimationMixer(gltf.scene.children[2]);
    await mixer.clipAction(gltf.animations[0]).setDuration(1).play();
    mixers.push(mixer);
  });
})();

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

var time;
var animate = function () {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();
  for (var i = 0; i < mixers.length; i++) {
    // 重复播放动画
    mixers[i].update(delta);
  }

  //   stats.begin();
  renderer.render(scene, camera);
  //   stats.end();
};

animate();
