class PlotPolygonBase extends XE.Obj.PlotBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = false;
        this._fixedPositionsNum = undefined;

        XE.MVVM.extend(this, {
            _polygonShow: true, // 内部决定是否显示
        });

        this._polygon = new XE.Obj.Polygon(earth);
        this.disposers.push(() => {
            this._polygon = this._polygon && this._polygon.destroy();
        });
        this._polygon.show = this._polygonShow && this.show;

        const updatePolygon = () => {
            this._polygon.show = this._polygonShow && this.show;
            this._polygon.width = this.width;
            this._polygon.color = this.color;
            this._polygon.ground = this.ground;

            this._polygon.outline.width = this.outlineWidth;
            this._polygon.outline.color = this.outlineColor;
            this._polygon.outline.show = this.outlineShow;
        }

        updatePolygon();
        this.disposers.push(XE.MVVM.watch(() => {
            return {
                show: this._polygonShow && this.show,
                width: this.width,
                color: [...this.color],
                ground: this.ground,
                outlineWidth: this.outlineWidth,
                outlineColor: this.outlineColor,
                outlineShow: this.outlineShow,
            }
        }, () => updatePolygon()));
    }

    get onlyMove() {
        return this._onlyMove;
    }

    get fixedPositionsNum() {
        return this._fixedPositionsNum;
    }

    flyTo() {
        this._polygon.flyTo();
    }
}

PlotPolygonBase.defaultOptions = {
    positions: [],
    show: true,
    color: [0, 1, 0, 0.1],
    outlineWidth: 2.0,
    outlineColor: [0, 1, 0, 1],
    outlineShow: true,
};

export default PlotPolygonBase;
