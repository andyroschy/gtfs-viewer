import { parse, ParseConfig } from 'papaparse';
import { toPascalCase } from '@/utils/string-utlis';
import { Stop } from '@/types/gtfs-types';

interface TypeMapping {
 columns: string[];
 convert: (v: string) => any;
}

function parseEntity<T>(source: string, mappers: TypeMapping[] = []): T[] {

    return parseCsv(source).map( (r) => {
        const entity: any = {};
        for (const column in r) {
            if (!r.hasOwnProperty(column)) { continue; }
            const targetColumn = toPascalCase(column);
            const mapper = mappers.find((x) => x.columns.includes(targetColumn)) || { convert: undefined};
            const convert  = mapper!.convert || ( (v: string) => v );
            // convert to values of types as defined in the mappers
            entity[targetColumn] = convert(r[column]);
        }
        return entity;
    });
}

export function parseStops(source: string): Stop[]  {
   let s: Stop;
   return parseEntity<Stop>(source, [{
      columns: ['stopLat', 'stopLon'],
      convert: parseFloat,
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
