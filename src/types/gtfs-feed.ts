import { Stop, StopTime, Trip, Route, Shape } from '@/types/gtfs-types';

export interface GtfsFeed {
    stops: Stop[];
    routes: Route[];
    stopTimes: StopTime[];
    trips: Trip[];
    shapes: Shape[];
}

export type FeedEntry = string | File;

export interface RawGtfsFeed {
    stops: FeedEntry;
    routes: FeedEntry;
    stopTImes: FeedEntry;
    trips: FeedEntry;
    shapes?: FeedEntry;
}
