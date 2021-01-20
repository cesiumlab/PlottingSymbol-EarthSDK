import PlotPolygonBase from './base/PlotPolygonBase';

const Tool = XE.Tool;

const c_polygonPositions = new Array(360).fill(0).map(e => [0, 0, 0]);
const c_pgPositions = [];

class GeoCircle extends PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._onlyMove = true;
    this._fixedPositionsNum = 2;


    this.disposers.push(
      XE.MVVM.watch(
        () => ({
          positions: [...this.positions.map(e => [...e])],
          holeRadius: this.holeRadius,
        }),
        ({positions, holeRadius}) => {
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

          {
            for (let i = 0; i < slice; i++) {
              Tool.Math.geoMove(
                positions[0],
                i * Math.PI/180,
                d,
                c_polygonPositions[i],
              );
            }
  
            c_pgPositions.length = 0;
            c_polygonPositions.forEach(e => {
              c_pgPositions.push(e[0], e[1]);
            });
  
            this._polygon.positions = c_pgPositions;
          }

          if (this.holeRadius > 0 && this.holeRadius < d) {
            for (let i = 0; i < slice; i++) {
              Tool.Math.geoMove(
                positions[0],
                i * Math.PI/180,
                this.holeRadius,
                c_polygonPositions[i],
              );
            }
  
            c_pgPositions.length = 0;
            c_polygonPositions.forEach(e => {
              c_pgPositions.push(e[0], e[1]);
            });
  
            this._polygon.holePositions = c_pgPositions;
          }

          this._polygon.height = positions[0][2];

          this._polygonShow = true;
        }
      )
    );
  }
}

GeoCircle.defaultOptions = {
  holeRadius: 0,
};

GeoCircle.registerType(GeoCircle, "GeoCircle");

export default GeoCircle;
