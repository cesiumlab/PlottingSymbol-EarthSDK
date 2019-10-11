import PlotPolygonBase from './base/PlotPolygonBase';

const Tool = XE.Tool;

class GeoCurveFlag extends PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._onlyMove = true;
    this._fixedPositionsNum = 2;

    this._polygonShow = true;

    this._polygonPositions = [];
    this._hpr = [0, 0, 0];



    this._keyPositions = (new Array(50)).fill(0).map(e => [0, 0, 0]);

    this._bottomCurcePositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);
    this._sbottomCurcePositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);
    this._tbottomCurcePositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);
    this._fbottomCurcePositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);



    this.disposers.push(XE.MVVM.watch(() => {
      return [...this.positions.map(e => [...e])];
    }, positions => {
      const l = positions.length;

      if (l < 2 || Tool.Math.hasSamePosition(positions)) {
        this._polygonShow = false;
        return;
      }

      this._keyPositions[0].splice(0, 3, ...positions[0]);
      this._keyPositions[1].splice(0, 3, ...positions[1]);

      this._polygonPositions.length = 0;
      this._polygonPositions.push(positions[0][0], positions[1][1]); //第一个点
      this._polygonPositions.push(positions[0][0], positions[0][1]); //第二个点
      const d = positions[1][0] - positions[0][0]; //两点之间的垂直距离
      //this._polygonPositions.push((positions[0][0] + positions[1][0]) * 0.5, positions[0][1] - d * 0.1); //上曲线最低点

      // 左上角曲线
      const leftBottom = [positions[0][0], positions[0][1], 0];
      const rightBottom = [(positions[0][0] + positions[1][0]) * 0.5, positions[0][1], 0];
      const rightTop = [(positions[0][0] + positions[1][0]) * 0.5 - 2 * d, positions[0][1] - d * 0.8, 0]
      const leftTop = [positions[0][0], positions[0][1] - d, 0];

      const bottomCenter = Tool.Math.geoLerp(leftBottom, rightBottom, 0.9, this._keyPositions[4]);
      const topCenter = Tool.Math.geoLerp(rightTop, leftTop, 0.9, this._keyPositions[5]);
      const bottomKeyPos = Tool.Math.geoLerp(bottomCenter, topCenter, 0.2, this._keyPositions[6]);
      Tool.Math.Bezier.bezier2(leftBottom, bottomKeyPos, rightBottom, 19, this._bottomCurcePositions);

      this._bottomCurcePositions.forEach(e => { //第3到22个点
        this._polygonPositions.push(e[0], e[1]);
      });

      // 右上角曲线
      const sleftBottom = [(positions[0][0] + positions[1][0]) * 0.5, positions[0][1], 0];
      const srightBottom = [positions[1][0], positions[0][1], 0];
      const srightTop = [(positions[0][0] + positions[1][0]) * 0.5 + d, positions[0][1] - d * 0.1 + d, 0]
      const sleftTop = [positions[0][0], positions[0][1] - d, 0];

      const sbottomCenter = Tool.Math.geoLerp(sleftBottom, srightBottom, 0.1, this._keyPositions[7]);
      const stopCenter = Tool.Math.geoLerp(srightTop, sleftTop, 0.1, this._keyPositions[8]);
      const sbottomKeyPos = Tool.Math.geoLerp(sbottomCenter, stopCenter, 0.2, this._keyPositions[9]);
      Tool.Math.Bezier.bezier2(sleftBottom, sbottomKeyPos, srightBottom, 19, this._sbottomCurcePositions);

      this._sbottomCurcePositions.forEach(e => { //第3到22个点
        this._polygonPositions.push(e[0], e[1]);
      });

      this._polygonPositions.push(positions[1][0], positions[0][1]); //第42个点
      this._polygonPositions.push(positions[1][0], 0.5 * (positions[0][1] + positions[1][1])); //第43个点
      // this._polygonPositions.push((positions[0][0] + positions[1][0]) * 0.5, (positions[0][1] + positions[1][1]) * 0.5 - d * 0.1);

      //右下角曲线
      const tleftBottom = [positions[1][0], 0.5 * (positions[0][1] + positions[1][1]), 0];
      const trightBottom = [(positions[0][0] + positions[1][0]) * 0.5, (positions[0][1] + positions[1][1]) * 0.5, 0];
      const trightTop = [positions[1][0] - d, 0.5 * (positions[0][1] + positions[1][1]) + 0.5 * d, 0]
      const tleftTop = [positions[1][0] - 6 * d, 0.5 * (positions[0][1] + positions[1][1]) + 2*d, 0];

      const tbottomCenter = Tool.Math.geoLerp(tleftBottom, trightBottom, 0.1, this._keyPositions[7]);
      const ttopCenter = Tool.Math.geoLerp(trightTop, tleftTop, 0.1, this._keyPositions[8]);
      const tbottomKeyPos = Tool.Math.geoLerp(tbottomCenter, ttopCenter, 0.2, this._keyPositions[9]);
      Tool.Math.Bezier.bezier2(tleftBottom, tbottomKeyPos, trightBottom, 19, this._tbottomCurcePositions);

      this._tbottomCurcePositions.forEach(e => { //第44到64个点
        this._polygonPositions.push(e[0], e[1]);
      });

      // this._polygonPositions.push(positions[0][0] + 0.01 * d, 0.5 * (positions[0][1] + positions[1][1]));


      //左下角曲线
      const fleftBottom = [(positions[0][0] + positions[1][0]) * 0.5, (positions[0][1] + positions[1][1]) * 0.5, 0];
      const frightBottom = [positions[0][0] + 0.01 * d, 0.5 * (positions[0][1] + positions[1][1]), 0];
      const frightTop = [(positions[0][0] + positions[1][0]) * 0.5 + 5 * d, (positions[0][1] + positions[1][1]) * 0.5 - d * 1.1, 0]
      const fleftTop = [positions[0][0] + 1.01 * d, 0.5 * (positions[0][1] + positions[1][1]) - d, 0];

      const fbottomCenter = Tool.Math.geoLerp(fleftBottom, frightBottom, 0.9, this._keyPositions[4]);
      const ftopCenter = Tool.Math.geoLerp(frightTop, fleftTop, 0.9, this._keyPositions[5]);
      const fbottomKeyPos = Tool.Math.geoLerp(fbottomCenter, ftopCenter, 0.2, this._keyPositions[6]);
      Tool.Math.Bezier.bezier2(fleftBottom, fbottomKeyPos, frightBottom, 19, this._fbottomCurcePositions);

      this._fbottomCurcePositions.forEach(e => { //第65到85个点
        this._polygonPositions.push(e[0], e[1]);
      });

      this._polygonPositions.push(positions[0][0] + 0.01 * d, positions[1][1]);


      this._polygon.positions = this._polygonPositions;
      this._polygon.height = positions[0][2];

      this._polygonShow = true;
    }));
  }
}

GeoCurveFlag.registerType(GeoCurveFlag, 'GeoCurveFlag');

export default GeoCurveFlag;