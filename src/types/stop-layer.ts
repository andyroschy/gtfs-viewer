import { LatLngLiteral } from 'leaflet';
import GtfsLayer from '@/types/layer';

export default class StopLayer extends GtfsLayer {

    constructor(public geometry: LatLngLiteral) {
        super();
    }
}
