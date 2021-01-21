class PlotPolylineBase extends XE.Obj.PlotBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = false;
        this._fixedPositionsNum = undefined;

        XE.MVVM.extend(this, {
            _polylineShow: true,
        });

        this._polyline = new XE.Obj.Polyline(earth);
        this.disposers.push(() => {
            this._polyline = this._polyline && this._polyline.destroy();
        });
        this._polyline.show = this._polylineShow && this.show;

        XE.Earth.Interaction.Picking.registerPickingParent(this._polyline, this);

        const updatePolyline = () => {
            this._polyline.show = this._polylineShow && this.show;
            this._polyline.width = this.width;
            this._polyline.material.XbsjColorMaterial.color = this.color;
            this._polyline.ground = this.ground;
            this._polyline.depthTest = this.depthTest;
            this._polyline.minShowHeight = this.minShowHeight;
            this._polyline.maxShowHeight = this.maxShowHeight;
        }

        updatePolyline();
        this.disposers.push(XE.MVVM.watch(() => {
            return {
                show: this.show,
                polylineShow: this._polylineShow,
                width: this.width,
                color: [...this.color],
                ground: this.ground,
                depthTest: this.depthTest,
                minShowHeight: this.minShowHeight,
                maxShowHeight: this.maxShowHeight,
            }
        }, () => updatePolyline()));
    }

    get onlyMove() {
        return this._onlyMove;
    }

    get fixedPositionsNum() {
        return this._fixedPositionsNum;
    }

    flyTo() {
        this._polyline.flyTo();
    }    
}

PlotPolylineBase.defaultOptions = {
    positions: [],
    show: true,
    width: 5.0,
    color: [0, 1, 0, 1],
    depthTest: false,
    minShowHeight: -Number.MAX_VALUE,
    maxShowHeight: Number.MAX_VALUE,
};

export default PlotPolylineBase;
