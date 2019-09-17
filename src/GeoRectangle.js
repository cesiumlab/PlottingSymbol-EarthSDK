const Tool = XE.Tool;

class GeoRectangle extends XE.Obj.PlotPolygonBase {
  constructor(earth, guid) {
    super(earth, guid);

    this._onlyMove = true;
    this._fixedPositionsNum = 2;

    this._polygonShow = true;

    this._polygonPositions = new Array(4).fill(0).map(e => [0, 0, 0]);
    this._pgPositions = [];
    this._nextPosition = [0, 0, 0];

    this.disposers.push(
      XE.MVVM.watch(
        () => {
          return [...this.positions.map(e => [...e])];
        },
        positions => {
          const l = positions.length;

          if (l < 2 || Tool.Math.hasSamePosition(positions)) {
            this._polygonShow = false;
            return;
          }

          const d = Tool.Math.geoDistance(positions[0], positions[1]);

          this._polygonPositions.length = 0;
          // this._polygonPositions.push([...positions[0]]);
          this._polygonPositions.push([...positions[1]]);

          const hpr = Tool.Math.hpr(positions[0], positions[1]);

          const slice = 4;

          for (var i = 0; i < slice - 1; i++) {
            Tool.Math.geoMove(
              positions[0],
              (hpr[0] += Math.PI / 2),
              d,
              this._nextPosition
            );
            this._polygonPositions.push([...this._nextPosition]);
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

GeoRectangle.registerType(GeoRectangle, "GeoRectangle");

export default GeoRectangle;
