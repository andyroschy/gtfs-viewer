import testStops from '@/data/gtfs-feed-sample/stops.txt';
import testAgencies from '@/data/gtfs-feed-sample/agency.txt';
import testShapes from '@/data/gtfs-feed-sample/shapes.txt';
import testStopTimes from '@/data/gtfs-feed-sample/stop_times.txt';
import testTrips from '@/data/gtfs-feed-sample/trips.txt';
import testRoutes from '@/data/gtfs-feed-sample/routes.txt';
import { parseStops, parseAgencies, parseStopTimes, parseTrip, parseShapes, parseRoutes } from '@/utils/parser';
import { Stop } from '@/types/gtfs-types';
import { RawGtfsFeed, GtfsFeed } from '@/types/gtfs-feed';
import jszip from 'jszip';
import {KeyMap} from '@/types/general-types';

export async function parseFeed(rawFeed: RawGtfsFeed): Promise<GtfsFeed> {
    // every feed entry asserted as string until i add file support
    return {
        agencies: await parseAgencies(rawFeed.agencies),
        stops: await parseStops(rawFeed.stops),
        stopTimes: await parseStopTimes(rawFeed.stopTimes),
        trips: await parseTrip(rawFeed.trips),
        routes: await parseRoutes(rawFeed.routes),
        shapes: rawFeed.shapes ? await parseShapes(rawFeed.shapes) : []
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

type RawFeedKey = keyof RawGtfsFeed;

const fileNamesToKeys: KeyMap<RawFeedKey>  = {
    ['agency.txt']: 'agencies',
    ['stops.txt'] :'stops',
    ['stop_times.txt'] :'stopTimes',
    ['shapes.txt'] : 'shapes',
    ['trips.txt'] : 'trips',
    ['routes.txt'] :'routes',
}

export function getFeedFromFile(source: File | File[]): Promise<GtfsFeed> {    
    if((source as File[]).length) {
        let files = source as File[];        
        const rawFeed: Partial<RawGtfsFeed> = {};
        for (const file of files) {
            const feedItem = fileNamesToKeys[file.name]; 
            if(!feedItem) continue;
            rawFeed[feedItem] = file;
        }
        return parseFeed(rawFeed as RawGtfsFeed);
    }
    return parseZip(source as File).then( (f) => {
        return parseFeed(f);
    });
}
       

// read feed files as text and get the raw feed 
function parseZip(file: File): Promise<RawGtfsFeed> {
    const rawFeed: Partial<RawGtfsFeed> = {};
    // wrap the code in a promise so it's easier to handle asynchronity
    return new Promise<RawGtfsFeed>((resolve, reject) => {
        // read the zip
        jszip.loadAsync(file).then( (zip) => {
            const totalFiles = Object.keys(zip.files).length;
            let readFiles = 0;            
            let abort = false;
            // read each file
            zip.forEach( (path, entry) => {
                const feedItem = fileNamesToKeys[entry.name];                
                // don't continue processing the file if we had an error
                if(abort) return;
                // if the file is not on one of the feed items we can handle, skip it                
                if(!feedItem) {
                    readFiles++;
                    // resolve when all files are read
                    if( readFiles === totalFiles) {
                        resolve(rawFeed as RawGtfsFeed);
                    }
                    return;
                }                
                entry.async('text').then( (f: string) => {
                    readFiles++;
                    rawFeed[feedItem] = f;
                    // resolve once all files are read
                    if(readFiles == totalFiles) {
                        resolve(rawFeed as RawGtfsFeed);
                    } 
                } ).catch((e) => {
                    reject(e);
                    abort = true;
                });
            });
          }).catch((e) => {
              reject(e);
        }); 
    });
}

