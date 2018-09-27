import { Stop, Route, RouteType, Trip, StopTime, Calendar } from '@/types/gtfs-types';
import fs, { read } from 'fs';
import { parseStops, parseRoutes, parseStopTimes, parseTrip, parseCalendar } from '@/utils/parser';



let stopsTxt = '';
let routesTxt = '';
let tripsTxt = '';
let stopTimesTxt = '';
let calendarTxt = '';

describe('parser.ts', () => {

    beforeAll((done) => {
        let fileCount = 0;
        const totalFiles = 5;
        function readFinished() {
            if (++fileCount === totalFiles) { done(); }
        }
        fs.readFile('./src/data/gtfs-feed-sample/stops.txt', 'utf8', (err, data) => {
            stopsTxt = data;
            readFinished();
        });

        fs.readFile('./src/data/gtfs-feed-sample/routes.txt', 'utf8', (err, data) => {
            routesTxt = data;
            readFinished();
        });

        fs.readFile('./src/data/gtfs-feed-sample/trips.txt', 'utf8', (err, data) => {
            tripsTxt = data;
            readFinished();
        });

        fs.readFile('./src/data/gtfs-feed-sample/stop_times.txt', 'utf8', (err, data) => {
            stopTimesTxt = data;
            readFinished();
        });

        fs.readFile('./src/data/gtfs-feed-sample/calendar.txt', 'utf8', (err, data) => {
            calendarTxt = data;
            readFinished();
        });
    });

    describe('parseStops', () => {
        it('correctly parses sample stops', () => {
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
        it('correctly parses sample routes', () => {
            const controlValue1: Route = {
                routeId: 'AB',
                agencyId: 'DTA',
                routeShortName: '10',
                routeLongName: 'Airport - Bullfrog',
                routeType: RouteType.Bus,
            };
            const controlValue2: Route = {
                routeId: 'BFC',
                agencyId: 'DTA',
                routeShortName: '20',
                routeLongName: 'Bullfrog - Furnace Creek Resort',
                routeType: RouteType.Bus,
            };
            const routes = parseRoutes(routesTxt);
            expect(routes[0]).toMatchObject(controlValue1);
            expect(routes[1]).toMatchObject(controlValue2);
        });
    });

    describe('parseTrip', () => {
        it('correctly parses trips', () => {
            const controlValue1: Trip = {
                routeId: 'AB',
                serviceId: 'FULLW',
                tripId: 'AB1',
                tripHeadsign: 'to Bullfrog',
                directionId: false,
                blockId: '1',
                shapeId: '',
            };
            const controlValue2: Trip = {
                routeId: 'AB',
                serviceId: 'FULLW',
                tripId: 'AB2',
                tripHeadsign: 'to Airport',
                directionId: true,
                blockId: '2',
                shapeId: '',
            };
            const trip = parseTrip(tripsTxt);
            expect(trip[0]).toMatchObject(controlValue1);
            expect(trip[1]).toMatchObject(controlValue2);
        });
    });

    describe('parse stop times', () => {
        it('correctly parses stop times', () => {
            const controlValue1: StopTime = {
                tripId: 'STBA',
                arrivalTime: 21600,
                departureTime: 21600,
                stopId: 'STAGECOACH',
                stopSequence: 1,
            };
            const controlValue2: StopTime = {
                tripId: 'STBA',
                arrivalTime: 22800,
                departureTime: 22800,
                stopId: 'BEATTY_AIRPORT',
                stopSequence: 2,
            };
            const stopTimes = parseStopTimes(stopTimesTxt);
            expect(stopTimes[0]).toMatchObject(controlValue1);
            expect(stopTimes[1]).toMatchObject(controlValue2);
        });
    });

    describe('parse Calendar', () => {
        it('correctly parses Calendar', () => {
            const controlValue1: Calendar = {
                serviceId: 'WE',
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false, 
                friday: false, 
                saturday: true,
                sunday: true,
                startDate: new Date(2006,7,1),
                endDate: new Date(2006, 7, 31)
            };
            const controlValue2: Calendar = {
                serviceId: 'WD',
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true, 
                friday: true, 
                saturday: false,
                sunday: false,
                startDate: new Date(2006,7,1),
                endDate: new Date(2006, 7, 31)
            };
            const calendar = parseCalendar(calendarTxt);
            expect(calendar[0]).toMatchObject(controlValue1);
            expect(calendar[1]).toMatchObject(controlValue2);
        });
    });

});
