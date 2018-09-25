import { parse, ParseConfig } from "papaparse";
import { toPascalCase } from '@/utils/string-utlis';
import { Stop } from '@/types/gtfs-types';

interface TypeMapping {
 columns: string[];
 convert: (v:string) => any;
}

function parseEntity<T>(source: string, mappers: TypeMapping[] = []): T[]{
    
    return parseCsv(source).map( (r) => {
        const entity: any = {};
        for (const column in r) {
            if (!r.hasOwnProperty(column)) { continue; }
            let targetColumn = toPascalCase(column)
            let mapper = mappers.find(x => x.columns.includes(targetColumn)) || { convert: undefined};
            let convert  = mapper!.convert || ( (v: string) => v );
            // convert to values of types as defined in the mappers
            entity[targetColumn] = convert(r[column]);
        }
        return entity;
    });
}

export function parseStops(source:string): Stop[]  {
   var s: Stop;   
    return parseEntity<Stop>(source, [{
      columns:['stopLat','stopLon'],
      convert: parseFloat
  }]);
}

function parseCsv(source: string): any[] {
    let config: ParseConfig = {
        header: true,
        delimiter:','
    }
    let result =  parse(source, config);
    if(result.errors && result.errors.length > 0) {
        console.error(result.errors);
    }
    return result.data;
}