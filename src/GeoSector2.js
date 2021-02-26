import PlotPolygonBase from './base/PlotPolygonBase';
const Tool = XE.Tool;

class GeoSector2 extends PlotPolygonBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 1;

        this._polygonPositions = new Array(360).fill(0).map(e => [0, 0, 0]);
        this._pgPositions = [];
        this._nextPosition = [0, 0, 0];

        this.disposers.push(
            XE.MVVM.watch(
                () => ({
                    positions: [...this.positions.map(e => [...e])],
                    radius: this.radius,
                    startAngle: this.startAngle,
                    angle: this.angle,
                }),
                ({positions, radius, startAngle, angle }) => {
                    const l = positions.length;

                    if (l <= 0) {
                        this._polygonShow = false;
                        return;
                    }

                    if (angle <= 0 || radius <= 0) {
                        return;
                    }

                    const d = radius;

                    this._polygonPositions.length = 0;
                    this._polygonPositions.push([...positions[0]]);
                    // this._polygonPositions.push([...positions[1]]);

                    // const hpr1 = Tool.Math.hpr(positions[0], positions[1]);
                    // const hpr2 = Tool.Math.hpr(positions[0], positions[2]);
                    // if (!hpr1 || !hpr2) {
                    //     return;
                    // }

                    // var angle = 0;
                    // if (hpr1[0] >= hpr2[0]) {
                    //     angle = (hpr1[0] - hpr2[0]) * (180 / Math.PI);
                    // } else {
                    //     angle = (hpr1[0] - hpr2[0] + 2 * Math.PI) * (180 / Math.PI);
                    // }

                    // for (var i = 0; i < angle; i++) {
                    //     Tool.Math.geoMove(
                    //         positions[0],
                    //         (hpr1[0] -= Math.PI / 180),
                    //         d,
                    //         this._nextPosition
                    //     );
                    //     this._polygonPositions.push([...this._nextPosition]);
                    // }

                    const sliceAngle = Math.PI / 180;

                    for (let i = 0; i < angle; ++i) {
                        Tool.Math.geoMove(
                            positions[0],

                        )
                    }

                    const center = positions[0];
                    let sa = startAngle;
                    const stopAngle = startAngle + angle;
                    while (sa < stopAngle) {
                        Tool.Math.geoMove(center, sa, radius, this._nextPosition);
                        this._polygonPositions.push([...this._nextPosition]);
                        sa += sliceAngle;
                    }
                    Tool.Math.geoMove(center, stopAngle, radius, this._nextPosition);
                    this._polygonPositions.push([...this._nextPosition]);

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

GeoSector2.defaultOptions = {
    radius: 200000,
    startAngle: 0, // 方位角
    angle: 60 * Math.PI / 180, // 张角
};

GeoSector2.registerType(GeoSector2, 'GeoSector2');

export default GeoSector2;
