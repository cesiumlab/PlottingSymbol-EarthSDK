import PlotPolygonBase from './base/PlotPolygonBase';
const Tool = XE.Tool;

class GeoSector extends PlotPolygonBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 3;

        this._polygonPositions = new Array(360).fill(0).map(e => [0, 0, 0]);
        this._pgPositions = [];
        this._nextPosition = [0, 0, 0];

        this.disposers.push(
            XE.MVVM.watch(
                () => {
                    return [...this.positions.map(e => [...e])];
                },
                positions => {
                    const l = positions.length;

                    if (l < 3) {
                        this._polygonShow = false;
                        return;
                    }

                    const d = Tool.Math.geoDistance(positions[0], positions[1]);

                    this._polygonPositions.length = 0;
                    this._polygonPositions.push([...positions[0]]);
                    this._polygonPositions.push([...positions[1]]);

                    const hpr1 = Tool.Math.hpr(positions[0], positions[1]);
                    const hpr2 = Tool.Math.hpr(positions[0], positions[2]);
                    if (!hpr || !hpr2) {
                        return;
                    }

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

GeoSector.registerType(GeoSector, 'GeoSector');

export default GeoSector;
