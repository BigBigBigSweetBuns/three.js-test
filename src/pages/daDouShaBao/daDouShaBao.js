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
      function setCamera(camera,x=0,y=0,z=0) {
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
        camera.lookAt(scene.position);
      }
      setCamera(_cameraA,-3,0,3);
      // setCamera(_cameraA,3,0,3);
      setCamera(_cameraB,3,0,3);
      setCamera(_cameraC,3,0,3);
      setCamera(_cameraD,-3,0,3);

      renderer.clear();
      renderer.setScissorTest(true);

      function render(scene, camera, x, y, width, height,_x,_y,_width,_height) {
        renderer.render(scene, camera);
        renderer.setScissor(x, y, width, height);
        renderer.setViewport(_x, _y, _width, _height);
      }
      // _cameraF.position(0, 0, 5);
      render(scene, _cameraA, _width, 150, 250, 250,_width,0,_width,_height); // 在屏幕的上半部分 
      render(scene, _cameraB, _width+250, 0, 250, 250,_width,0,_width,_height); // 在屏幕的上半部分 
      render(scene, _cameraC, _width, 0, 250, 250,_width,0,_width,_height); // 在屏幕的上半部分 
      render(
        scene,
        _cameraD,
         _width+250,
        0,
        250,
        500,
        _width,
        0,
        _width,
        _height,
      ); // 在屏幕的下半部分
      renderer.setScissorTest(false);
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
        // 添加两个文字
        flow = initFlow(initFont(0, -0.1, -0.1, rotateX1), curve);
        flow2 = initFlow(initFont(-1.55, -0.1, -0.1, rotateX2), curve);
        // flow2 = initFlow(initFont(-2.2, -0.11, -0.11, rotateX2), curve);
        // flow3 = initFlow(initFont(0, -0.11, -0.11, rotateX1), curve2);
        // flow4 = initFlow(initFont(-2.2, -0.11, -0.11, rotateX2), curve2);
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

  const speed = 0.001;
  function animate() {
    requestAnimationFrame(animate);

    if (flow) {
      flow.moveAlongCurve(-speed);
      flow2.moveAlongCurve(-speed);
      // flow3.moveAlongCurve(-speed);
      // flow4.moveAlongCurve(-speed);
    }
    effect.render(scene, camera);
  }

  init();
  animate();
};
