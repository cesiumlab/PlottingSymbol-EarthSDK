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
          positions: [...this.positions.map(e => [...e])],
          rotation: this.rotation,
          width: this.width,
          height: this.height,
        }),
        ({ 
          positions, 
          rotation, 
          width, 
          height, 
        }) => {
          const l = positions.length;

          if (l <= 0) {
            this._polygonShow = false;
            return;
          }

          const center = positions[0]
          
          c_polygonPositions.length = 0;

          // // rotation
          // for (let lp of c_polygonPositions) {
          //   const d = Tool.Math.geoDistance(midPt, lp);
          //   const hpr = Tool.Math.hpr(midPt, lp);
          //   if (hpr) {
          //     Tool.Math.geoMove(midPt, hpr[0] += rotation, d, lp);
          //   }
          // }

          // 东北
          Tool.Math.geoMove(center, rotation, width*0.5, this._nextPosition);
          Tool.Math.geoMove(this._nextPosition, rotation - Math.PI*0.5, height*0.5, this._nextPosition);
          c_polygonPositions.push([...this._nextPosition]);
          
          // 西北
          Tool.Math.geoMove(center, rotation, -width*0.5, this._nextPosition);
          Tool.Math.geoMove(this._nextPosition, rotation - Math.PI*0.5, height*0.5, this._nextPosition);
          c_polygonPositions.push([...this._nextPosition]);

          // 西南
          Tool.Math.geoMove(center, rotation, -width*0.5, this._nextPosition);
          Tool.Math.geoMove(this._nextPosition, rotation + Math.PI*0.5, height*0.5, this._nextPosition);
          c_polygonPositions.push([...this._nextPosition]);

          // 东南
          Tool.Math.geoMove(center, rotation, width*0.5, this._nextPosition);
          Tool.Math.geoMove(this._nextPosition, rotation + Math.PI*0.5, height*0.5, this._nextPosition);
          c_polygonPositions.push([...this._nextPosition]);

          c_pgPositions.length = 0;
          c_polygonPositions.forEach(e => {
            c_pgPositions.push(e[0], e[1]);
          });

          this._polygon.positions = c_pgPositions;
          this._polygon.height = positions[0][2];;

          this._polygonShow = true;
        }
      )
    );
  }
}

GeoRectangle2.defaultOptions = {
  rotation: 0,
  width: 200000,
  height: 100000,
};

GeoRectangle2.registerType(GeoRectangle2, "GeoRectangle2");

export default GeoRectangle2;
