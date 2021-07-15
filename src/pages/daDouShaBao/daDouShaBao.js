// import * as THREE from "../build/three.module.js";
// import { TransformControls } from "./jsm/controls/TransformControls.js";
// import Stats from "./jsm/libs/stats.module.js";
// import { Flow } from "./jsm/modifiers/CurveModifier.js";

const THREE = require("three");
const TransformControls = require("three/examples/jsm/modifiers/CurveModifier");
const Flow = TransformControls.Flow;
const CameraEffect = require("./cameraEffect");
const TextGroup = require("./font");

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

async function init() {
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
  const textGroup = new TextGroup("PPPPPPPP");
  await textGroup.init();
  flow = textGroup.flow;
  flow2 = textGroup.flow2;
  flow3 = textGroup.flow3;
  flow4 = textGroup.flow4;
  scene.add(flow.object3D);
  scene.add(flow2.object3D);

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

// 一圈为1000(speedHundred)
const speedHundred = 1000;
const speedInt = 2; // 需要相加后等于 speedHundred*2
const speed = speedInt / speedHundred; // 速度得是小数，但js小数相加会失真
let rotate = 0;
let rotate2 = speedHundred / 2;
let rotate3 = 0;
let rotate4 = 0;
window.onload = async () => {
  let n = 0;
  let bool = false;
  function animate() {
    // 最高帧率60
    requestAnimationFrame(animate);

    n = speedInt + n;

    // 需要保证在右方的字体保持显示，直到移动到左方
    if (flow) {
      // 因为需要旋转两圈
      // console.log("rotate", rotate);
      console.log("rotate", rotate % speedHundred);
      if (rotate % speedHundred === 500) {
        console.log("a2");
        scene.remove(flow.object3D);
      } else if (rotate % speedHundred === 0) {
        console.log("a3");
        scene.add(flow.object3D);
      }
    }
    // 记录角度
    if (!bool) {
      flow.moveAlongCurve(speed);
      rotate += speedInt;
      flow2.moveAlongCurve(speed);
      rotate2 += speedInt;
    } else {
      flow3.moveAlongCurve(speed);
      flow4.moveAlongCurve(speed);
    }
    effect.render(scene, camera);
  }

  await init();
  animate();
};
