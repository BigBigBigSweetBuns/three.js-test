import React from "react";

const THREE = (window.THREE = require("three"));

require("three/examples/js/loaders/GLTFLoader");
require("three/examples/js/loaders/DRACOLoader");
require("three/examples/js/loaders/DDSLoader");
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/controls/TrackballControls");
require("three/examples/js/loaders/RGBELoader");
require("three/examples/js/loaders/HDRCubeTextureLoader");
require("three/examples/js/pmrem/PMREMGenerator");
require("three/examples/js/pmrem/PMREMCubeUVPacker");

THREE.DRACOLoader.setDecoderPath("lib/draco/");

class Three3D extends React.Component {
  state = { threeConf: this.props.threeConf };

  componentDidMount() {
    let container, mixer, controls;
    let camera, scene, renderer, light;
    // 定义three中的动画时间
    let clock = new THREE.Clock();

    let threeConf = this.state.threeConf;
    container = document.createElement("div");
    this.mount.appendChild(container);
    container = this.mount;
    let width = this.mount.clientWidth;
    let height = this.mount.clientHeight;
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    container.addEventListener(
      "resize",
      () => {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      },
      false
    );

    // 环境设置，设置之后可以反射周围环境
    let envMap = new THREE.CubeTextureLoader().load([
      "/images/sys/three3d/envmappic/posx.jpg",
      "/images/sys/three3d/envmappic/negx.jpg",
      "/images/sys/three3d/envmappic/posy.jpg",
      "/images/sys/three3d/envmappic/negy.jpg",
      "/images/sys/three3d/envmappic/posz.jpg",
      "/images/sys/three3d/envmappic/negz.jpg",
    ]);
    scene = new THREE.Scene();

    // 添加光线
    light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light.position.set(0, 1, 0);
    scene.add(light);

    // 新建loader,加载gltf文件
    let loader = new THREE.GLTFLoader();
    loader.load(threeConf.model, (gltf) => {
      const gltfScene = gltf.scene || gltf.scenes[0];
      const clips = gltf.animations || [];
      gltfScene.updateMatrixWorld();
      const box = new THREE.Box3().setFromObject(gltfScene);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      // controls.reset();

      gltfScene.position.x += gltfScene.position.x - center.x;
      gltfScene.position.y += gltfScene.position.y - center.y;
      gltfScene.position.z += gltfScene.position.z - center.z;

      // 重新设置相机参数
      controls.maxDistance = size * 10;
      camera.near = size / 100;
      camera.far = size * 100;
      camera.updateProjectionMatrix();

      camera.position.copy(center);
      camera.position.x += size / 2.0;
      camera.position.y += size / 2.0;
      camera.position.z += size / 2.0;
      camera.lookAt(center);

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.envMap = envMap;
        }
      });
      scene.add(gltf.scene);
      // 判断当前的gltf问价中是否有动画
      if (clips.length !== 0) {
        mixer = new THREE.AnimationMixer(gltfScene);
        mixer.clipAction(gltf.animations[0]).play();
      } else {
      }
    });
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(container.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.gammaOutput = true;

    controls = new THREE.OrbitControls(camera, container);
    //按键控制
    controls.enableKeys = false;
    // 自动旋转（默认flase）
    controls.autoRotate = false;
    container.appendChild(renderer.domElement);
    container.addEventListener("resize", this.onWindowResize, false);

    requestAnimationFrame(function fn() {
      if (mixer) {
        let delta = clock.getDelta();
        mixer.update(delta);
      }
      requestAnimationFrame(fn);
      renderer.render(scene, camera);
      controls.update();
    });
  }

  onWindowResize = () => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  render() {
    let style = { width: "100%", height: "100%" };
    return (
      <div
        style={style}
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}
export default Three3D;
