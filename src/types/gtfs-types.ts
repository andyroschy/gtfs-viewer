//borrowed from: https://github.com/NotWoods/query-pouch-gtfs/blob/master/src/interfaces.ts
export type GTFSName = 'agency' | 'calendar' | 'calendar_dates'
	| 'fare_attributes' | 'fare_rules' | 'feed_info' | 'frequencies'
	| 'routes' | 'shapes' | 'stops' | 'stop_times' | 'transfers' | 'trips';


export enum Avaliable {
    NoInfo = 0,
    Yes = 1,
    No = 2,
}

export interface Stop  {
    stopId: string
    stopCode?: string | null;
    stopName: string | null;
    stopDesc?: string | null;
    stopLat: number | null;
    stopLon: number | null;
    zoneId?: string | null;
    stopUrl?: string | null;
    locationType?: LocationType |  null;
    parentStation?: string | null;
    stopTimeZone?: string | null;
    wheelchairBoarding?: Avaliable | null
}

export enum LocationType {
	Stop = 0,
	Station = 1
}
    