const Tool = XE.Tool;

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
            this._pin.enabled = this.enabled;
            this._pin.attachedPathGuid = this.attachedPathGuid;
        }));

        this._div = document.createElement("div");
        this._div.id = this._pin.guid;
        this._div.innerHTML = this.innerHTML;
        this._div.style.position = "absolute";
        let pin = this._pin;
        this.disposers.push(XE.MVVM.watch(
            () => [...pin.winPos],
            winPos => {
                this._div.style.left = winPos[0] + "px";
                this._div.style.bottom = winPos[1] + "px";
            }
        ));
        earth.czm.viewer.container.appendChild(this._div);

        let c_position = earth.camera.position;
        let distance = XE.Tool.Math.distance([this.position, c_position])
        this.disposers.push(XE.MVVM.watch(() => {
            if (this._pin.near <= distance && distance <= this._pin.far) {
                this._div.style.display = "block";
            } else {
                this._div.style.display = "none";
            }
        }));

        let earthcamera = earth.camera;
        this.disposers.push(XE.MVVM.watch(earthcamera, 'position', () => {
            let c_position = earth.camera.position;
            let distance = XE.Tool.Math.distance([this.position, c_position])
            if (this._pin.near <= distance && distance <= this._pin.far) {
                this._div.style.display = "block";
            } else {
                this._div.style.display = "none";
            }
        }));

        //watch-enabled属性
        this.disposers.push(XE.MVVM.watch(() => {
            if (this._pin.enabled) {
                this._div.style.display = "block";
            } else {
                this._div.style.display = "none";
            }
        }));

        this.disposers.push(XE.MVVM.watch(() => {
            this._div.innerHTML = this.innerHTML;
        }));
    }

    destroy() {
        if (this._div) {
            this._div.parentNode.removeChild(this._div);
        }
        return super.destroy();
    }
}

GeoPin.defaultOptions = {
    position: [0, 0, 0],
    viewDistance: 100.0,
    scale: 1.0,
    near: 0,
    attachedPathGuid:'',
    far: Number.MAX_VALUE,
    disableDepthTestDistance: Number.MAX_VALUE, // POSITIVE_INFINITY转化为json时，会变成null！
    show: false,
    innerHTML: `<div
    style="height:50px;width:100px;left:-76px;
    bottom:0px;position: absolute;color: white;
    background-size: 100% 100%;padding: 5px;
    border-radius: 5px;cursor:pointer;
    background-image:url('../../Examples/images/dialog.png');">
标记文字
</div>`
};

GeoPin.registerType(GeoPin, 'GeoPin');

export default GeoPin;