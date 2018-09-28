import { LatLngLiteral } from 'leaflet';
import GtfsLayer from '@/types/gtfs-layer';
import StopLayer from '@/types/stop-layer';
import { StopTime } from '@/types/gtfs-types';

export default class TripLayer extends GtfsLayer {
    public geometry: LatLngLiteral[] = [];
    public stops: StopLayer[] = [];
    public stopTimes: StopTime[] = [];
}
