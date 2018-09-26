import { parse, ParseConfig } from 'papaparse';
import { toPascalCase } from '@/utils/string-utlis';
import { Stop, Route, Trip, StopTime, SecondsSinceMidnight } from '@/types/gtfs-types';

interface TypeMapping {
 columns: string[];
 convert: (v: string) => any;
}

function HHMMSStoSecondsSinceMidnight(value: string): SecondsSinceMidnight {
    const segments = value.split(':').map((x) => parseInt(x,10));
    return segments[0] * 3600 + segments[1] * 60 + segments[2];
}

function toBoolean(value: string ): boolean {
    console.log(value);
    return value == '0' ? false : true;
}

function parseEntity<T>(source: string, mappers: TypeMapping[]  = []): T[] {

    return parseCsv(source).map( (r) => {
        const entity: any = {};
        for (const column in r) {
            if (!r.hasOwnProperty(column)) { continue; }
            const targetColumn = toPascalCase(column);            
            const mapper = mappers.find((x) => x.columns.includes(targetColumn)) || { convert: undefined};
            const convert  = mapper.convert || ( (v: string) => v );
            // convert to values of types as defined in the mappers
            entity[targetColumn] = r[column] !== undefined ? convert(r[column]) : undefined;
        }
        return entity;
    });
}

export function parseStops(source: string): Stop[]  {
   return parseEntity<Stop>(source, [{
      columns: ['stopLat', 'stopLon'],
      convert: parseFloat,
  }]);
}

export function parseRoutes(source: string): Route[]  {
    return parseEntity<Route>(source, [{
        columns: ['routeType'],
        convert: parseFloat
    }]);
 }

 export function parseTrip(source: string): Trip[]  {
    return parseEntity<Trip>(source, [{
        columns: ['wheelchairAccessible','bikesAllowed'],
        convert: (v) => parseInt(v,10)
    },{
        columns: ['directionId'],
        convert: toBoolean
    }]);
 }

 export function parseStopTimes(source: string): StopTime[]  {
    return parseEntity<StopTime>(source, [{
        columns: ['stopSequence','shapeDistTraveled','pickupType','dropOffType'],
        convert: (v) => parseInt(v,10)
    },{
        columns: ['arrivalTime','departureTime'],
        convert: HHMMSStoSecondsSinceMidnight
    },{
        columns:['timepoint'],
        convert: toBoolean
    }]);
 }

function parseCsv(source: string): any[] {
    const config: ParseConfig = {
        header: true,
        delimiter: ',',
    };
    const result =  parse(source, config);
    if (result.errors && result.errors.length > 0) {
        console.error(result.errors);
    }
    return result.data;
}