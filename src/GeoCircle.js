import PlotPolygonBase from './base/PlotPolygonBase';

const Tool = XE.Tool;

class GeoCircle extends PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._onlyMove = true;
    this._fixedPositionsNum = 2;

    this._polygonPositions = new Array(360).fill(0).map(e => [0, 0, 0]);
    this._pgPositions = [];

    this.disposers.push(
      XE.MVVM.watch(
        () => {
          return [...this.positions.map(e => [...e])];
        },
        positions => {
          const l = positions.length;

          if (l < 2) {
            this._polygonShow = false;
            return;
          }

          const d = Tool.Math.geoDistance(positions[0], positions[1]);

          const hpr = Tool.Math.hpr(positions[0], positions[1]);
          if (!hpr) {
            return;
          }

          const slice = 360;

          for (let i = 0; i < slice; i++) {
            Tool.Math.geoMove(
              positions[0],
              i * Math.PI/180,
              d,
              this._polygonPositions[i],
            );
          }

          this._pgPositions.length = 0;
          this._polygonPositions.forEach(e => {
            this._pgPositions.push(e[0], e[1]);
          });

          this._polygon.positions = this._pgPositions;
          this._polygon.height = positions[0][2];

          this._polygonShow = true;
        }
      )
    );
  }
}

GeoCircle.registerType(GeoCircle, "GeoCircle");

export default GeoCircle;
