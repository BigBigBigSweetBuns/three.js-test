const THREE = require("three");
const TransformControls = require("three/examples/jsm/modifiers/CurveModifier");
const Flow = TransformControls.Flow;

class TextGroup {
  text; //
  flow; // 0%
  flow2; // 90%
  flow3; // 180%
  flow4; // 270%
  translateXYZ = {
    x: 0,
    y: -0.1,
    z: -0.1,
  };
  translate2XYZ = {
    x: -1.55,
    y: -0.1,
    z: -0.1,
  };
  constructor(
    text = "DaDouShaBao",
    fontFamily = "./public/fonts/helvetiker_bold.typeface.json",
    color = 0x99ffff
  ) {
    this.text = text;
    this.fontFamily = fontFamily;
    this.color = color;
    console.log("initFlow");
  }
  async init() {
    await this.initFlow();
  }
  async initFlow() {
    // const curve;
    const rotateX1 = Math.PI * 0;
    const rotateX2 = (Math.PI * 1) / 2;
    const rotateX3 = Math.PI * 1;
    const rotateX4 = -(Math.PI * 1) / 2;
    const geometry = await this.initFont(this.text, this.fontFamily);
    const geometry2 = await this.initFont(this.text, this.fontFamily);
    const geometry3 = await this.initFont(this.text, this.fontFamily);
    const geometry4 = await this.initFont(this.text, this.fontFamily);
    const textGeometry = this.initText(
      geometry,
      this.translateXYZ.x,
      this.translateXYZ.y,
      this.translateXYZ.z,
      rotateX1
    );
    const textGeometry2 = this.initText(
      geometry2,
      this.translate2XYZ.x,
      this.translate2XYZ.y,
      this.translate2XYZ.z,
      rotateX2
    );
    const textGeometry3 = this.initText(
      geometry3,
      this.translateXYZ.x,
      this.translateXYZ.y,
      this.translateXYZ.z,
      rotateX3
    );
    const textGeometry4 = this.initText(
      geometry4,
      this.translate2XYZ.x,
      this.translate2XYZ.y,
      this.translate2XYZ.z,
      rotateX4
    );
    const points = this.pointsXY(0.5);
    const curve = this.initCurve(this.initMesh(points, 0.1, 0.1, 0.1));
    this.flow = this.createFlow(textGeometry, curve);
    this.flow2 = this.createFlow(textGeometry2, curve);
    this.flow3 = this.createFlow(textGeometry3, curve);
    this.flow4 = this.createFlow(textGeometry4, curve);
    this.addLine(curve);
  }
  addLine(curve) {
    const points = curve.getPoints(50);
    this.lineXY = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
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
    const basePI = (45 * Math.PI) / 180;
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
  initCurve(curveHandles) {
    const curve = new THREE.CatmullRomCurve3(
      curveHandles.map((handle) => handle.position)
    );
    curve.curveType = "centripetal";
    curve.closed = true;
    return curve;
  }
  async initFont(text, fontFamily) {
    const fontLoad = (text, fontFamily) => {
      return new Promise((resolve, reject) => {
        const loader = new THREE.FontLoader();
        loader.load(fontFamily, function (font) {
          const data = new THREE.TextGeometry(text, {
            font: font,
            size: 0.2,
            height: 0.2,
            curveSegments: 50,
            bevelEnabled: false,
          });
          resolve(data);
        });
      });
    };
    const geometry = await fontLoad(text, fontFamily);
    console.log("", geometry);
    return geometry;
  }
  initText(geometry, x, y, z, rotateX) {
    geometry.translate(x, y, z);
    geometry.rotateX(rotateX);
    return geometry;
  }
  createFlow(geometry, curve, color = 0x99ffff) {
    const material = new THREE.MeshStandardMaterial({
      color,
    });
    const objectToCurve = new THREE.Mesh(geometry, material);
    const tempFlow = new Flow(objectToCurve);
    tempFlow.updateCurve(0, curve);
    return tempFlow;
  }
}
module.exports = TextGroup;
