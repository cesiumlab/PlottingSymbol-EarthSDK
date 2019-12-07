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
            this._pin.cameraAttached = this.cameraAttached;
            this._pin.attachedPathGuid = this.attachedPathGuid;
        }));
        this.disposers.push(XE.MVVM.bind(this, 'cameraAttached', this, '_pin.cameraAttached'));

        this._div = document.createElement("div");
        this._div.id = this._pin.guid;
        this._div.innerHTML = this.innerHTML;
        this._div.style.position = "absolute";
        this._div.style.pointerEvents = "none";
        let pin = this._pin;
        this.disposers.push(XE.MVVM.watch(
            () => [...pin.winPos], // winPos是一个有四个元素的数组，分别指示 [left, top, right, bottom]
            winPos => {
                this._div.style.left = winPos[0] + "px";
                this._div.style.bottom = winPos[3] + "px";
            }
        ));
        earth.czm.viewer.container.appendChild(this._div);


        this.disposers.push(XE.MVVM.watch(() => {
            return {
                cameraPosition: [...earth.camera.position],
                near: this.near,
                far: this.far,
                position: [...this.position],
                enabled: this.enabled

            }
        }, s => {
            let distance = XE.Tool.Math.distance([s.position, s.cameraPosition])
            if (s.near <= distance && distance <= s.far) {
                this._div.style.display = "block";
            } else {
                this._div.style.display = "none";
            }

            if (s.enabled) {
                this._div.style.display = "block";
            } else {
                this._div.style.display = "none";
            }

        }));

        this._pin.show = false;
        this.defaultImgUrl = function () {
            // return XE.HTML.getScriptBaseUrl('plottingSymbol') + 'assets/dialog.png'
            return './assets/dialog.png'
        }

        this.innerHTML = `<div
        style="height:50px;width:100px;left:-76px;
        bottom:0px;position: absolute;color: white;
        background-size: 100% 100%;padding: 5px;
        border-radius: 5px;cursor:pointer;
        background-image:url('` + this.defaultImgUrl() + `');">
    标记文字
    </div>`

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
    cameraAttached: false,
    attachedPathGuid: '',
    far: Number.MAX_VALUE,
    disableDepthTestDistance: Number.MAX_VALUE, // POSITIVE_INFINITY转化为json时，会变成null！
    show: false,
    innerHTML: ``,
    defaultImgUrl: Function
};

GeoPin.registerType(GeoPin, 'GeoPin');

export default GeoPin;