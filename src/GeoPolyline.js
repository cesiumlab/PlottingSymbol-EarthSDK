import PlotPolylineBase from './base/PlotPolylineBase';
const Tool = XE.Tool;

class GeoPolyline extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._polylineShow = true;

        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            const l = positions.length;
            const d = Tool.Math.distance(positions);

            if (l < 2 || Tool.Math.hasSamePosition(positions)) {
                this._polylineShow = false;
                return;
            }

            this._polyline.positions = positions;

            this._polylineShow = true;
        }));
    }
}

GeoPolyline.registerType(GeoPolyline, 'GeoPolyline');

export default GeoPolyline;
