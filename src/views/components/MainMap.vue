<template>
  <l-map   ref="map" :zoom="zoom" :center="center" class="main-map">
        <l-tile-layer :url="baseLayer" :attribution="attribution"></l-tile-layer>
        <!-- Agency layers -->
        <l-layer-group
            v-for="agency in agencies"
            :key="agency.id"
            :visible="agency.visible"
            layerType="overlay"
            :name="agency.name">
            <!-- Route layers -->
          <l-layer-group 
              v-for="route in agency.routes"
              :key="route.id"
              :visible="route.visible"
              layerType="overlay"
              :name="route.name" >
              <!-- route line -->
              <l-polyline
                :key="route.id"
                :color="'#' + route.color"
                :lat-lngs="route.geometry"
                :visible="route.visible"/>
                <!-- route stops -->
                 <l-layer-group                                     
                  :visible="route.stopsVisible"
                  layerType="overlay"
                  :name="route.name + '-stops'" >
                     <l-marker
                      v-for="stop in route.stops"
                      :key="stop.id"
                      :visible="stop.visible"
                      :lat-lng="stop.latlng"
                      :icon="markerIcon"
                      @click="stopClicked(stop.name)" />
                 </l-layer-group>
           
          </l-layer-group>
        </l-layer-group>
    </l-map>
</template>

<style scoped>
  .main-map {
        box-shadow: 
        rgba(0, 0, 0, 0.2) 0px 3px 5px -2px, 
        rgba(0, 0, 0, 0.12) 0px 1px 2px 0px;
  }

</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {LMap, LMarker, LTileLayer, LPolyline, LLayerGroup} from 'vue2-leaflet';
import L, { LatLng, imageOverlay } from 'leaflet';
import { marker } from '@/leflet-icons';
import { getTestFeed, parseFeed, getFeedFromFile } from '@/services/feed-service';
import { getAgencies } from '@/services/layer-service';
import { normalize } from 'path';
import AgencyLayer from '@/types/agency-layer';
import { debug, debuglog } from 'util';


@Component({
  components: {
    LMap, LMarker, LTileLayer, LPolyline, LLayerGroup
  },
})
export default class MainMap extends Vue {
  public markerIcon = marker;
  public zoom: number = 10;
  public center: LatLng = L.latLng(36.70365959719456, -116.70364379882814);
  //public marker: LatLng =  L.latLng(47.413220, -1.219482);
  public baseLayer: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  public attribution: string = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  @Prop()
  public agencies!: AgencyLayer[];

  public stopClicked(value: string) {
    alert(value);
  }

  public created() {
  }

  public mounted() {
    const self = this;
    Vue.nextTick( () => {      
      setTimeout( () => {
        let map: any = self.$refs.map;
        map.mapObject.invalidateSize();
      });
    })
  }

}
</script>
