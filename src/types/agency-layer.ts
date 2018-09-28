import GtfsLayer from '@/types/gtfs-layer';
import RouteLayer from '@/types/route-layer';

export default class AgencyLayer extends GtfsLayer {

    public routes: RouteLayer[] = [];

}
