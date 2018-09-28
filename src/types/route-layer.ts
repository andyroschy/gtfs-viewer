import L, {LatLng, Polyline, LatLngLiteral, LatLngExpression} from 'leaflet';
import { HexCode, StopTime } from '@/types/gtfs-types';
import GtfsLayer from '@/types/gtfs-layer';
import TripLayer from '@/types/trip-layer';
import StopLayer from '@/types/stop-layer';

export default class RouteLayer extends GtfsLayer {
    public color: HexCode = '000000';
    public trips: TripLayer[] = [];
    public agencyId: string = '';
    public stopsVisible: boolean = false;
    public get geometry(): LatLngLiteral[] {
        // for simplicity's sake, assume that all trips have the same geomtry
        return this.trips[0].geometry;
    }

    public getStopSchedule(stop: StopLayer) {
        // filter trips that include the stop,
        // get their stop times as a single array and sorted by arrival time
        return this.trips
                    .filter( (trip) => trip.stops.includes(stop))                    
                    .map( (trip) => trip.stopTimes) 
                    .reduce( (accc, current) => {
                        accc.push(...current);
                        return accc;
                    }, [])
                    .sort( ( (left, right) => {
                        return left.arrivalTime > right.arrivalTime ? 1 
                                : left.arrivalTime == right.arrivalTime ? 0 
                                : -1; 
                    }));
    }

    public get stops(): StopLayer[] {
        // for simplicity's sake, assume that all trips have the same stopsx
        return this.trips[0].stops;
    }
}

