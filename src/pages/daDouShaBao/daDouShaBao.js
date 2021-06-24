// import * as THREE from "../build/three.module.js";
// import { TransformControls } from "./jsm/controls/TransformControls.js";
// import Stats from "./jsm/libs/stats.module.js";
// import { Flow } from "./jsm/modifiers/CurveModifier.js";

const THREE = require("three");
const TransformControls = require("three/examples/jsm/modifiers/CurveModifier");
const Flow = TransformControls.Flow;

class PeppersGhostEffect {
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

window.onload = () => {
  let scene, camera, renderer, flow, flow2, flow3, flow4, effect;

  function init() {
    scene = new THREE.Scene();

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Add Points Boxs
    const basePI = (45 * Math.PI) / 180;
    // 这是个园⚪
    // x,y轴的园
    const initialPoints = [
      { x: 0, y: -0.5, z: 0 },
      {
        x: -0.5 * Math.cos(basePI),
        y: -0.5 * Math.sin(basePI),
        z: 0,
      },
      { x: -0.5, y: 0, z: 0 },
      {
        x: -0.5 * Math.cos(basePI),
        y: +0.5 * Math.sin(basePI),
        z: 0,
      },
      { x: 0.0, y: 0.5, z: 0 },
      {
        x: +0.5 * Math.cos(basePI),
        y: +0.5 * Math.sin(basePI),
        z: 0,
      },
      { x: 0.5, y: 0.0, z: 0 },
      {
        x: +0.5 * Math.cos(basePI),
        y: -0.5 * Math.sin(basePI),
        z: 0,
      },
    ];
    // 垂直方向
    // y,z轴的园
    const initialPoints2 = [
      { x: 0, y: -0.5, z: 0 },
      {
        x: 0,
        y: -0.5 * Math.sin(basePI),
        z: -0.5 * Math.cos(basePI),
      },
      { x: 0, y: 0, z: -0.5 },
      {
        x: 0,
        y: +0.5 * Math.sin(basePI),
        z: -0.5 * Math.cos(basePI),
      },
      { x: 0.0, y: 0.5, z: 0 },
      {
        x: 0,
        y: +0.5 * Math.sin(basePI),
        z: +0.5 * Math.cos(basePI),
      },
      { x: 0, y: 0.0, z: 0.5 },
      {
        x: 0,
        y: -0.5 * Math.sin(basePI),
        z: +0.5 * Math.cos(basePI),
      },
    ];

    function initMesh(initialPoints, width, height, depth) {
      const arr = [];
      const boxGeometry = new THREE.BoxGeometry(width, height, depth);
      const boxMaterial = new THREE.MeshBasicMaterial();
      for (const handlePos of initialPoints) {
        const handle = new THREE.Mesh(boxGeometry, boxMaterial);
        handle.position.copy(handlePos);
        arr.push(handle);
      }
      return arr;
    }

    // add Curve

    function initCurve(curveHandles) {
      const curve = new THREE.CatmullRomCurve3(
        curveHandles.map((handle) => handle.position)
      );
      curve.curveType = "centripetal";
      curve.closed = true;
      return curve;
    }

    const curve = initCurve(initMesh(initialPoints, 0.1, 0.1, 0.1));
    const curve2 = initCurve(initMesh(initialPoints2, 0.1, 0.1, 0.1));

    // Add line
    const points = curve.getPoints(50);
    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
    scene.add(line);

    // add Light
    function initDirectionalLight(x, y, z, color = 0xffaa33, intensity = 1.0) {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(x, y, z);
      return light;
    }
    // 点光
    scene.add(initDirectionalLight(10, 0, 0, 0xffaa33));
    scene.add(initDirectionalLight(0, 0, 0, 0xffaa33));
    // 环境光
    scene.add(new THREE.AmbientLight(0x003973));

    // add Text

    const loader = new THREE.FontLoader();

    loader.load(
      "./public/fonts/helvetiker_bold.typeface.json",
      function (font) {
        const initFont = function (x = 0, y = 0, z = 0, rotateX = 0) {
          const geometry = new THREE.TextGeometry("DouShaBao", {
            font: font,
            size: 0.2,
            height: 0.2,
            curveSegments: 50,
            bevelEnabled: false,
          });
          geometry.translate(x, y, z);
          geometry.rotateX(rotateX);
          return geometry;
        };
        function initFlow(geometry, curve) {
          const material = new THREE.MeshStandardMaterial({
            color: 0x99ffff,
          });
          const objectToCurve = new THREE.Mesh(geometry, material);
          const tempFlow = new Flow(objectToCurve);
          tempFlow.updateCurve(0, curve);
          return tempFlow;
        }

        const rotateX1 = Math.PI * 0;
        const rotateX2 = (Math.PI * 1) / 2;
        const rotateX3 = Math.PI * 1;
        const rotateX4 = -(Math.PI * 1) / 2;
        // const rotateX1 = 0;
        // const rotateX2 = 90;

        // 添加两个文字
        flow = initFlow(initFont(0, -0.1, -0.1, rotateX1), curve);
        flow2 = initFlow(initFont(-1.55, -0.1, -0.1, rotateX2), curve);
        flow3 = initFlow(initFont(0, -0.1, -0.1, rotateX3), curve);
        flow4 = initFlow(initFont(-1.55, -0.1, -0.1, rotateX4), curve);
        scene.add(flow.object3D);
        scene.add(flow2.object3D);
        // scene.add(flow3.object3D);
        // scene.add(flow4.object3D);
      }
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowWidth, windowHeight);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // 添加相机
    effect = new PeppersGhostEffect(renderer);
    effect.setSize(windowWidth, windowHeight);
    effect.cameraDistance = 5;
  }

  const speedInt = 2; // 需要相加后等于 speedHundred*2
  const speedHundred = 1000;
  const speed = speedInt / speedHundred; // 速度得是小数，但js小数相加会失真
  let n = 0;
  let bool = false;
  function animate() {
    // 最高帧率60
    requestAnimationFrame(animate);

    n = speedInt + n;

    if (flow) {
      if (n % (speedHundred * 2) === 0) {
        // 因为需要旋转两圈
        bool = !bool;
        if (!bool) {
          // 删除和添加
          scene.remove(flow3.object3D);
          scene.remove(flow4.object3D);
          scene.add(flow.object3D);
          scene.add(flow2.object3D);
        } else {
          scene.remove(flow.object3D);
          scene.remove(flow2.object3D);
          scene.add(flow3.object3D);
          scene.add(flow4.object3D);
        }
      }
      if (!bool) {
        flow.moveAlongCurve(speed);
        flow2.moveAlongCurve(speed);
      } else {
        flow3.moveAlongCurve(speed);
        flow4.moveAlongCurve(speed);
      }
    }
    effect.render(scene, camera);
  }

  init();
  animate();
};
class text {
  text; //
  flow; // 0%
  flow2; // 90%
  flow3; // 180%
  flow4; // 270%
  constructor(text, color = 0x99ffff) {
    this.text = text;
    this.color = color;
    this.textGeometry = this.initText();
    this.textGeometry2 = this.initText();
    this.textGeometry3 = this.initText();
    this.textGeometry4 = this.initText();
  }
  // x,y轴的圆
  pointsXY(size = 0.5) {
    const basePI = (45 * Math.PI) / 180;
    return [
      { x: 0, y: -size, z: 0 },
      {
        x: -size * Math.cos(basePI),
        y: -size * Math.sin(basePI),
        z: 0,
      },
      { x: -size, y: 0, z: 0 },
      {
        x: -size * Math.cos(basePI),
        y: +size * Math.sin(basePI),
        z: 0,
      },
      { x: 0.0, y: size, z: 0 },
      {
        x: +size * Math.cos(basePI),
        y: +size * Math.sin(basePI),
        z: 0,
      },
      { x: size, y: 0.0, z: 0 },
      {
        x: +size * Math.cos(basePI),
        y: -size * Math.sin(basePI),
        z: 0,
      },
    ];
  }
  // y,z轴的圆
  pointsYZ(size = 0.5) {
    return [
      { x: 0, y: -size, z: 0 },
      {
        x: 0,
        y: -size * Math.sin(basePI),
        z: -size * Math.cos(basePI),
      },
      { x: 0, y: 0, z: -size },
      {
        x: 0,
        y: +size * Math.sin(basePI),
        z: -size * Math.cos(basePI),
      },
      { x: 0.0, y: size, z: 0 },
      {
        x: 0,
        y: +size * Math.sin(basePI),
        z: +size * Math.cos(basePI),
      },
      { x: 0, y: 0.0, z: size },
      {
        x: 0,
        y: -size * Math.sin(basePI),
        z: +size * Math.cos(basePI),
      },
    ];
  }
  initMesh(initialPoints, width, height, depth) {
    const arr = [];
    const boxGeometry = new THREE.BoxGeometry(width, height, depth);
    const boxMaterial = new THREE.MeshBasicMaterial();
    for (const handlePos of initialPoints) {
      const handle = new THREE.Mesh(boxGeometry, boxMaterial);
      handle.position.copy(handlePos);
      arr.push(handle);
    }
    return arr;
  }
  initCurve(curveHandles) {
    const curve = new THREE.CatmullRomCurve3(
      curveHandles.map((handle) => handle.position)
    );
    curve.curveType = "centripetal";
    curve.closed = true;
    return curve;
  }
  initFont(text) {
    loader.load(
      "./public/fonts/helvetiker_bold.typeface.json",
      function (font) {
        const geometry = new THREE.TextGeometry(text, {
          font: font,
          size: 0.2,
          height: 0.2,
          curveSegments: 50,
          bevelEnabled: false,
        });
        return geometry;
      }
    );
  }
  initText(geometry, x, y, z, rotateX) {
    geometry.translate(x, y, z);
    geometry.rotateX(rotateX);
    return geometry;
  }
  initFlow(geometry, curve) {
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
    });
    const objectToCurve = new THREE.Mesh(geometry, material);
    const tempFlow = new Flow(objectToCurve);
    tempFlow.updateCurve(0, curve);
    return tempFlow;
  }

  //   const rotateX1 = Math.PI * 0;
  //   const rotateX2 = (Math.PI * 1) / 2;
  //   const rotateX3 = Math.PI * 1;
  //   const rotateX4 = -(Math.PI * 1) / 2;
  //   // const rotateX1 = 0;
  //   // const rotateX2 = 90;

  //   // 添加两个文字
  //   flow = initFlow(initFont(0, -0.1, -0.1, rotateX1), curve);
  //   flow2 = initFlow(initFont(-1.55, -0.1, -0.1, rotateX2), curve);
  //   flow3 = initFlow(initFont(0, -0.1, -0.1, rotateX3), curve);
  //   flow4 = initFlow(initFont(-1.55, -0.1, -0.1, rotateX4), curve);
  //   scene.add(flow.object3D);
  //   scene.add(flow2.object3D);
  //   // scene.add(flow3.object3D);
  //   // scene.add(flow4.object3D);
  // }
}
// class textGroup {
//   constructor() {}
// }
// var textGroup = new textGroup();
