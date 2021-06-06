
// import * as THREE from "../build/three.module.js";
// import { TransformControls } from "./jsm/controls/TransformControls.js";
// import Stats from "./jsm/libs/stats.module.js";
// import { Flow } from "./jsm/modifiers/CurveModifier.js";

const THREE = require("three");
const TransformControls = require("three/examples/jsm/modifiers/CurveModifier");
const Flow = TransformControls.Flow;

const json = require("three/examples/fonts/helvetiker_regular.typeface.json");


class PeppersGhostEffect {
    constructor(renderer) {

        const scope = this;

        scope.cameraDistance = 5;
        scope.reflectFromAbove = false;

        // Internals
        let _halfWidth, _width, _height;

        const _cameraF = new THREE.OrthographicCamera(); //front
        // const _cameraF = new OrthographicCamera(0, 2, 0, -2, 1, 7.5);
        const _cameraB = new THREE.OrthographicCamera(); //back
        // const _cameraB = new THREE.OrthographicCamera(0, 2, 0, -2, 1, 7.5);

        const _position = new THREE.Vector3();
        const _quaternion = new THREE.Quaternion();
        const _scale = new THREE.Vector3();

        // Initialization
        renderer.autoClear = false;

        this.setSize = function (width, height) {

            _halfWidth = width / 2;
            if (width < height) {

                _width = width / 3;
                _height = width / 3;

            } else {

                _width = height / 3;
                _height = height / 3;

            }

            renderer.setSize(width, height);

        };

        this.render = function (scene, camera) {

            scene.updateMatrixWorld();

            // if (camera.parent === null) camera.updateMatrixWorld();

            // camera.matrixWorld.decompose(_position, _quaternion, _scale);

            function cameraF(camera) {
                camera.position.copy(_position);
                camera.quaternion.copy(_quaternion);
                camera.translateZ(scope.cameraDistance);
                camera.lookAt(scene.position);
            }
            cameraF(_cameraF);
            // front


            // back
            function cameraB(camera) {
                camera.position.copy(_position);
                camera.quaternion.copy(_quaternion);
                camera.translateZ(- (scope.cameraDistance));
                camera.lookAt(scene.position);
                // camera.rotation.z += 180 * (Math.PI / 180);
            }
            cameraB(_cameraB);

            renderer.clear();
            renderer.setScissorTest(true);

            function render(scene, camera, x, y, width, height) {
                renderer.render(scene, camera);
                renderer.setScissor(x, y, width, height);
                renderer.setViewport(x, y, width, height);
            }

            render(scene, _cameraB, _halfWidth - (_width / 2), 0, _width, _height)
            render(scene, _cameraF, _halfWidth - (_width / 2) - _width, _height, _width, _height)
            // render(scene, _cameraB, 0, 0, _width, _height)
            // render.setClearColor(0x0000ff, 1);
            renderer.setScissorTest(false);
        };
    }
}

window.onload = () => {

    const ACTION_SELECT = 1,
        ACTION_NONE = 0;
    const curveHandles = [];
    const mouse = new THREE.Vector2();

    let scene,
        camera,
        renderer,
        flow,
        flow2,
        flow3,
        flow4,
        effect,
        action = ACTION_NONE;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        var width = window.innerWidth;
        var height = window.innerHeight;
        var k = width / height;
        var s = 2; //三维场景显示范围控制系数，系数越大，显示的范围越大
        //camera = new THREE.OrthographicCamera(0, 2, 0, -2, 1, 7.5);
        camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 7.5);
        //camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 0, 5);
        camera.lookAt(scene.position);

        // Add Points Boxs
        const initialPoints = [
            { x: 0.353, y: -0.5, z: 0.353 },
            { x: 0.5, y: 0, z: 0.5 },
            { x: 0.353, y: 0.5, z: 0.353 },
            { x: 0, y: 0.707, z: 0 },
            { x: - 0.353, y: 0.5, z: -0.353 },
            { x: -0.5, y: 0, z: -0.5 },
            { x: - 0.353, y: -0.5, z: -0.353 },
            { x: 0, y: -0.707, z: 0 },
        ];




        const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const boxMaterial = new THREE.MeshBasicMaterial();

        for (const handlePos of initialPoints) {
            const handle = new THREE.Mesh(boxGeometry, boxMaterial);
            handle.position.copy(handlePos);
            curveHandles.push(handle);
            //scene.add( handle );
        }

        // add Curve

        const curve = new THREE.CatmullRomCurve3(
            curveHandles.map((handle) => handle.position)
        );
        curve.curveType = "centripetal";
        curve.closed = true;


        // Add line
        const points = curve.getPoints(50);
        const line = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({ color: 0x00ff00 })
        );
        scene.add(line);


        // add Light
        const light = new THREE.DirectionalLight(0xffaa33);
        light.position.set(- 10, 10, 10);
        light.intensity = 1.0;
        scene.add(light);

        const light2 = new THREE.AmbientLight(0x003973);
        light2.intensity = 1.0;
        scene.add(light2);

        // add Text

        const loader = new THREE.FontLoader();

        loader.load("./public/fonts/helvetiker_bold.typeface.json", function (font) {
            const initFlow = function (x, y, z, rotateX) {
                const geometry = new THREE.TextGeometry("DaDouShaBao", {
                    font: font,
                    size: 0.23,
                    height: 0.25,
                    curveSegments: 20,
                    bevelEnabled: false,
                });
                geometry.translate(x, y, z);
                geometry.rotateX(Math.PI * (rotateX + 1 / 4));

                const material = new THREE.MeshStandardMaterial({
                    color: 0x99ffff
                });

                const objectToCurve = new THREE.Mesh(geometry, material);
                let tempFlow = new Flow(objectToCurve);
                tempFlow.updateCurve(0, curve);
                return tempFlow
            }

            // 添加两个文字
            flow = initFlow(0, -0.11, -0.11, 0);
            // flow2 = initFlow(-1.1, -0.11, -0.11, 1 / 2);
            flow2 = initFlow(-2.2, -0.11, -0.11, 1 / 2);
            // flow3 = initFlow(-2.2, -0.11, -0.11, -1);
            // flow4 = initFlow(1.1, -0.11, -0.11, -1 / 2);
            scene.add(flow.object3D);
            scene.add(flow2.object3D);
            // scene.add(flow3.object3D);
            // scene.add(flow4.object3D);
        });

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 添加相机
        effect = new PeppersGhostEffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);
        effect.cameraDistance = 5;
    }



    function animate() {
        requestAnimationFrame(animate);

        if (flow) {
            flow.moveAlongCurve(-0.004);
            flow2.moveAlongCurve(-0.004);
            // flow3.moveAlongCurve(-0.001);
            // flow4.moveAlongCurve(-0.001);
        }
        effect.render(scene, camera);
        // render();
    }

    function render() {
        renderer.render(scene, camera);
    }

}