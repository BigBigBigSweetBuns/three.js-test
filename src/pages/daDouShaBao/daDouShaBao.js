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

    scope.cameraDistance = 50;
    scope.reflectFromAbove = false;

    // Internals
    let _halfWidth, _width, _height;

    //const _cameraF = new THREE.OrthographicCamera(); //front
    const _cameraB = new THREE.OrthographicCamera(-1, 1, 0, -2, 1, 4);
    //const _cameraB = new THREE.OrthographicCamera(); //back
    const _cameraF = new THREE.OrthographicCamera(-1, 1, 2, 0, 4, 6);

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
      function setCamera(camera) {
        camera.position.copy(_position);
        camera.quaternion.copy(_quaternion);
        camera.translateZ(scope.cameraDistance);
        camera.lookAt(scene.position);
      }
      setCamera(_cameraB);
      setCamera(_cameraF);

      renderer.clear();
      renderer.setScissorTest(true);

      function render(scene, camera, x, y, width, height) {
        renderer.render(scene, camera);
        renderer.setScissor(x, y, width, height);
        renderer.setViewport(x, y, width, height);
      }

      render(scene, _cameraF, _halfWidth - _width / 2, 0, _width, _height);
      render(
        scene,
        _cameraB,
        _halfWidth - _width / 2,
        _height,
        _width,
        _height
      );
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
    var z_plus = 2;

    // Add Points Boxs
    const initialPoints = [
      { x: 0.353, y: -0.5, z: 0.353 },
      { x: 0.5, y: 0, z: 0.5 },
      { x: 0.353, y: 0.5, z: 0.353 },
      { x: 0, y: 0.707, z: 0 },
      { x: -0.353, y: 0.5, z: -0.353 },
      { x: -0.5, y: 0, z: -0.5 },
      { x: -0.353, y: -0.5, z: -0.353 },
      { x: 0, y: -0.707, z: 0 },
    ];

    const initialPoints2 = [
      { x: 0.353, y: -0.5, z: 0.647 + z_plus },
      { x: 0.5, y: 0, z: 0.5 + z_plus },
      { x: 0.353, y: 0.5, z: 0.647 + z_plus },
      { x: 0, y: 0.707, z: 1 + z_plus },
      { x: -0.353, y: 0.5, z: 1.353 + z_plus },
      { x: -0.5, y: 0, z: 1.5 + z_plus },
      { x: -0.353, y: -0.5, z: 1.343 + z_plus },
      { x: 0, y: -0.707, z: 1 + z_plus },
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
          const geometry = new THREE.TextGeometry("DaDouShaBao", {
            font: font,
            size: 0.23,
            height: 0.25,
            curveSegments: 20,
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

        const rotateX1 = Math.PI * (0 + 1 / 4);
        const rotateX2 = Math.PI * (1 / 2 + 1 / 4);
        // 添加两个文字
        flow = initFlow(initFont(0, -0.11, -0.11, rotateX1), curve);
        flow2 = initFlow(initFont(-2.2, -0.11, -0.11, rotateX2), curve);
        flow3 = initFlow(initFont(0, -0.11, -0.11, rotateX1), curve2);
        flow4 = initFlow(initFont(-2.24, -0.11, -0.11, rotateX2), curve2);
        scene.add(flow.object3D);
        scene.add(flow2.object3D);
        scene.add(flow3.object3D);
        scene.add(flow4.object3D);
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

  function animate() {
    requestAnimationFrame(animate);

    if (flow) {
      flow.moveAlongCurve(-0.001);
      flow2.moveAlongCurve(-0.001);
      flow3.moveAlongCurve(-0.001);
      flow4.moveAlongCurve(-0.001);
    }
    effect.render(scene, camera);
  }

  init();
  animate();
};
