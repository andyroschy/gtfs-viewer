<template> 
    <aside>
        <h4> {{stop.name}} </h4>
        <table>
        <thead>
            <tr >
                <td>Trip</td>
                <td>Arrival</td>
                <td>Departure</td>
            </tr>
        </thead>
        <tbody>
                <tr v-for="stopTime in schedule" :key="stopTime.tripId + stopTime.stopId + stopTime.stopSequence">
                    <td>{{stopTime.tripId}}</td>
                    <td>{{stopTime.arrivalTime}}</td>
                    <td>{{stopTime.departureTime}}</td>
                </tr>
            </tbody>
        </table>
    </aside>
    
</template>

<style scoped lang="scss">
  .main-map {
    box-shadow: 
        rgba(0, 0, 0, 0.2) 0px 3px 5px -2px, 
        rgba(0, 0, 0, 0.12) 0px 1px 2px 0px;
  }

  table {    
    border-collapse: collapse;    
    tr, td {
        padding-right: 10px;
    }
    thead {
        color: #EEEEEE;
        text-shadow: 1px 1px rgba(0,0,0, 0.4);
        background: #66ccff;        
        padding-right: 15px;
    }
  }

</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LMarker, LTileLayer, LPolyline, LLayerGroup, LPopup} from 'vue2-leaflet';
import L, { LatLng, imageOverlay } from 'leaflet';
import { marker } from '@/leflet-icons';
import { getTestFeed, parseFeed, getFeedFromFile } from '@/services/feed-service';
import { getAgencies } from '@/services/layer-service';
import AgencyLayer from '@/types/agency-layer';
import { StopTime, Stop } from '@/types/gtfs-types';



@Component
export default class StopDetails extends Vue {
  @Prop()
  public schedule!: StopTime[];
  @Prop()
  public stop!: Stop;


}
</script>
