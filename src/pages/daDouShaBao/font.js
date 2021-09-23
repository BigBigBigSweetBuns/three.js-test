const THREE = require("three");
const TransformControls = require("three/examples/jsm/modifiers/CurveModifier");
const Flow = TransformControls.Flow;

class TextGroup {
  text; //
  flow; // 0%
  flow2; // 90%
  flow3; // 180%
  flow4; // 270%
  curve;
  translateXYZ = {
    x: 0,
    y: 0,
    z: 0,
  };
  translate2XYZ = {
    x: 0,
    y: 0,
    z: 0,
  };
  constructor(
    text = "DaDouShaBao",
    textPosition = { x: 0, y: 0, z: 0 },
    corp = "top",
    fontFamily = "./public/fonts/helvetiker_bold.typeface.json",
    color = 0x99ffff,
  ) {
    this.text = text;
    this.textPosition = textPosition;
    this.fontFamily = fontFamily;
    this.color = color;
    this.corp = corp; // 选择裁剪的上下
  }
  async init() {
    await this.initFlow();
  }
  initLine(lineColor = 0x00ff00) {
    this.addLine(this.curve, lineColor, this.textPosition);
  }
  async initFlow() {
    const rotateX1 = Math.PI * 0;
    const rotateX2 = (Math.PI * 1) / 2;
    const rotateX3 = Math.PI * 1;
    const rotateX4 = -(Math.PI * 1) / 2;
    const geometry = await this.initFont(this.text, this.fontFamily);
    const geometry2 = await this.initFont(this.text, this.fontFamily);
    const geometry3 = await this.initFont(this.text, this.fontFamily);
    const geometry4 = await this.initFont(this.text, this.fontFamily);
    const textGeometry = this.initText(geometry, rotateX1);
    const textGeometry2 = this.initText(geometry2, rotateX2);
    const textGeometry3 = this.initText(geometry3, rotateX3);
    const textGeometry4 = this.initText(geometry4, rotateX4);
    const points = this.corp == "top" ? this.pointsXY(0.5) : this.pointsYZ(0.5);
    // const points = this.corp == "left" ? this.pointsXY(0.5) : this.pointsYZ(0.5);
    const curve = this.initCurve(this.initMesh(points, 0.1, 0.1, 0.1));
    this.curve = curve;
    if (this.corp == "top") {
      this.flow = this.createFlowTop(
        textGeometry,
        curve,
        this.translateXYZ.x + this.textPosition.x,
        this.translateXYZ.y + this.textPosition.y,
        this.translateXYZ.z + this.textPosition.z
      );
      this.flow2 = this.createFlowTop(
        textGeometry2,
        curve,
        this.translate2XYZ.x + this.textPosition.x,
        this.translate2XYZ.y + this.textPosition.y,
        this.translate2XYZ.z + this.textPosition.z
      );
      this.flow3 = this.createFlowTop(
        textGeometry3,
        curve,
        this.translateXYZ.x + this.textPosition.x,
        this.translateXYZ.y + this.textPosition.y,
        this.translateXYZ.z + this.textPosition.z
      );
      this.flow4 = this.createFlowTop(
        textGeometry4,
        curve,
        this.translate2XYZ.x + this.textPosition.x,
        this.translate2XYZ.y + this.textPosition.y,
        this.translate2XYZ.z + this.textPosition.z
      );
    } else if (this.corp == "down") {
      this.flow = this.createFlowDown(
        textGeometry,
        curve,
        this.translateXYZ.x + this.textPosition.x,
        this.translateXYZ.y + this.textPosition.y,
        this.translateXYZ.z + this.textPosition.z
      );
      this.flow2 = this.createFlowDown(
        textGeometry2,
        curve,
        this.translate2XYZ.x + this.textPosition.x,
        this.translate2XYZ.y + this.textPosition.y,
        this.translate2XYZ.z + this.textPosition.z
      );
      this.flow3 = this.createFlowDown(
        textGeometry3,
        curve,
        this.translateXYZ.x + this.textPosition.x,
        this.translateXYZ.y + this.textPosition.y,
        this.translateXYZ.z + this.textPosition.z
      );
      this.flow4 = this.createFlowDown(
        textGeometry4,
        curve,
        this.translate2XYZ.x + this.textPosition.x,
        this.translate2XYZ.y + this.textPosition.y,
        this.translate2XYZ.z + this.textPosition.z
      );
    }
  }
  addLine(curve, color = 0x00ff00, position = { x: 0, y: 0, z: 0 }) {
      const points = curve.getPoints(50);
      this.line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: color })
      );
      this.line.position.x = position.x;
      this.line.position.y = position.y;
      this.line.position.z = position.z;
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
        { x: 0, y: size, z: 0 },
        {
          x: size * Math.cos(basePI),
          y: +size * Math.sin(basePI),
          z: 0,
        },
        { x: size, y: 0.0, z: 0 },
        {
          x: size * Math.cos(basePI),
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
        z: +size * Math.cos(basePI),
      },
      { x: 0, y: 0, z: +size },
      {
        x: 0,
        y: +size * Math.sin(basePI),
        z: +size * Math.cos(basePI),
      },
      { x: 0.0, y: +size, z: 0 },
      {
        x: 0,
        y: +size * Math.sin(basePI),
        z: -size * Math.cos(basePI),
      },
      { x: 0, y: 0, z: -size },
      {
        x: 0,
        y: -size * Math.sin(basePI),
        z: -size * Math.cos(basePI),
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
        loader.load(fontFamily, function(font) {
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
    return geometry;
  }
  initPlanes() {
    const planes = [ //声明三个平面，作为切割面。1, 0, 0为法向量，0为constant
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
    ];
  }

  /**
   * 设置中心轴并旋转X轴
   * @param {*} geometry
   * @param {*} rotateX
   * @returns
   */
  initText(geometry, rotateX) {
    geometry.computeBoundingBox();
    geometry.center();
    geometry.rotateX(rotateX);
    return geometry;
  }
  createFlowTop(geometry, curve, x = 0, y = 0, z = 0, color = 0x99ffff) {
    const planes = [ //声明三个平面，作为切割面。1, 0, 0为法向量，0为constant
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    ];

    const material = new THREE.MeshStandardMaterial({
      color,
      clippingPlanes: planes,
      // clipIntersection: true,
    });
    const objectToCurve = new THREE.Mesh(geometry, material);
    objectToCurve.position.x = x;
    objectToCurve.position.y = y;
    objectToCurve.position.z = z;

    const tempFlow = new Flow(objectToCurve);
    tempFlow.updateCurve(0, curve);
    return tempFlow;
  }
  createFlowDown(geometry, curve, x = 0, y = 0, z = 0, color = 0x99ffff) {
    const planes = [ //声明三个平面，作为切割面。1, 0, 0为法向量，0为constant
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    ];

    const material = new THREE.MeshStandardMaterial({
      color,
      clippingPlanes: planes,
      // clipIntersection: true,
    });
    const objectToCurve = new THREE.Mesh(geometry, material);
    objectToCurve.position.x = x;
    objectToCurve.position.y = y;
    objectToCurve.position.z = z;

    const tempFlow = new Flow(objectToCurve);
    tempFlow.updateCurve(0, curve);
    return tempFlow;
  }
}
module.exports = TextGroup;