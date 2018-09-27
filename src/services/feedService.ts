import testStops from '@/data/gtfs-feed-sample/stops.txt';
import testAgencies from '@/data/gtfs-feed-sample/agency.txt';
import testShapes from '@/data/gtfs-feed-sample/shapes.txt';
import testStopTimes from '@/data/gtfs-feed-sample/stop_times.txt';
import testTrips from '@/data/gtfs-feed-sample/trips.txt';
import testRoutes from '@/data/gtfs-feed-sample/routes.txt';
import { parseStops, parseAgencies, parseStopTimes, parseTrip, parseShapes, parseRoutes } from '@/utils/parser';
import { Stop } from '@/types/gtfs-types';
import { RawGtfsFeed, GtfsFeed } from '@/types/gtfs-feed';

export function parseFeed(rawFeed: RawGtfsFeed): GtfsFeed {
    // every feed entry asserted as string until i add file support
    return {
        agencies: parseAgencies(rawFeed.agencies as string),
        stops: parseStops(rawFeed.stops as string),
        stopTimes: parseStopTimes(rawFeed.stopTimes as string),
        trips: parseTrip(rawFeed.trips as string),
        routes: parseRoutes(rawFeed.routes as string),
        shapes: rawFeed.shapes ? parseShapes(rawFeed.shapes as string) : []
    }
}

export function getTestFeed(): RawGtfsFeed {
    return {
        agencies: testAgencies,
        stops: testStops,
        stopTimes: testStopTimes,
        trips: testTrips,
        routes: testRoutes,
        shapes: testShapes
    }
}

