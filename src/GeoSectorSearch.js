const Tool = XE.Tool;

class GeoSectorSearch extends XE.Obj.PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 2;

        this._polylineShow = true;

        this._positions = (new Array(6)).fill(0).map(() => [0, 0, 0]);

        this._polylinePositions = [];

        this._scratchHpr = [0, 0, 0];
        this._scratchPos = [0, 0, 0];
        this.disposers.push(XE.MVVM.watch(() => [...this.positions.map(e => [...e])], positions => {
            if (positions.length === 2) {
                positions[1][2] = positions[0][2]; 
                const geod = Tool.Math.geoDistance(positions[0], positions[1]);
                const center = positions[0];

                if (geod > 0) {
                    const hpr = Tool.hpr(positions[0], positions[1], this._scratchHpr);
                    for (let i=0; i<6; ++i) {
                        Tool.Math.geoMove(positions[0], hpr[0] + Cesium.Math.PI_OVER_THREE * i, geod, this._positions[i]);
                    }

                    this._polylinePositions.length = 0;

                    for (let i=0; i<3; ++i) {
                        this._polylinePositions.push([...center], [...this._positions[i*2+0]]);
                        this._polylinePositions.push([...this._positions[i*2+0]], [...this._positions[i*2+1]]);
                        this._polylinePositions.push([...this._positions[i*2+1]], [...center]);
                    }

                    this._polyline.positions = this._polylinePositions;
                    this._polylineShow = true;
                    return;
                }
            }
            this._polylineShow = false;
        }));
    }
}
        
GeoSectorSearch.registerType(GeoSectorSearch, 'GeoSectorSearch');

export default GeoSectorSearch;
