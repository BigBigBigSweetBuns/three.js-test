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
  constructor(renderer, width, height) {
    // Initialization
    this.renderer = renderer;
    this.initWindowSize(width, height);
    // 设置镜头
    //const _cameraB = new THREE.OrthographicCamera(); //front
    this._cameraA = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    this._cameraB = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    this._cameraC = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    this._cameraD = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    //const _cameraF = new THREE.OrthographicCamera(); //back
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
  setCamera(
    camera,
    x = 0,
    y = 0,
    z = 0,
    position = new THREE.Vector3(0, 0, 0)
  ) {
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(position);
  }
  render(scene, camera) {
    scene.updateMatrixWorld();
    // this.setCamera(_cameraA, 0, 0, 3,scene.position); // 左上角 正面
    // this.setCamera(_cameraB, 3, 0, 0,scene.position); // 左上角 正面
    this.setCamera(this._cameraA, -3, 0, 3, scene.position); // 左上角 正面
    this.setCamera(this._cameraB, 10 + 3, 0, 3, new THREE.Vector3(10, 0, 0)); // 左下角 背面
    // this.setCamera(this._cameraC, -3, 0, 3, scene.position); // 右上角 背面
    // this.setCamera(this._cameraD, 3, 0, 3, scene.position); // 右下角 正面面

    this.renderer.clear();
    this.renderer.setScissorTest(true);

    const viewWidth = 400;
    const viewHeight = 400;
    // 尝试正面显示全部
    // render(scene, this._cameraA, 100, 210, 100, 130, 0, 0, viewWidth, viewHeight); // 上 左
    // render(scene, this._cameraB, 100, 80, 100, 130, 0, 0, viewWidth, viewHeight); // 下 左
    // render(scene,this._cameraC, 200, 210, 100, 130, 0, 0, viewWidth, viewHeight); // 上 右
    // render(scene, this._cameraD, 200, 80, 100, 130, 0, 0, viewWidth, viewHeight); // 下 右
    // 显示一半
    this.renderCamera(
      scene,
      this._cameraA,
      0,
      0,
      this._width / 2,
      this._height,
      0,
      0,
      this._width,
      this._height
    );
    this.renderCamera(
      scene,
      this._cameraB,
      this._width / 2,
      0,
      this._width / 2,
      this._height,
      0,
      0,
      this._width,
      this._height
    );
    // 全显示
    // this.renderCamera(scene, this._cameraA, 0, 0, this._width, this._height, 0, 0, this._width, this._height);
    // this.renderCamera(
    //   scene,
    //   this._cameraB,
    //   this._width,
    //   0,
    //   this._width,
    //   this._height,
    //   this._width,
    //   0,
    //   this._width,
    //   this._height
    // );
  }
  // x,y的起点为左下角，并非左上角
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
    this.renderer.render(scene, camera);
  }
}
module.exports = CameraEffect;
