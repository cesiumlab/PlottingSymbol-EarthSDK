import PlotPolylineBase from './base/PlotPolylineBase';
const Tool = XE.Tool;

class GeoBezier3 extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 4;

        this._bezierPositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);

        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            const l = positions.length;

            if (l < 4 || Tool.Math.hasSamePosition(positions)) {
                this._polylineShow = false;
                return;
            }

            Tool.Math.Bezier.bezier3(positions[0], positions[1], positions[2], positions[3], 19, this._bezierPositions);

            this._polyline.positions = this._bezierPositions;

            this._polylineShow = true;
        }));
    }
}

GeoBezier3.registerType(GeoBezier3, 'GeoBezier3');

export default GeoBezier3;
