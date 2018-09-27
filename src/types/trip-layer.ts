import { Polyline } from 'leaflet';
import GtfsLayer from '@/types/layer';
import StopLayer from '@/types/stop-layer';

export default class TripLayer extends GtfsLayer {
    public geometry: L.LatLngLiteral[] | L.LatLng[] = [];
    public stops: StopLayer[] = [];
}