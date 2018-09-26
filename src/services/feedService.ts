import testStops from '@/data/gtfs-feed-sample/stops.txt';
import { parseStops } from '@/utils/parser';
import { Stop } from '@/types/gtfs-types';

export function getStops(): Stop[] {
    return parseStops(testStops);
}