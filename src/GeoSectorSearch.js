import PlotPolylineBase from "./base/PlotPolylineBase";
const Tool = XE.Tool;

class GeoSectorSearch extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._onlyMove = true;
        this._fixedPositionsNum = 2;

        this._positions = new Array(6).fill(0).map(() => [0, 0, 0]);
        this._leftArrowPosition1 = [0, 0, 0];
        this._rightArrowPosition1 = [0, 0, 0];
        this._leftArrowPosition2 = [0, 0, 0];
        this._rightArrowPosition2 = [0, 0, 0];
        this._leftArrowPosition3 = [0, 0, 0];
        this._rightArrowPosition3 = [0, 0, 0];
        this._leftArrowPosition4 = [0, 0, 0];
        this._rightArrowPosition4 = [0, 0, 0];
        this._leftArrowPosition5 = [0, 0, 0];
        this._rightArrowPosition5 = [0, 0, 0];
        this._leftArrowPosition6 = [0, 0, 0];
        this._rightArrowPosition6 = [0, 0, 0];
        this._leftArrowPosition7 = [0, 0, 0];
        this._rightArrowPosition7 = [0, 0, 0];

        this._polylinePositions = [];

        this._scratchHpr = [0, 0, 0];
        this._scratchPos = [0, 0, 0];
        this.disposers.push(
            XE.MVVM.watch(
                () => [...this.positions.map(e => [...e])],
                positions => {
                    if (positions.length === 2) {
                        positions[1][2] = positions[0][2];
                        const geod = Tool.Math.geoDistance(positions[0], positions[1]);
                        const center = positions[0];

                        if (geod > 0) {
                            const hpr = Tool.hpr(
                                positions[0],
                                positions[1],
                                this._scratchHpr
                            );
                            for (let i = 0; i < 6; ++i) {
                                Tool.Math.geoMove(
                                    positions[0],
                                    hpr[0] + Cesium.Math.PI_OVER_THREE * i,
                                    geod,
                                    this._positions[i]
                                );
                            }

                            this._polylinePositions.length = 0;

                            Tool.Math.geoMove(
                                this._positions[0],
                                hpr[0] + (Math.PI * 7) / 6,
                                geod * 0.1,
                                this._leftArrowPosition1
                            );
                            Tool.Math.geoMove(
                                this._positions[0],
                                hpr[0] - (Math.PI * 7) / 6,
                                geod * 0.1,
                                this._rightArrowPosition1
                            );
                            Tool.Math.geoMove(
                                this._positions[1],
                                hpr[0] + (Math.PI * 3) / 2,
                                geod * 0.1,
                                this._leftArrowPosition2
                            );
                            Tool.Math.geoMove(
                                this._positions[1],
                                hpr[0] - Math.PI / 6,
                                geod * 0.1,
                                this._rightArrowPosition2
                            );
                            Tool.Math.geoMove(
                                this._positions[4],
                                hpr[0] + Math.PI / 2,
                                geod * 0.1,
                                this._leftArrowPosition3
                            );
                            Tool.Math.geoMove(
                                this._positions[4],
                                hpr[0] + Math.PI / 6,
                                geod * 0.1,
                                this._rightArrowPosition3
                            );
                            Tool.Math.geoMove(
                                this._positions[5],
                                hpr[0] - (Math.PI * 5) / 6,
                                geod * 0.1,
                                this._leftArrowPosition4
                            );
                            Tool.Math.geoMove(
                                this._positions[5],
                                hpr[0] + (Math.PI * 5) / 6,
                                geod * 0.1,
                                this._rightArrowPosition4
                            );
                            Tool.Math.geoMove(
                                this._positions[2],
                                hpr[0] - Math.PI / 6,
                                geod * 0.1,
                                this._leftArrowPosition5
                            );
                            Tool.Math.geoMove(
                                this._positions[2],
                                hpr[0] - Math.PI / 2,
                                geod * 0.1,
                                this._rightArrowPosition5
                            );
                            Tool.Math.geoMove(
                                this._positions[3],
                                hpr[0] + Math.PI / 2,
                                geod * 0.1,
                                this._leftArrowPosition6
                            );
                            Tool.Math.geoMove(
                                this._positions[3],
                                hpr[0] + Math.PI / 6,
                                geod * 0.1,
                                this._rightArrowPosition6
                            );
                            Tool.Math.geoMove(
                                this.positions[0],
                                hpr[0] + (Math.PI * 7) / 6,
                                geod * 0.1,
                                this._leftArrowPosition7
                            );
                            Tool.Math.geoMove(
                                this.positions[0],
                                hpr[0] - (Math.PI + Math.PI / 6),
                                geod * 0.1,
                                this._rightArrowPosition7
                            );

                            this._polylinePositions.push([...positions[0]]);
                            this._polylinePositions.push([...this._positions[0]]);
                            this._polylinePositions.push([...this._leftArrowPosition1]);
                            this._polylinePositions.push([...this._positions[0]]);
                            this._polylinePositions.push([...this._rightArrowPosition1]);
                            this._polylinePositions.push([...this._positions[0]]);
                            this._polylinePositions.push([...this._positions[1]]);
                            this._polylinePositions.push([...this._leftArrowPosition2]);
                            this._polylinePositions.push([...this._positions[1]]);
                            this._polylinePositions.push([...this._rightArrowPosition2]);
                            this._polylinePositions.push([...this._positions[1]]);
                            this._polylinePositions.push([...this._positions[4]]);
                            this._polylinePositions.push([...this._leftArrowPosition3]);
                            this._polylinePositions.push([...this._positions[4]]);
                            this._polylinePositions.push([...this._rightArrowPosition3]);
                            this._polylinePositions.push([...this._positions[4]]);
                            this._polylinePositions.push([...this._positions[5]]);
                            this._polylinePositions.push([...this._leftArrowPosition4]);
                            this._polylinePositions.push([...this._positions[5]]);
                            this._polylinePositions.push([...this._rightArrowPosition4]);
                            this._polylinePositions.push([...this._positions[5]]);
                            this._polylinePositions.push([...this._positions[2]]);
                            this._polylinePositions.push([...this._leftArrowPosition5]);
                            this._polylinePositions.push([...this._positions[2]]);
                            this._polylinePositions.push([...this._rightArrowPosition5]);
                            this._polylinePositions.push([...this._positions[2]]);
                            this._polylinePositions.push([...this._positions[3]]);
                            this._polylinePositions.push([...this._leftArrowPosition6]);
                            this._polylinePositions.push([...this._positions[3]]);
                            this._polylinePositions.push([...this._rightArrowPosition6]);
                            this._polylinePositions.push([...this._positions[3]]);
                            this._polylinePositions.push([...positions[0]]);
                            this._polylinePositions.push([...this._leftArrowPosition7]);
                            this._polylinePositions.push([...positions[0]]);
                            this._polylinePositions.push([...this._rightArrowPosition7]);

                            this._polyline.positions = this._polylinePositions;
                            this._polylineShow = true;
                            return;
                        }
                    }
                    this._polylineShow = false;
                }
            )
        );
    }
}

GeoSectorSearch.registerType(GeoSectorSearch, "GeoSectorSearch");

export default GeoSectorSearch;
