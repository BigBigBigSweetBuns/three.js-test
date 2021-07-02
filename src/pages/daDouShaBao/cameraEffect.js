const THREE = require("three");

class CameraEffect {
  constructor(renderer) {
    const scope = this;

    scope.cameraDistance = 10;
    scope.reflectFromAbove = false;

    // Internals
    let _halfWidth, _width, _height;

    //const _cameraB = new THREE.OrthographicCamera(); //front
    const _cameraA = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    const _cameraB = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    const _cameraC = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    const _cameraD = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20); // 初始化相机
    //const _cameraF = new THREE.OrthographicCamera(); //back

    const _position = new THREE.Vector3();
    const _quaternion = new THREE.Quaternion();

    // Initialization
    renderer.autoClear = false;

    this.setSize = function (width, height) {
      _halfWidth = width / 2;
      if (width < height) {
        _width = width / 2;
        _height = width / 2;
      } else {
        _width = height / 2;
        _height = height / 2;
      }

      renderer.setSize(width, height);
    };

    this.render = function (scene, camera) {
      scene.updateMatrixWorld();

      // if (camera.parent === null) camera.updateMatrixWorld();

      // camera.matrixWorld.decompose(_position, _quaternion, _scale);

      // front

      // back
      function setCamera(camera, x = 0, y = 0, z = 0) {
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
        camera.lookAt(scene.position);
      }

      setCamera(_cameraA, 0, 0, 3); // 左上角 正面
      setCamera(_cameraB, 3, 0, 0); // 左上角 正面
      // setCamera(_cameraA, 3, 0, 3); // 左上角 正面
      // setCamera(_cameraB, -3, 0, 3); // 左下角 背面
      // setCamera(_cameraC, -3, 0, 3); // 右上角 背面
      // setCamera(_cameraD, 3, 0, 3); // 右下角 正面面

      renderer.clear();
      renderer.setScissorTest(true);

      // x,y的起点为左下角，并非左上角
      function render(
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
        renderer.setScissor(x, y, width, height);
        renderer.setViewport(_x, _y, _width, _height);
        renderer.render(scene, camera);
      }
      const viewWidth = 400;
      const viewHeight = 400;
      // 尝试正面显示全部
      // render(scene, _cameraA, 100, 210, 100, 130, 0, 0, viewWidth, viewHeight); // 上 左
      // render(scene, _cameraB, 100, 80, 100, 130, 0, 0, viewWidth, viewHeight); // 下 左
      // render(scene, _cameraC, 200, 210, 100, 130, 0, 0, viewWidth, viewHeight); // 上 右
      // render(scene, _cameraD, 200, 80, 100, 130, 0, 0, viewWidth, viewHeight); // 下 右
      // 全显示
      render(scene, _cameraA, 0, 0, _width, _height, 0, 0, _width, _height);
      render(
        scene,
        _cameraB,
        _width,
        0,
        _width,
        _height,
        _width,
        0,
        _width,
        _height
      );
    };
  }
}
module.exports = CameraEffect;
