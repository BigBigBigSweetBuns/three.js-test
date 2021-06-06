var THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

// 初始化画布，相机，模型的对象
class ThreeTest {
  x = 0;
  y = 0;
  z = 5; // 不紧贴的原点
  sShow = 2;//三维场景显示范围控制系数，系数越大，显示的范围越大
  rotate = 0; //初始角度
  rotateAdd = 0.05;// 每次旋转角度
  constructor(winWidth, winHeight) {
    this.winWidth = winWidth;
    this.winHeight = winHeight;
    this.init()
  }
  init() {
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.initModule();
  }
  initScene() {
    this.scene = new THREE.Scene();
    console.log("scene", this.scene);
  }
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xffff00);
    this.renderer.setSize(this.winWidth, this.winHeight);
    document.body.appendChild(this.renderer.domElement);
  }
  initCamera() {
    var k = this.winWidth / this.winHeight; //窗口宽高比
    this.camera = new THREE.OrthographicCamera(-k * this.sShow, k * this.sShow, this.sShow, -this.sShow, 0.1, 1000);
    this.camera.position.z = this.z;
  }
  initModule() {
    let loader = new THREE.GLTFLoader();
    const that = this;
    loader.load(
      "./public/path/just_a_girl/scene.gltf",
      function (gltf) {
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        that.scene.add(gltf.scene);
      },
      // undefined,
      function (res) {
        console.log("load", res);
      },
      function (error) {
        console.error("load", error);
      }
    );
  }
}

const threeTest = new ThreeTest(window.innerWidth, window.innerHeight);

var animate = function () {
  requestAnimationFrame(animate);

  threeTest.rotate = threeTest.rotate < 360 ? threeTest.rotate + threeTest.rotateAdd : 0; // 旋转360°

  threeTest.camera.position.x = 5 * Math.sin(threeTest.rotate);
  threeTest.camera.position.z = 5 * Math.cos(threeTest.rotate);
  threeTest.camera.lookAt(new THREE.Vector3(0, 0, 0));

  threeTest.renderer.render(threeTest.scene, threeTest.camera);
};

animate();