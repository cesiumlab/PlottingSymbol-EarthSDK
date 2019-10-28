import PlotPolylineBase from './base/PlotPolylineBase';
const Tool = XE.Tool;

class GeoArc extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 3;

        this._polylineShow = true;

        this._polylinePositions = new Array(360).fill(0).map(e => [0, 0, 0]);
        this._pgPositions = [];
        this._nextPosition = [0, 0, 0];

        this.disposers.push(
            XE.MVVM.watch(
                () => {
                    return [...this.positions.map(e => [...e])];
                },
                positions => {
                    const l = positions.length;

                    if (l < 3 || Tool.Math.hasSamePosition(positions)) {
                        this._polylineShow = false;
                        return;
                    }

                    const d = Tool.Math.geoDistance(positions[0], positions[1]);

                    this._polylinePositions.length = 0;
                    this._polylinePositions.push([...positions[1]]);

                    const hpr1 = Tool.Math.hpr(positions[0], positions[1]);
                    const hpr2 = Tool.Math.hpr(positions[0], positions[2]);

                    const slice = 360;
                    var angle = 0;
                    if (hpr1[0] >= hpr2[0]) {
                        angle = (hpr1[0] - hpr2[0]) * (180 / Math.PI);
                    } else {
                        angle = (hpr1[0] - hpr2[0] + 2 * Math.PI) * (180 / Math.PI);
                    }

                    for (var i = 0; i < angle; i++) {
                        Tool.Math.geoMove(
                            positions[0],
                            (hpr1[0] -= Math.PI / 180),
                            d,
                            this._nextPosition
                        );
                        this._polylinePositions.push([...this._nextPosition]);
                    }

                    this._polyline.positions = this._polylinePositions;

                    this._polylineShow = true;
                }
            )
        );
    }
}

GeoArc.registerType(GeoArc, 'GeoArc');

export default GeoArc;
