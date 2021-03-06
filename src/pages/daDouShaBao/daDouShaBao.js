const THREE = require("three");
const TransformControls = require("three/examples/jsm/modifiers/CurveModifier");
const Flow = TransformControls.Flow;
const CameraEffect = require("./cameraEffect");
const TextGroup = require("./font");

let scene, camera, renderer, flow1, flow2, flow3, flow4, effect;
let tFlow1, tFlow2, tFlow3, tFlow4;

async function init() {
  scene = new THREE.Scene();

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // add Light
  function initDirectionalLight(x, y, z, color = 0xffaa33, intensity = 1.0) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    return light;
  }
  // 添加背景颜色
  // scene.background = new THREE.(0, 0, 0, 0);
  // 点光
  scene.add(initDirectionalLight(10, 0, 0, 0xffaa33));
  scene.add(initDirectionalLight(-10, 0, 0, 0xffaa33, 0.7));
  scene.add(initDirectionalLight(0, 10, 0, 0xffaa33, 0.3));
  scene.add(initDirectionalLight(0, -10, 0, 0xffaa33, 0.3));
  scene.add(initDirectionalLight(0, 0, 20, 0xffaa33, 0.3));
  scene.add(initDirectionalLight(0, 0, -20, 0xffaa33, 0.3));
  // 环境光
  scene.add(new THREE.AmbientLight(0x003973));

  // add Text
  const textGroup = new TextGroup("DPPPPPPPP");
  await textGroup.init();
  textGroup.initLine();
  flow1 = textGroup.flow;
  flow1.moveAlongCurve(0.25);
  flow2 = textGroup.flow2;
  flow2.moveAlongCurve(0.75);
  flow3 = textGroup.flow3;
  flow3.moveAlongCurve(0.25);
  flow4 = textGroup.flow4;
  flow4.moveAlongCurve(0.75);
  scene.add(flow1.object3D);
  scene.add(flow2.object3D);
  // add Text2
  const textPosition = { x: 0, y: 0, z: 0 };
  const textGroup2 = new TextGroup("DPPPPPPPP", textPosition, "down");
  await textGroup2.init();
  textGroup2.initLine(0xffffff);
  tFlow1 = textGroup2.flow;
  tFlow1.moveAlongCurve(0.75);
  tFlow2 = textGroup2.flow2;
  tFlow2.moveAlongCurve(0.25);
  tFlow3 = textGroup2.flow3;
  tFlow3.moveAlongCurve(0.75);
  tFlow4 = textGroup2.flow4;
  tFlow4.moveAlongCurve(0.25);
  scene.add(tFlow1.object3D);
  scene.add(tFlow2.object3D);
  // add line
  scene.add(textGroup.line);
  scene.add(textGroup2.line);

  // 辅助坐标系
  var axisHelper = new THREE.AxisHelper(4);
  // scene.add(axisHelper);


  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(windowWidth, windowHeight);
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // 添加相机
  effect = new CameraEffect(scene, renderer, windowWidth, windowHeight);
}

// 一圈为1000(speedHundred)
const speedHundred = 1000;
const speedInt = 1; // 需要相加后等于 speedHundred*2
const speed = speedInt / speedHundred; // 速度得是小数，但js小数相加会失真

window.onload = async() => {
  let n = 0; // 记录当前旋转的角度,一圈 = speedHundred
  function animate() {
    // 最高帧率60
    requestAnimationFrame(animate);

    n = speedInt + n;

    // 每180度切换显示
    const pan = n % (2 * speedHundred);
    if (pan === 250) {
      scene.remove(flow1.object3D);
      scene.add(flow3.object3D);
    } else if (pan === 750) {
      scene.remove(flow2.object3D);
      scene.add(flow4.object3D);
    } else if (pan === 1250) {
      scene.add(flow1.object3D);
      scene.remove(flow3.object3D);
    } else if (pan === 1750) {
      scene.add(flow2.object3D);
      scene.remove(flow4.object3D);
    }
    // 第二组
    if (pan === 250) {
      scene.remove(tFlow1.object3D);
      scene.add(tFlow3.object3D);
    } else if (pan === 750) {
      scene.add(tFlow4.object3D);
      scene.remove(tFlow2.object3D);
    } else if (pan === 1250) {
      scene.add(tFlow1.object3D);
      scene.remove(tFlow3.object3D);
    } else if (pan === 1750) {
      scene.remove(tFlow4.object3D);
      scene.add(tFlow2.object3D);
    }
    // 记录角度
    flow1.moveAlongCurve(speed);
    flow2.moveAlongCurve(speed);
    flow3.moveAlongCurve(speed);
    flow4.moveAlongCurve(speed);

    tFlow1.moveAlongCurve(speed);
    tFlow2.moveAlongCurve(speed);
    tFlow3.moveAlongCurve(speed);
    tFlow4.moveAlongCurve(speed);

    effect.render(scene, camera);
  }

  await init();
  animate();
  // effect.render(scene, camera);
};