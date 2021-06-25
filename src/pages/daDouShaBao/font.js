class TextGroup{
  text; //
  flow; // 0%
  flow2; // 90%
  flow3; // 180%
  flow4; // 270%
  constructor(text,fontFamily="./public/fonts/helvetiker_bold.typeface.json", color = 0x99ffff) {
    this.text = text;
    this.color = color;
    this.textGeometry = this.initText();
    this.textGeometry2 = this.initText();
    this.textGeometry3 = this.initText();
    this.textGeometry4 = this.initText();
  }
  init() {
    const curve
    const rotateX1 = Math.PI * 0;
    const rotateX2 = (Math.PI * 1) / 2;
    const rotateX3 = Math.PI * 1;
    const rotateX4 = -(Math.PI * 1) / 2;
    const font=this.initFont(text,fontFamily);
    const points=this.pointsXY(0.5);
    const curve =this.initCurve(this.initMesh(points, 0.1, 0.1, 0.1));
    this.flow = initFlow(this.initText(font,0, -0.1, -0.1, rotateX1), curve);
    this.flow2 = initFlow(this.initText(font,-1.55, -0.1, -0.1, rotateX2), curve);
    this.flow3 = initFlow(this.initFont(font,0, -0.1, -0.1, rotateX3), curve);
    this.flow4 = initFlow(this.initFont(font,-1.55, -0.1, -0.1, rotateX4), curve);
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
  initFont(text,fontFamily) {
    loader.load(
      fontFamily,
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
}
exports=TextGroup;