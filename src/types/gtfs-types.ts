// borrowed from: https://github.com/NotWoods/query-pouch-gtfs/blob/master/src/interfaces.ts
export type GTFSName = 'agency' | 'calendar' | 'calendar_dates'
  | 'fare_attributes' | 'fare_rules' | 'feed_info' | 'frequencies'
  | 'routes' | 'shapes' | 'stops' | 'stop_times' | 'transfers' | 'trips';

export type HexCode = string;

export enum Avaliable {
    NoInfo = 0,
    Yes = 1,
    No = 2,
}

export enum Direction {
    NoInfo = 0,
    Yes = 1,
    No = 2,
}


export interface Stop  {
    stopId: string;
    stopCode?: string | null;
    stopName: string | null;
    stopDesc?: string | null;
    stopLat: number;
    stopLon: number;
    zoneId?: string | null;
    stopUrl?: string | null;
    locationType?: LocationType |  null;
    parentStation?: string | null;
    stopTimeZone?: string | null;
    wheelchairBoarding?: Avaliable | null;
}

export enum RouteType {
  Tram = 0,
  Subway = 1,
  Rail = 2,
  Bus = 3,
  Ferry = 4,
  CableCar = 5,
  Gondola = 6,
  Funicular = 7,
}

export interface Route {
  routeId: string;
  agencyId?: string;
  routeShortName: string;
  routeLongName: string;
  routeDesc?: string;
  routeType: RouteType;
  routeUrl?: string;
  routeColor?: HexCode;
  routeTextColor?: HexCode;
}

export enum LocationType {
  Stop = 0,
  Station = 1,
}

export interface Trip {
  routeId: string;
  serviceId: string;
  tripId: string;
  tripHeadsign?: string;
  tripShortName?: string;
  directionId?: boolean;
  blockId?: string;
  shapeId?: string;
  wheelchairAccessible?: Avaliable;
  bikesAllowed?: Avaliable;
}

export type SecondsSinceMidnight = number;

export enum PickupType {
  Regular = 0,
  None = 1,
  Phone = 2,
  Driver = 3,
}

export interface StopTime {
  tripId: string;
  arrivalTime: SecondsSinceMidnight;
  departureTime: SecondsSinceMidnight;
  stopId: string;
  stopSequence: number;
  stopHeadsign?: string;
  pickupType?: PickupType;
  dropOffType?: PickupType;
  shapeDistTraveled?: number;
  timepoint?: boolean;
}
