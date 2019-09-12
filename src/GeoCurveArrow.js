const Tool = XE.Tool;

class GeoCurveArrow extends XE.Obj.PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._polylineShow = true;
        
        this._leftArrowPosition = [0, 0, 0];
        this._rightArrowPosition = [0, 0, 0];
        this._positions = [];
        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            const l = positions.length;
            const d = Tool.Math.distance(positions);
            
            if (l < 2 || Tool.Math.hasSamePosition(positions)) {
                this._polylineShow = false;
                return;
            }

            this._positions.length = 0;
            Tool.Math.interpolatePositions(positions, 100, false, this._positions);

            const ll = this._positions.length;

            const hpr = Tool.Math.hpr(this._positions[ll-1], this._positions[ll-2]);
            Tool.Math.geoMove(this._positions[ll-1], hpr[0] + Math.PI/6, d * 0.05, this._leftArrowPosition);
            Tool.Math.geoMove(this._positions[ll-1], hpr[0] - Math.PI/6, d * 0.05, this._rightArrowPosition);

            this._positions.push([...this._leftArrowPosition]);
            this._positions.push([...this._positions[ll-1]]);
            this._positions.push([...this._rightArrowPosition]);
            this._positions.push([...this._positions[ll-1]]);

            this._polyline.positions = this._positions;

            this._polylineShow = true;
        }));
    }
}
        
GeoCurveArrow.registerType(GeoCurveArrow, 'GeoCurveArrow');

export default GeoCurveArrow;
