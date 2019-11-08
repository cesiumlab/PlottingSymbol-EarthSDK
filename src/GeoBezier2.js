import PlotPolylineBase from './base/PlotPolylineBase';
const Tool = XE.Tool;

class GeoBezier2 extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 3;

        this._polylineShow = true;

        this._bezierPositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);

        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            const l = positions.length;

            if (l < 3 || Tool.Math.hasSamePosition(positions)) {
                this._polylineShow = false;
                return;
            }

            Tool.Math.Bezier.bezier2(positions[0], positions[1], positions[2], 19, this._bezierPositions);

            this._polyline.positions = this._bezierPositions;

            this._polylineShow = true;
        }));
    }
}

GeoBezier2.registerType(GeoBezier2, 'GeoBezier2');

export default GeoBezier2;
