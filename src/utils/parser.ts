import { parse, ParseConfig } from 'papaparse';
import { toPascalCase } from '@/utils/string-utlis';
import { Stop, Route, Trip } from '@/types/gtfs-types';

interface TypeMapping {
 columns: string[];
 convert: (v: string) => any;
}

function parseEntity<T>(source: string, mappers: TypeMapping[]  = []): T[] {

    return parseCsv(source).map( (r) => {
        const entity: any = {};
        for (const column in r) {
            if (!r.hasOwnProperty(column)) { continue; }
            const targetColumn = toPascalCase(column);
            const mapper = mappers.find((x) => x.columns.includes(targetColumn)) || { convert: undefined};
            const convert  = mapper!.convert || ( (v: string) => v );
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
        convert: parseFloat
    },{
        columns:['directionId'],
        convert: Boolean
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
