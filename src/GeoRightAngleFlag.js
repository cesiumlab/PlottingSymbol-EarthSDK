import PlotPolygonBase from './base/PlotPolygonBase';

const Tool = XE.Tool;

class GeoRightAngleFlag extends PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._onlyMove = true;
    this._fixedPositionsNum = 2;

    this._polygonPositions = [];
    this._hpr = [0, 0, 0];

    this.disposers.push(XE.MVVM.watch(() => {
      // return {
      //     positions: [...this.positions.map(e => [e[0], e[1]])].flat(),
      //     height: this.positions.length > 0 && this.positions[0][2],
      // };
      return [...this.positions.map(e => [...e])];
    }, positions => {
      const l = positions.length;

      if (l < 2) {
        this._polygonShow = false;
        return;
      }

      this._polygonPositions.length = 0;
      this._polygonPositions.push(positions[0][0], positions[1][1]);
      this._polygonPositions.push(positions[0][0], positions[0][1]);
      this._polygonPositions.push(positions[1][0], positions[0][1]);
      this._polygonPositions.push(positions[1][0], 0.5 * (positions[0][1] + positions[1][1]));
      const d = positions[1][0] - positions[0][0];
      this._polygonPositions.push(positions[0][0] + 0.01 * d, 0.5 * (positions[0][1] + positions[1][1]));
      this._polygonPositions.push(positions[0][0] + 0.01 * d, positions[1][1]);


      this._polygon.positions = this._polygonPositions;
      this._polygon.height = positions[0][2];

      this._polygonShow = true;
    }));
  }
}

GeoRightAngleFlag.registerType(GeoRightAngleFlag, 'GeoRightAngleFlag');

export default GeoRightAngleFlag;