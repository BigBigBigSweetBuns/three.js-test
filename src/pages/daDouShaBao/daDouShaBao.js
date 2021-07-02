// import * as THREE from "../build/three.module.js";
// import { TransformControls } from "./jsm/controls/TransformControls.js";
// import Stats from "./jsm/libs/stats.module.js";
// import { Flow } from "./jsm/modifiers/CurveModifier.js";

const THREE = require("three");
const TransformControls = require("three/examples/jsm/modifiers/CurveModifier");
const Flow = TransformControls.Flow;
// const TextGroup = require("./font.js");
// var textGroup = new TextGroup();
const CameraEffect = require("./cameraEffect");

let scene, camera, renderer, flow, flow2, flow3, flow4, effect;
class InitCurve {
  curve;
  curve2;
  basePI = (45 * Math.PI) / 180;
  // x,y轴的园
  points1;
  // y,z轴的园
  points2;
  constructor() {
    this.points1 = [
      { x: 0, y: -0.5, z: 0 },
      {
        x: -0.5 * Math.cos(this.basePI),
        y: -0.5 * Math.sin(this.basePI),
        z: 0,
      },
      { x: -0.5, y: 0, z: 0 },
      {
        x: -0.5 * Math.cos(this.basePI),
        y: +0.5 * Math.sin(this.basePI),
        z: 0,
      },
      { x: 0.0, y: 0.5, z: 0 },
      {
        x: +0.5 * Math.cos(this.basePI),
        y: +0.5 * Math.sin(this.basePI),
        z: 0,
      },
      { x: 0.5, y: 0.0, z: 0 },
      {
        x: +0.5 * Math.cos(this.basePI),
        y: -0.5 * Math.sin(this.basePI),
        z: 0,
      },
    ];
    this.points2 = [
      { x: 0, y: -0.5, z: 0 },
      {
        x: 0,
        y: -0.5 * Math.sin(this.basePI),
        z: -0.5 * Math.cos(this.basePI),
      },
      { x: 0, y: 0, z: -0.5 },
      {
        x: 0,
        y: +0.5 * Math.sin(this.basePI),
        z: -0.5 * Math.cos(this.basePI),
      },
      { x: 0.0, y: 0.5, z: 0 },
      {
        x: 0,
        y: +0.5 * Math.sin(this.basePI),
        z: +0.5 * Math.cos(this.basePI),
      },
      { x: 0, y: 0.0, z: 0.5 },
      {
        x: 0,
        y: -0.5 * Math.sin(this.basePI),
        z: +0.5 * Math.cos(this.basePI),
      },
    ];
    this.curve = this.initCurve(this.initMesh(this.points1, 0.1, 0.1, 0.1));
    this.curve = this.initCurve(this.initMesh(this.points2, 0.1, 0.1, 0.1));
  }
  initMesh(points, width, height, depth) {
    const arr = [];
    const boxGeometry = new THREE.BoxGeometry(width, height, depth);
    const boxMaterial = new THREE.MeshBasicMaterial();
    for (const handlePos of points) {
      const handle = new THREE.Mesh(boxGeometry, boxMaterial);
      handle.position.copy(handlePos);
      arr.push(handle);
    }
    return arr;
  }
  // add Curve
  initCurve(curveHandles) {
    const curve = new THREE.CatmullRomCurve3(
      curveHandles.map((handle) => handle.position)
    );
    curve.curveType = "centripetal";
    curve.closed = true;
    return curve;
  }
}

function init() {
  scene = new THREE.Scene();

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const initCurve = new InitCurve();
  const curve = initCurve.curve;
  const curve2 = initCurve.curve2;

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

  loader.load("./public/fonts/helvetiker_bold.typeface.json", function (font) {
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
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(windowWidth, windowHeight);
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // 添加相机
  effect = new CameraEffect(renderer);
  effect.setSize(windowWidth, windowHeight);
  effect.cameraDistance = 5;
}

window.onload = () => {
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
