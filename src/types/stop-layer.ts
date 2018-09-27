import L, { LatLngLiteral } from 'leaflet';
import GtfsLayer from '@/types/layer';

export default class StopLayer extends GtfsLayer {

    public get latlng(): L.LatLng {
        return L.latLng(this.geometry);
    }
    constructor(public geometry: LatLngLiteral) {
        super();
    }
}
