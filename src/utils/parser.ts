import Papa from 'papaparse';
import { toPascalCase } from '@/utils/string-utlis';
import { Stop, Route, Trip, StopTime,
    SecondsSinceMidnight, Calendar, Shape, Agency } from '@/types/gtfs-types';


interface TypeMapping {
 columns: string[];
 convert: (v: string) => any;
}

function HHMMSStoSecondsSinceMidnight(value: string): SecondsSinceMidnight {
    const segments = value.split(':').map((x) => parseInt(x, 10));
    return segments[0] * 3600 + segments[1] * 60 + segments[2];
}

function toBoolean(value: string ): boolean {
    return value === '0' ? false : true;
}

function toDate(value: string): Date {
    // date in format YYYYMMDD
    return new Date(
        parseInt(value.slice(0, 4), 10),
        parseInt(value.slice(4, 6), 10),
        parseInt(value.slice(6, 8), 10));
}

async function parseEntity<T>(source: string | File, mappers: TypeMapping[]  = []): Promise<T[]> {
    return parseCsv(source).then( (parsed) => {
        return parsed.filter( (x) => x).map( (r) => {
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
    }) 
}

export async function parseStops(source: string | File): Promise<Stop[]>  {
   return parseEntity<Stop>(source, [{
      columns: ['stopLat', 'stopLon'],
      convert: parseFloat,
  }]);
}

export  async function parseRoutes(source: string | File): Promise<Route[]>  {
    return parseEntity<Route>(source, [{
        columns: ['routeType'],
        convert: parseFloat,
    }]);
 }

export async function parseTrip(source: string | File): Promise<Trip[]>  {
    return parseEntity<Trip>(source, [{
        columns: ['wheelchairAccessible', 'bikesAllowed'],
        convert: (v) => parseInt(v, 10),
    }, {
        columns: ['directionId'],
        convert: toBoolean,
    }]);
 }

export async function parseStopTimes(source: string | File): Promise<StopTime[]>  {
    return parseEntity<StopTime>(source, [{
        columns: ['stopSequence', 'shapeDistTraveled', 'pickupType', 'dropOffType'],
        convert: (v) => parseInt(v, 10),
    }, {
        columns: ['arrivalTime', 'departureTime'],
        convert: HHMMSStoSecondsSinceMidnight,
    }, {
        columns: ['timepoint'],
        convert: toBoolean,
    }]);
 }

export async function parseCalendar(source: string | File): Promise<Calendar[]>  {
    return parseEntity<Calendar>(source, [{
        columns: ['startDate', 'endDate'],
        convert: toDate,
    }, {
        columns: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        convert: toBoolean,
    }]);
 }

export async function parseShapes(source: string | File): Promise<Shape[]>  {
    return parseEntity<Shape>(source, [{
        columns: ['shapePtLat', 'shapePtLon', 'shapeDistTraveled'],
        convert: parseFloat,
    }, {
        columns: ['shapePtSequence'],
        convert:  (v) => parseInt(v, 10),
    }]);
 }

export async function parseAgencies(source: string | File): Promise<Agency[]> {
     return parseEntity<Agency>(source);
 }

async function parseCsv(source: string | File): Promise<any[]> {
    return new Promise<any[]>( (resolve, reject) => {
        const config: Papa.ParseConfig = {
            header: true,
            trimHeaders: true,
            complete: (result) => {
                if (result.errors && result.errors.length > 0) {
                    console.error(result.errors);
                    for (const error of result.errors) {
                        // remove errored rows
                        result.data[error.row] = undefined;
                    }
                }
                resolve(result.data);
            },
            error: (e) => {
                reject(e);
            }
        };
        // has no runtime effect, but this way the compiler won't complain
        if(typeof source === 'string') {
            Papa.parse(source, config);
        }else {
            Papa.parse(source, config);
        }
        
    });
    
    
}
