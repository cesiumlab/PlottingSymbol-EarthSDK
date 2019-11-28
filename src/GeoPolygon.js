import PlotPolygonBase from './base/PlotPolygonBase';
const Tool = XE.Tool;

class GeoPolygon extends PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._pgPositions = [];
    this.disposers.push(
      XE.MVVM.watch(
        () => {
          return [...this.positions.map(e => [...e])];
        },
        positions => {
          const l = positions.length;

          if (l <= 1) {
            return;
          }

          this._pgPositions.length = 0;
          positions.forEach(e => {
            this._pgPositions.push(e[0], e[1]);
          });

          this._polygon.positions = this._pgPositions;
          this._polygon.height = positions[0][2];
        }
      )
    );
  }
}

GeoPolygon.registerType(GeoPolygon, "GeoPolygon");

export default GeoPolygon;
