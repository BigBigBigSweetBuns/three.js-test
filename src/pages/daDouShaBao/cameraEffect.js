const THREE = require("three");

class CameraEffect {
  renderer;
  // 大小
  _halfWidth;
  _width;
  _height;
  // 摄像机
  _cameraA;
  _cameraB;
  _cameraC;
  _cameraD;
  constructor(scene, renderer, width, height) {
    // Initialization
    this.renderer = renderer;
    this.renderer.setScissorTest(true); // 允许裁剪后的视图展示
    this.scene = scene;
    // 设置镜头
    this.initWindowSize(width, height);
    // 初始化相机
    // 需要将物体放置在相机的视距内
    this._cameraA = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20);
    this._cameraB = new THREE.OrthographicCamera(2, 4, 1, -1, 1, 20);
    this._cameraC = new THREE.OrthographicCamera(2, 4, 1, -1, 1, 20);
    this._cameraD = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20);
    this.initCamera(this.scene);
  }
  initWindowSize(width, height) {
    this._halfWidth = width / 2;
    if (width < height) {
      this._width = width / 2;
      this._height = width / 2;
    } else {
      this._width = height / 2;
      this._height = height / 2;
    }
    this.renderer.setSize(width, height);
  }
  initCamera(scene) {
    this.setCamera(this._cameraA, 3, 0, 3, scene.position);
    this.setCamera(this._cameraB, 0, 0, 3, new THREE.Vector3(0, 0, 0));
    // 全显示
  }
  setCamera(camera, x = 0, y = 0, z = 0, position = null) {
      camera.position.x = x;
      camera.position.y = y;
      camera.position.z = z;
      if (position) {
        camera.lookAt(position);
      }
    }
    // x,y角
  renderCamera(
    scene,
    camera,
    x = 0,
    y = 0,
    width,
    height,
    _x = 0,
    _y = 0,
    _width,
    _height
  ) {
    this.renderer.setScissor(x, y, width, height);
    this.renderer.setViewport(_x, _y, _width, _height);
    this.renderer.localClippingEnabled = true;
    this.renderer.render(scene, camera);
  }
  render(scene, camera) {
    scene.updateMatrixWorld(true); // 更新模型的世界矩阵
    // this.renderer.clear();

    // this.initCamera(scene);
    // 展示一半
    // this.renderCamera(
    //   scene,
    //   this._cameraA,
    //   0,
    //   0,
    //   this._width / 2,
    //   this._height,
    //   0,
    //   0,
    //   this._width,
    //   this._height
    // );
    // this.renderCamera(
    //   scene,
    //   this._cameraB,
    //   this._width / 2,
    //   0,
    //   this._width / 2,
    //   this._height,
    //   0,
    //   0,
    //   this._width,
    //   this._height
    // );
    // 全展示
    this.renderCamera(
      scene,
      this._cameraA,
      0,
      0,
      this._width,
      this._height,
      0,
      0,
      this._width,
      this._height
    );
  }
}
module.exports = CameraEffect;