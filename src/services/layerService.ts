import { GtfsFeed } from '@/types/gtfs-feed';
import { KeyMap } from '@/types/general-types';
import { Stop, Shape, Route, Trip, StopTime } from '@/types/gtfs-types';
import L, { Polyline, LatLng, LatLngTuple, LatLngExpression, latLng } from 'leaflet';
import RouteLayer from '@/types/route-layer';
import TripLayer from '@/types/trip-layer';
import StopLayer from '@/types/stop-layer';

export function getRouteLayers(feed: GtfsFeed) {
    const indexedStops = arrToKeyMap(feed.stops, (s) => s.stopId)
    const routeLayers = feed.routes.map( (x) => {
        const routeLayer = new RouteLayer();
        routeLayer.id = x.routeId;
        routeLayer.name = x.routeLongName;
        routeLayer.description = x.routeDesc || '';
        routeLayer.color = x.routeColor || '';
        return routeLayer;
    });
    const shapes = reduceShapes(feed.shapes);
    //const schedule = reduceSchedule(feed.stopTimes);
    const indexedRouteLayers = arrToKeyMap(routeLayers, (r) => r.id);    
    
    for (const trip of feed.trips) {
        const tripLayer = mapToTripLayer(trip, shapes, indexedStops);
        indexedRouteLayers[trip.routeId].trips.push(tripLayer);
    }
    //const indexedServices = arrToKeyMap(feed.stopTimes, (t) => t.stopId);
    
    const routeCoordinates: KeyMap<LatLng[]> = {};
}

function mapToTripLayer(trip: Trip, shapes: KeyMap<LatLng[]>) : TripLayer {
    const tripLayer = new TripLayer();
    tripLayer.id = trip.tripId;
    tripLayer.name = trip.tripShortName || '';    
    if(trip.shapeId && shapes[trip.shapeId]) {        
        tripLayer.geometry =  shapes[trip.shapeId];
    }else {

    }    
    return tripLayer;
}

interface Schedule {
    stops: StopLayer[];
    geometry: LatLngExpression[];
}

function reduceSchedule(stopTime: StopTime[], stops: KeyMap<Stop>) {
    return stopTime.reduce( (accumulated: KeyMap<Schedule>, current: StopTime) => {
        if(!accumulated[current.tripId]) {
            accumulated[current.tripId] = {
                stops: [],
                geometry: []
            };
        }
        const stop = stops[current.stopId];
        const layer = new StopLayer({lat: stop.stopLat, lng: stop.stopLon});  
        layer.name = stop.stopName || '';
        layer.id = stop.stopId;
        accumulated[current.tripId].stops[current.stopSequence] = layer;
        accumulated[current.tripId].geometry[current.stopSequence] = layer.geometry;
        return accumulated;
    }, {} as KeyMap<Schedule>);
}

function reduceShapes(shapes: Shape[]) : KeyMap<LatLng[]> {
    return shapes.reduce( (accumulated: KeyMap<LatLng[]>, current: Shape) => {
        if(!accumulated[current.shapeId]) {
            accumulated[current.shapeId] = [];
        }
        accumulated[current.shapeId][current.shapePtSequence] = 
            L.latLng(current.shapePtLat, current.shapePtLon);        
        return accumulated;
    }, {} as KeyMap<LatLng[]>);
}

function arrToKeyMap<T>(arr: T[], keyAccesor: (item: T) => string): KeyMap<T> {
    return arr.reduce( (accumulated: KeyMap<T>, current: T) => {
        accumulated[keyAccesor(current)] = current;
        return accumulated;
    }, {} as KeyMap<T>);
}