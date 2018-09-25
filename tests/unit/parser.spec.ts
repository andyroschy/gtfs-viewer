import { Stop } from "@/types/gtfs-types";
import fs from 'fs';
import { parseStops } from '@/utils/parser';



let stopsTxt = ''

describe('parser.ts', () => {

    beforeAll(async (done) => {
        
         await fs.readFile('./src/data/gtfs-feed-sample/stops.txt', 'utf8', (err, data) => {
            console.warn('read data:'+ data);
            stopsTxt = data;
            done();
        });
       
    })

    describe('parseMap', () => {
        it('correctly parses sample data', () => {
            const controlValue1: Stop = {
                stopId: 'FUR_CREEK_RES',
                stopName: 'Furnace Creek Resort (Demo)',
                stopLat: 36.425288,
                stopLon: -117.133162
            }; 
            const controlValue2: Stop = {
                stopId: 'BEATTY_AIRPORT',
                stopName: 'Nye County Airport (Demo)',
                stopLat: 36.868446,
                stopLon: -116.784582
            }; 
            const stops = parseStops(stopsTxt);
            console.log(stops);
            expect(stops[0]).toMatchObject(controlValue1);
            expect(stops[1]).toMatchObject(controlValue2);
        })
    })
});
