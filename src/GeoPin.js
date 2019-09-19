class GeoPin extends XE.Core.XbsjCzmObj {
    constructor(earth, guid) {
        super(earth, guid);

        this.disposers.push(XE.Earth.Interaction.InteractionProperty.registerPositionEditing(this._earth, this, {
            positionEditingProperty: 'editing',
        }));

        this.disposers.push(XE.Earth.Interaction.InteractionProperty.registerPositionPicking(this._earth, this, {
            positionPickingProperty: 'creating',
        }));        

        this._pin = new XE.Obj.Pin(earth);
        this.disposers.push(() => (this._pin = this._pin && this._pin.destroy()));
        this.disposers.push(XE.MVVM.watch(() => {
            this._pin.position = [...this.position];
            this._pin.viewDistance = this.viewDistance;
            this._pin.scale = this.scale;
            this._pin.near = this.near;
            this._pin.far = this.far;
            this._pin.disableDepthTestDistance = this.disableDepthTestDistance;
            this._pin.show = this.show;
        }));
    }

    destroy() {
        return super.destro();
    }
}

GeoPin.defaultOptions = {
    position: [0, 0, 0],
    viewDistance: 100.0,
    scale: 1.0,
    near: 0,
    far: Number.MAX_VALUE,
    disableDepthTestDistance: Number.MAX_VALUE, // POSITIVE_INFINITY转化为json时，会变成null！
    show: true,
};

GeoPin.registerType(GeoPin, 'GeoPin');

export default GeoPin;