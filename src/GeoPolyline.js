import PlotPolylineBase from './base/PlotPolylineBase';
const Tool = XE.Tool;

class GeoPolyline extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            this._polyline.positions = positions;
        }));
    }
}

GeoPolyline.registerType(GeoPolyline, 'GeoPolyline');

export default GeoPolyline;
