import { Stop, Route, RouteType } from '@/types/gtfs-types';
import fs, { read } from 'fs';
import { parseStops, parseRoutes } from '@/utils/parser';



let stopsTxt = '';
let routesTxt = '';

describe('parser.ts', () => {

    beforeAll((done) => {
        let fileCount = 0;
        const totalFiles = 2;
        function readFinished() {
            if(++fileCount === totalFiles) done();
        }
        fs.readFile('./src/data/gtfs-feed-sample/stops.txt', 'utf8', (err, data) => {
            stopsTxt = data;
            readFinished();
        });

        fs.readFile('./src/data/gtfs-feed-sample/routes.txt', 'utf8', (err, data) => {
            routesTxt = data;
            readFinished();
        });
    });

    describe('parsestop', () => {
        it('correctly parses sample data', () => {
            const controlValue1: Stop = {
                stopId: 'FUR_CREEK_RES',
                stopName: 'Furnace Creek Resort (Demo)',
                stopLat: 36.425288,
                stopLon: -117.133162,
            };
            const controlValue2: Stop = {
                stopId: 'BEATTY_AIRPORT',
                stopName: 'Nye County Airport (Demo)',
                stopLat: 36.868446,
                stopLon: -116.784582,
            };
            const stops = parseStops(stopsTxt);
            expect(stops[0]).toMatchObject(controlValue1);
            expect(stops[1]).toMatchObject(controlValue2);
        });
    });

    describe('parseRoute', () => {
        it('correctly parses sample data', () => {
            const controlValue1: Route = {
                routeId: 'AB',
                agencyId: 'DTA',
                routeShortName: '10',
                routeLongName: 'Airport - Bullfrog',
                routeType: RouteType.Bus
            };
            const controlValue2: Route = {
                routeId: 'BFC',
                agencyId: 'DTA',
                routeShortName: '20',
                routeLongName: 'Bullfrog - Furnace Creek Resort',
                routeType: RouteType.Bus
            };
            const routes = parseRoutes(routesTxt);
            expect(routes[0]).toMatchObject(controlValue1);
            expect(routes[1]).toMatchObject(controlValue2);
        });
    });
});