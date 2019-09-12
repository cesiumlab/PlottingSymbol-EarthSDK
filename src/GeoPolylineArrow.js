const Tool = XE.Tool;

class GeoPolylineArrow extends XE.Obj.PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._polylineShow = true;
        
        this._leftArrowPosition = [0, 0, 0];
        this._rightArrowPosition = [0, 0, 0];
        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            const l = positions.length;
            const d = Tool.Math.distance(positions);
            
            if (l < 2 || Tool.Math.hasSamePosition(positions)) {
                this._polylineShow = false;
                return;
            }

            const hpr = Tool.Math.hpr(positions[l-1], positions[l-2]);
            Tool.Math.geoMove(positions[l-1], hpr[0] + Math.PI/6, d * 0.1, this._leftArrowPosition);
            Tool.Math.geoMove(positions[l-1], hpr[0] - Math.PI/6, d * 0.1, this._rightArrowPosition);

            positions.push([...this._leftArrowPosition]);
            positions.push([...positions[l-1]]);
            positions.push([...this._rightArrowPosition]);
            positions.push([...positions[l-1]]);

            this._polyline.positions = positions;

            this._polylineShow = true;
        }));
    }
}
        
GeoPolylineArrow.registerType(GeoPolylineArrow, 'GeoPolylineArrow');

export default GeoPolylineArrow;
