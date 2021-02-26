import PlotPolygonBase from './base/PlotPolygonBase';
const Tool = XE.Tool;

const c_polygonPositions = new Array(360).fill(0).map(e => [0, 0, 0]);
const c_pgPositions = [];

class GeoRectangle2 extends PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._onlyMove = true;
    this._fixedPositionsNum = 2;

    this._polygonPositions = new Array(4).fill(0).map(e => [0, 0, 0]);
    this._pgPositions = [];
    this._nextPosition = [0, 0, 0];

    this.disposers.push(
      XE.MVVM.watch(
        () => ({
          ps: [...this.positions.map(e => [...e])],
          rotation: this.rotation,
        }),
        () => {
          const { positions, rotation } = this;
          const l = positions.length;

          if (l < 2) {
            this._polygonShow = false;
            return;
          }

          const p = positions;
          const n = Math.min;
          const x = Math.max;
          const h = p[0][2];

          const d = Tool.Math.geoDistance(p[0], p[1]);
          if (d <= 0) {
            return;
          }

          const midPt = [(p[0][0] + p[1][0])*.5, (p[0][1] + p[1][1])*.5, (p[0][2] + p[1][2])*.5, ];
          const p0 = [n(p[0][0], p[1][0]), n(p[0][1], p[1][1]), h];
          const p1 = [x(p[0][0], p[1][0]), n(p[0][1], p[1][1]), h];
          const p2 = [x(p[0][0], p[1][0]), x(p[0][1], p[1][1]), h];
          const p3 = [n(p[0][0], p[1][0]), x(p[0][1], p[1][1]), h];
          
          c_polygonPositions.length = 0;
          c_polygonPositions.push(p0, p1, p2, p3);

          // rotation
          for (let lp of c_polygonPositions) {
            const d = Tool.Math.geoDistance(midPt, lp);
            const hpr = Tool.Math.hpr(midPt, lp);
            if (hpr) {
              Tool.Math.geoMove(midPt, hpr[0] += rotation, d, lp);
            }
          }

          c_pgPositions.length = 0;
          c_polygonPositions.forEach(e => {
            c_pgPositions.push(e[0], e[1]);
          });

          this._polygon.positions = c_pgPositions;
          this._polygon.height = h;

          this._polygonShow = true;
        }
      )
    );
  }
}

GeoRectangle2.defaultOptions = {
  rotation: 0,
};

GeoRectangle2.registerType(GeoRectangle2, "GeoRectangle2");

export default GeoRectangle2;
