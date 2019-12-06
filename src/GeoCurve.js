import PlotPolylineBase from './base/PlotPolylineBase';

const Tool = XE.Tool;

class GeoCurve extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._positions = [];
        this.disposers.push(XE.MVVM.watch(() => {
            return {
                positions: [...this.positions.map(e => [...e])],
                slices: this.slices,
            }
        }, ({ positions, slices }) => {
            const l = positions.length;

            if (l < 2) {
                this._polylineShow = false;
                return;
            }

            this._positions.length = 0;
            Tool.Math.interpolatePositions(positions, slices, false, this._positions);

            this._polyline.positions = this._positions;

            this._polylineShow = true;
        }));
    }
}

GeoCurve.defaultOptions = {
    /**
     * 曲线分段数
     * @type {number}
     * @instance
     * @default 100
     * @memberof XE.Obj.Plots.GeoCurve
     */
    slices: 100
};

GeoCurve.registerType(GeoCurve, 'GeoCurve');

export default GeoCurve;
