import PlotPolygonBase from './base/PlotPolygonBase';

const Tool = XE.Tool;

const c_polygonPositions = new Array(360).fill(0).map(e => [0, 0, 0]);
const c_pgPositions = [];

class GeoCircle2 extends PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._onlyMove = true;
    this._fixedPositionsNum = 1;

    this.disposers.push(
      XE.MVVM.watch(
        () => ({
          positions: [...this.positions.map(e => [...e])],
          radius: this.radius,
          holeRadius: this.holeRadius,
          slice: this.slice,
        }),
        ({positions, radius, holeRadius, slice}) => {
          const l = positions.length;

          if (l <= 0) {
            this._polygonShow = false;
            return;
          }

          const d = radius;

          if (d <= 0) {
            return;
          }

          if (slice <=2) {
            return;
          }

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

          if (holeRadius > 0 && holeRadius < d) {
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

GeoCircle2.defaultOptions = {
  radius: 2000,
  holeRadius: 0,
  slice: 360,
};

GeoCircle2.registerType(GeoCircle2, "GeoCircle2");

export default GeoCircle;
