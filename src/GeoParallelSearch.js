import PlotPolylineBase from './base/PlotPolylineBase';
const Tool = XE.Tool;

class GeoParallelSearch extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._polylineShow = true;

        this._leftArrowPosition = [0, 0, 0];
        this._rightArrowPosition = [0, 0, 0];
        this._leftArrowPosition2 = [0, 0, 0];
        this._rightArrowPosition2 = [0, 0, 0];

        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            const l = positions.length;
            const d = Tool.Math.distance(positions);

            if (l < 2 || Tool.Math.hasSamePosition(positions)) {
                this._polylineShow = false;
                return;
            }

            if (l > 2) {
                for (var i = l - 1; i > 0; i--) {
                    if (i > 1) {
                        if (i % 2 == 0) {
                            positions[i][0] = positions[i - 1][0];
                        } else {
                            positions[i][1] = positions[i - 1][1];
                        }
                    }
                    const hpr = Tool.Math.hpr(positions[i], positions[i - 1]);
                    Tool.Math.geoMove(positions[i], hpr[0] + Math.PI / 6, Tool.Math.distance(positions[i - 1], positions[i]) * 0.1, this._leftArrowPosition);
                    Tool.Math.geoMove(positions[i], hpr[0] - Math.PI / 6, Tool.Math.distance(positions[i - 1], positions[i]) * 0.1, this._rightArrowPosition);
                    positions.push([...positions[i]]);
                    positions.push([...this._leftArrowPosition]);
                    positions.push([...positions[i]]);
                    positions.push([...this._rightArrowPosition]);
                    positions.push([...positions[i]]);
                }
            }

            this._polyline.positions = positions;

            this._polylineShow = true;
        }));
    }
}

GeoParallelSearch.registerType(GeoParallelSearch, 'GeoParallelSearch');

export default GeoParallelSearch;
