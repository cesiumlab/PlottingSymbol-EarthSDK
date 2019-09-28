import PlotPolygonBase from './base/PlotPolygonBase';

const Tool = XE.Tool;

class GeoDoubleArrow extends PlotPolygonBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 4;

        this._polygonShow = true;

        this._keyPositions = (new Array(50)).fill(0).map(e => [0, 0, 0]);
        this._bottomCurcePositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);
        this._leftArrowLeftPositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);
        this._leftArrowRightPositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);
        this._rightArrowLeftPositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);
        this._rightArrowRightPositions = (new Array(20)).fill(0).map(e => [0, 0, 0]);

        this._polygonPositions = [];
        this._hpr = [0, 0, 0];

        this.disposers.push(XE.MVVM.watch(() => {
            return [...this.positions.map(e => [...e])];
        }, positions => {
            const l = positions.length;
            
            if (l < 3 || Tool.Math.hasSamePosition(positions)) {
                this._polygonShow = false;
                return;
            }

            this._keyPositions[0].splice(0, 3, ...positions[0]);
            this._keyPositions[1].splice(0, 3, ...positions[1]);
            this._keyPositions[2].splice(0, 3, ...positions[2]);

            if (positions.length === 4) {
                this._keyPositions[3].splice(0, 3, ...positions[3]);
            } else {
                Tool.Math.geoLerp(positions[0], positions[2], 0.5, this._keyPositions[3]);
                Tool.Math.geoLerp(positions[1], this._keyPositions[3], 2.0, this._keyPositions[3]);
            }

            const leftBottom = this._keyPositions[0];
            const rightBottom = this._keyPositions[1];
            const rightTop = this._keyPositions[2];
            const leftTop = this._keyPositions[3];

            // this._polygonPositions.length = 0;
            // this._polygonPositions.push(this._keyPositions[0][0], this._keyPositions[0][1]);
            // this._polygonPositions.push(this._keyPositions[1][0], this._keyPositions[1][1]);
            // this._polygonPositions.push(this._keyPositions[2][0], this._keyPositions[2][1]);
            // this._polygonPositions.push(this._keyPositions[3][0], this._keyPositions[3][1]);

            // 底部曲线
            const bottomCenter = Tool.Math.geoLerp(leftBottom, rightBottom, 0.5, this._keyPositions[4]);
            const topCenter = Tool.Math.geoLerp(rightTop, leftTop, 0.5, this._keyPositions[5]);
            const bottomKeyPos = Tool.Math.geoLerp(bottomCenter, topCenter, 0.1, this._keyPositions[6]);
            Tool.Math.Bezier.bezier2(leftBottom, bottomKeyPos, rightBottom, 19, this._bottomCurcePositions);

            // this._polygonPositions.length = 0;
            // this._bottomCurcePositions.forEach(e => {
            //     this._polygonPositions.push(e[0], e[1]);
            // });
            // this._polygonPositions.push(this._keyPositions[2][0], this._keyPositions[2][1]);
            // this._polygonPositions.push(this._keyPositions[3][0], this._keyPositions[3][1]);

            const bottomDistance = Tool.Math.geoDistance(leftBottom, rightBottom);

            // 右箭头曲线
            const rightArrowRightBottom = rightBottom;
            const rightArrowTop = rightTop;
            const rightArrowLeftBottom = Tool.Math.geoLerp(bottomCenter, topCenter, 0.3, this._keyPositions[7]);
            const rightArrowHeading = Tool.Math.hpr(rightArrowRightBottom, rightArrowTop, this._hpr)[0];
            const rightArrowCenterNeck = Tool.Math.geoMove(rightArrowTop, Math.PI + rightArrowHeading, bottomDistance * 0.1, this._keyPositions[8]);
            const rightArrowLeftNeck = Tool.Math.geoMove(rightArrowCenterNeck, rightArrowHeading - Math.PI*0.5, bottomDistance * 0.04, this._keyPositions[9]);
            const rightArrowRightNeck = Tool.Math.geoMove(rightArrowCenterNeck, rightArrowHeading + Math.PI*0.5, bottomDistance * 0.04, this._keyPositions[10]);
            const rightArrowLeftNeckOuter = Tool.Math.geoLerp(rightArrowLeftNeck, rightArrowRightNeck, -0.5, this._keyPositions[11]);
            const rightArrowRightNeckOuter = Tool.Math.geoLerp(rightArrowLeftNeck, rightArrowRightNeck, 1.5, this._keyPositions[12]);
            const rightArrowBodyLeftCenter = Tool.Math.geoLerp(rightArrowLeftNeck, rightArrowLeftBottom, 0.5, this._keyPositions[13]);
            const rightArrowBodyRightCenter = Tool.Math.geoLerp(rightArrowRightNeck, rightArrowRightBottom, 0.5, this._keyPositions[14]);
            const rightArrowBodyLeftCenterInner = Tool.Math.geoLerp(rightArrowBodyLeftCenter, rightArrowBodyRightCenter, 0.3, this._keyPositions[15]);
            const rightArrowBodyRightCenterOuter = Tool.Math.geoLerp(rightArrowBodyLeftCenter, rightArrowBodyRightCenter, 1.3, this._keyPositions[16]);
            Tool.Math.Bezier.bezier2(rightArrowRightBottom, rightArrowBodyRightCenterOuter, rightArrowRightNeck, 19, this._rightArrowRightPositions);
            // Tool.Math.Bezier.bezier2(rightArrowLeftNeck, rightArrowBodyLeftCenterInner, rightArrowLeftBottom, 19, this._rightArrowLeftPositions);

            // 左箭头曲线
            const leftArrowRightBottom = Tool.Math.geoLerp(bottomCenter, topCenter, 0.3, this._keyPositions[17]);
            const leftArrowTop = leftTop;
            const leftArrowLeftBottom = leftBottom;
            const leftArrowHeading = Tool.Math.hpr(leftArrowLeftBottom, leftArrowTop, this._hpr)[0];
            const leftArrowCenterNeck = Tool.Math.geoMove(leftArrowTop, Math.PI + leftArrowHeading, bottomDistance * 0.1, this._keyPositions[18]);
            const leftArrowLeftNeck = Tool.Math.geoMove(leftArrowCenterNeck, leftArrowHeading - Math.PI*0.5, bottomDistance * 0.04, this._keyPositions[19]);
            const leftArrowRightNeck = Tool.Math.geoMove(leftArrowCenterNeck, leftArrowHeading + Math.PI*0.5, bottomDistance * 0.04, this._keyPositions[20]);
            const leftArrowLeftNeckOuter = Tool.Math.geoLerp(leftArrowLeftNeck, leftArrowRightNeck, -0.5, this._keyPositions[21]);
            const leftArrowRightNeckOuter = Tool.Math.geoLerp(leftArrowLeftNeck, leftArrowRightNeck, 1.5, this._keyPositions[22]);
            const leftArrowBodyLeftCenter = Tool.Math.geoLerp(leftArrowLeftNeck, leftArrowLeftBottom, 0.5, this._keyPositions[23]);
            const leftArrowBodyRightCenter = Tool.Math.geoLerp(leftArrowRightNeck, leftArrowRightBottom, 0.5, this._keyPositions[24]);
            const leftArrowBodyLeftCenterOuter = Tool.Math.geoLerp(leftArrowBodyLeftCenter, leftArrowBodyRightCenter, -0.3, this._keyPositions[25]);
            const leftArrowBodyRightCenterInner = Tool.Math.geoLerp(leftArrowBodyLeftCenter, leftArrowBodyRightCenter, 0.7, this._keyPositions[26]);
            // Tool.Math.Bezier.bezier2(leftArrowRightBottom, leftArrowBodyRightCenterInner, leftArrowRightNeck, 19, this._leftArrowRightPositions);
            // Tool.Math.Bezier.bezier3(rightArrowLeftNeck, rightArrowBodyLeftCenterInner, leftArrowBodyRightCenterInner, leftArrowRightNeck, 19, this._leftArrowRightPositions);
            Tool.Math.Bezier.bezier3(rightArrowLeftNeck, rightBottom, leftBottom, leftArrowRightNeck, 19, this._leftArrowRightPositions);

            Tool.Math.Bezier.bezier2(leftArrowLeftNeck, leftArrowBodyLeftCenterOuter, leftArrowLeftBottom, 19, this._leftArrowLeftPositions);

            this._polygonPositions.length = 0;
            this._bottomCurcePositions.forEach(e => {
                this._polygonPositions.push(e[0], e[1]);
            });
            // this._polygonPositions.push(rightTop[0], rightTop[1]);
            // 右箭头
            this._rightArrowRightPositions.forEach(e => this._polygonPositions.push(e[0], e[1])); // 右箭头右曲线
            this._polygonPositions.push(rightArrowRightNeckOuter[0], rightArrowRightNeckOuter[1]); 
            this._polygonPositions.push(rightArrowTop[0], rightArrowTop[1]);
            this._polygonPositions.push(rightArrowLeftNeckOuter[0], rightArrowLeftNeckOuter[1]);
            // this._rightArrowLeftPositions.forEach(e => this._polygonPositions.push(e[0], e[1])); // 右箭头左曲线             

            // 左箭头
            this._leftArrowRightPositions.forEach(e => this._polygonPositions.push(e[0], e[1])); // 左箭头右曲线
            this._polygonPositions.push(leftArrowRightNeckOuter[0], leftArrowRightNeckOuter[1]);
            this._polygonPositions.push(leftArrowTop[0], leftArrowTop[1]);
            this._polygonPositions.push(leftArrowLeftNeckOuter[0], leftArrowLeftNeckOuter[1]);
            this._leftArrowLeftPositions.forEach(e => this._polygonPositions.push(e[0], e[1])); // 左箭头左曲线

            this._polygon.positions = this._polygonPositions;
            this._polygon.height = positions[0][2];

            this._polygonShow = true;
        }));
    }
}
        
GeoDoubleArrow.registerType(GeoDoubleArrow, 'GeoDoubleArrow');

export default GeoDoubleArrow;

