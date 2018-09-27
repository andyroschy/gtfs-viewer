import { GtfsFeed } from '@/types/gtfs-feed';
import { KeyMap } from '@/types/general-types';
import { Stop, Shape, Route, Trip, StopTime } from '@/types/gtfs-types';
import L, { Polyline, LatLng, LatLngTuple, LatLngExpression, latLng, LatLngLiteral } from 'leaflet';
import RouteLayer from '@/types/route-layer';
import TripLayer from '@/types/trip-layer';
import StopLayer from '@/types/stop-layer';

export function getRouteLayers(feed: GtfsFeed) {
    const indexedStops = arrToKeyMap(feed.stops, (s) => s.stopId);
    const routeLayers = feed.routes.map( (x) => {
        const routeLayer = new RouteLayer();
        routeLayer.id = x.routeId;
        routeLayer.name = x.routeLongName;
        routeLayer.description = x.routeDesc || '';
        routeLayer.color = x.routeColor || '';
        return routeLayer;
    });
    const shapes = reduceShapes(feed.shapes);
    const schedule = reduceSchedule(feed.stopTimes, indexedStops);
    const indexedRouteLayers = arrToKeyMap(routeLayers, (r) => r.id);

    for (const trip of feed.trips) {
        const tripLayer = mapToTripLayer(trip, shapes, schedule);
        indexedRouteLayers[trip.routeId].trips.push(tripLayer);
    }
}

function mapToTripLayer(trip: Trip, shapes: KeyMap<LatLng[]>, schedule: KeyMap<Schedule>): TripLayer {
    const tripLayer = new TripLayer();
    tripLayer.id = trip.tripId;
    tripLayer.name = trip.tripShortName || '';
    // if the trip has a defined shape use it,
    // otherwise approximate it with the stops
    if (trip.shapeId && shapes[trip.shapeId]) {
        tripLayer.geometry =  shapes[trip.shapeId];
    } else {
        tripLayer.geometry = schedule[trip.tripId].geometry;
    }
    tripLayer.stops = schedule[trip.tripId].stops;
    tripLayer.stopTimes = schedule[trip.tripId].stopTimes;
    return tripLayer;
}

interface Schedule {
    stops: StopLayer[];
    geometry: LatLngLiteral[];
    stopTimes: StopTime[];
}

function reduceSchedule(stopTime: StopTime[], stops: KeyMap<Stop>) {
    return stopTime.reduce( (accumulated: KeyMap<Schedule>, current: StopTime) => {
        if (!accumulated[current.tripId]) {
            accumulated[current.tripId] = {
                stops: [],
                geometry: [],
                stopTimes: [],
            };
        }
        const stop = stops[current.stopId];
        const layer = new StopLayer({lat: stop.stopLat, lng: stop.stopLon});
        layer.name = stop.stopName || '';
        layer.id = stop.stopId;
        accumulated[current.tripId].stops[current.stopSequence] = layer;
        accumulated[current.tripId].geometry[current.stopSequence] = layer.geometry;
        accumulated[current.tripId].stopTimes[current.stopSequence] = current;
        return accumulated;
    }, {} as KeyMap<Schedule>);
}


function reduceShapes(shapes: Shape[]): KeyMap<LatLng[]> {
    // group shape's coordinates by shape id and sorted by shapePtsquence
    return shapes.reduce( (accumulated: KeyMap<LatLng[]>, current: Shape) => {
        if (!accumulated[current.shapeId]) {
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
